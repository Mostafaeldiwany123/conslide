using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

namespace Conslide
{
    public class KeyboardHook
    {
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN     = 0x0100;
        private const int WM_SYSKEYDOWN  = 0x0104;

        private LowLevelKeyboardProc _proc;
        private IntPtr _hookId = IntPtr.Zero;

        // ── Events ────────────────────────────────────────────────────────────
        public event Action OnShortcutTriggered;        // Alt + Space → open palette
        public event Action<string> OnDirectCommand;    // fire command by id
        public event Action<string> OnChordStarted;     // first key pressed, e.g. "A"
        public event Action OnChordCancelled;           // chord cancelled/completed

        // ── State ─────────────────────────────────────────────────────────────
        public bool   IsTextEditing  { get; set; } = false;
        public bool   IsPro          { get; set; } = false;
        public IntPtr PowerPointHwnd { get; private set; } = IntPtr.Zero;

        // Chord tracking
        private string _chordPrefix = null;
        private Timer  _chordTimer  = null;
        private readonly object _chordLock = new object();

        // ── Win32 ─────────────────────────────────────────────────────────────
        [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
        [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
        [DllImport("user32.dll")] static extern IntPtr SetWindowsHookEx(int id, LowLevelKeyboardProc p, IntPtr mod, uint tid);
        [DllImport("user32.dll")] static extern bool UnhookWindowsHookEx(IntPtr hhk);
        [DllImport("user32.dll")] static extern IntPtr CallNextHookEx(IntPtr hhk, int n, IntPtr w, IntPtr l);
        [DllImport("kernel32.dll", CharSet = CharSet.Auto)] static extern IntPtr GetModuleHandle(string name);
        [DllImport("user32.dll", ExactSpelling = true)] static extern short GetKeyState(int key);
        [DllImport("user32.dll")] static extern bool GetGUIThreadInfo(uint idThread, out GUITHREADINFO lpgui);

        [StructLayout(LayoutKind.Sequential)]
        struct RECT { public int Left, Top, Right, Bottom; }

        [StructLayout(LayoutKind.Sequential)]
        struct GUITHREADINFO
        {
            public int cbSize;
            public int flags;
            public IntPtr hwndActive;
            public IntPtr hwndFocus;
            public IntPtr hwndCapture;
            public IntPtr hwndMenuOwner;
            public IntPtr hwndMoveSize;
            public IntPtr hwndCaret;
            public RECT rcCaret;
        }

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        // ── Shortcut maps ─────────────────────────────────────────────────────

        // Unambiguous single-key commands (no chord prefix starts with these)
        private static readonly Dictionary<int, string> SingleKeyMap =
            new Dictionary<int, string>
        {
            { 0xBF, "swap"         },  // /
            { 0x47, "add-triangle" },  // G
            { 0x55, "ungroup"      },  // U
            { 0x52, "add-rect"     },  // R
            { 0x43, "add-circle"   },  // C
            { 0x54, "add-text"     },  // T
            { 0x4C, "add-line"     },  // L
        };

        // Chord prefix keys and their second-key maps
        private static readonly Dictionary<int, string> ChordPrefixKeys =
            new Dictionary<int, string>
        {
            { 0x41, "A" },  // A
            { 0x44, "D" },  // D
            { 0x53, "S" },  // S
            { 0x4D, "M" },  // M
            { 0x45, "E" },  // E

        };
 
        private static readonly Dictionary<string, Dictionary<int, string>> ChordMap =
            new Dictionary<string, Dictionary<int, string>>
        {
            ["A"] = new Dictionary<int, string>
            {
                { 0x4C, "align-left"     },  // AL
                { 0x43, "align-center-h" },  // AC
                { 0x52, "align-right"    },  // AR
                { 0x54, "align-top"      },  // AT
                { 0x4D, "align-middle-v" },  // AM
                { 0x42, "align-bottom"   },  // AB
                { 0x58, "align-matrix"   },  // AX
                { 0x41, "add-arrow"      },  // AA
                { 0x46, "auto-fit"       },  // AF
            },
            ["D"] = new Dictionary<int, string>
            {
                { 0x48, "dist-h" },  // DH
                { 0x56, "dist-v" },  // DV
            },
            ["S"] = new Dictionary<int, string>
            {
                { 0x57, "same-width"  },  // SW
                { 0x48, "same-height" },  // SH
                { 0x53, "same-size"   },  // SS
            },
            ["M"] = new Dictionary<int, string>
            {
                { 0x53, "match-style" },  // MS
            },
            ["E"] = new Dictionary<int, string>
            {
                { 0x49, "enclose-icon" }, // EI
            },

        };

        public KeyboardHook() { _proc = HookCallback; }

        public void Install()
        {
            using var cur = Process.GetCurrentProcess();
            using var mod = cur.MainModule;
            _hookId = SetWindowsHookEx(WH_KEYBOARD_LL, _proc, GetModuleHandle(mod.ModuleName), 0);
        }

        public void Uninstall()
        {
            CancelChord();
            UnhookWindowsHookEx(_hookId);
        }

        // ─────────────────────────────────────────────────────────────────────
        private bool IsPowerPointFocused(out IntPtr hwnd)
        {
            hwnd = GetForegroundWindow();
            if (hwnd == IntPtr.Zero) return false;
            try {
                GetWindowThreadProcessId(hwnd, out uint pid);
                using (var p = Process.GetProcessById((int)pid)) {
                    return p.ProcessName.ToLower().Contains("powerpnt");
                }
            } catch { return false; }
        }

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

        private const int GUI_CARETBLINKING = 0x00000001;

        private bool IsInTextInputOrDialog()
        {
            IntPtr fg = GetForegroundWindow();
            if (fg == IntPtr.Zero) return false;

            uint threadId = GetWindowThreadProcessId(fg, out _);
            var guiInfo = new GUITHREADINFO();
            guiInfo.cbSize = Marshal.SizeOf(typeof(GUITHREADINFO));

            if (GetGUIThreadInfo(threadId, out guiInfo))
            {
                // 1. Check if the OS thinks a caret is explicitly blinking
                if (guiInfo.hwndCaret != IntPtr.Zero && (guiInfo.flags & GUI_CARETBLINKING) != 0) return true;

                // 2. Fallback check: Look at the exact child window that has keyboard focus
                IntPtr focusedChild = guiInfo.hwndFocus;
                if (focusedChild != IntPtr.Zero)
                {
                    StringBuilder sb = new StringBuilder(256);
                    GetClassName(focusedChild, sb, sb.Capacity);
                    string className = sb.ToString();

                    // Office's "Stock Images", "Icons", and Add-ins use Edge WebView2 internally (Chrome_WidgetWin_1).
                    // The Ribbon and native Office search boxes use NetUIHWND or RICHEDIT.
                    if (className == "NetUIHWND" ||
                        className.Contains("Chrome") ||
                        className.Contains("WebView") ||
                        className.Contains("Cef") ||
                        className.Contains("RICHEDIT") ||
                        className.Contains("Edit"))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        private IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode < 0 || (wParam != (IntPtr)WM_KEYDOWN && wParam != (IntPtr)WM_SYSKEYDOWN))
                return CallNextHookEx(_hookId, nCode, wParam, lParam);

            int  vkCode = Marshal.ReadInt32(lParam);
            bool ctrl   = (GetKeyState(0x11) & 0x8000) != 0;
            bool shift  = (GetKeyState(0x10) & 0x8000) != 0;
            bool alt    = (GetKeyState(0x12) & 0x8000) != 0;
            bool win    = (GetKeyState(0x5B) & 0x8000) != 0 || (GetKeyState(0x5C) & 0x8000) != 0;
            
            // For shortcuts, we allow Ctrl+Shift. For single-key/chords, we allow NO modifiers.
            bool anyModForShortcuts = ctrl || alt; 
            bool anyModForChords = ctrl || alt || shift || win;

            // ── Alt + Space → open palette ─────────────────────────────────
            if (alt && vkCode == 0x20) // VK_SPACE
            {
                if (IsPowerPointFocused(out IntPtr hwnd))
                {
                    PowerPointHwnd = hwnd;
                    OnShortcutTriggered?.Invoke();
                    return (IntPtr)1;
                }
            }



            // Everything below: PPT must be active, no modifier, not text-editing, and USER IS PRO
            if (!IsPro || anyModForChords || IsTextEditing || IsInTextInputOrDialog() || !IsPowerPointFocused(out IntPtr currentHwnd))
                return CallNextHookEx(_hookId, nCode, wParam, lParam);
            
            PowerPointHwnd = currentHwnd;

            // ── Chord: second key ────────────────────────────────────────────
            lock (_chordLock)
            {
                if (_chordPrefix != null)
                {
                    // Must still be in PPT to finish a chord
                    if (!IsPowerPointFocused(out _)) { Reset(); return CallNextHookEx(_hookId, nCode, wParam, lParam); }

                    string prefix = _chordPrefix;
                    CancelChord();

                    if (ChordMap[prefix].TryGetValue(vkCode, out string cmdId))
                    {
                        OnDirectCommand?.Invoke(cmdId);
                        return (IntPtr)1; // suppress key
                    }
                    // Second key didn't match → suppress both (to avoid typing the chord char)
                    return (IntPtr)1;
                }
            }

            // ── Start chord ──────────────────────────────────────────────────
            if (ChordPrefixKeys.TryGetValue(vkCode, out string chPrefix))
            {
                lock (_chordLock)
                {
                    _chordPrefix = chPrefix;
                    OnChordStarted?.Invoke(chPrefix);
                    // Auto-cancel after 1.5 s
                    _chordTimer = new Timer(_ => CancelChord(), null, 1500, Timeout.Infinite);
                }
                return (IntPtr)1; // suppress prefix key
            }

            // ── Single-key command ───────────────────────────────────────────
            if (SingleKeyMap.TryGetValue(vkCode, out string singleCmd))
            {
                OnDirectCommand?.Invoke(singleCmd);
                return (IntPtr)1;
            }

            return CallNextHookEx(_hookId, nCode, wParam, lParam);
        }

        private void CancelChord()
        {
            lock (_chordLock)
            {
                _chordTimer?.Dispose();
                _chordTimer  = null;
                _chordPrefix = null;
            }
            OnChordCancelled?.Invoke();
        }

        public void Reset()
        {
            CancelChord();
        }
    }
}
