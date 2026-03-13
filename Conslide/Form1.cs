using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;

namespace Conslide
{
    public class Form1 : Form
    {
        private Microsoft.Web.WebView2.WinForms.WebView2 webView;
        private KeyboardHook _hook;
        private PowerPointService _ppt = new PowerPointService();
        private System.Windows.Forms.Timer _stateTimer;
        private ChordHintForm _chordHint;
        private NotifyIcon _trayIcon;
        private ContextMenuStrip _trayMenu;

        private bool _restorePaletteWhenPptFocused = false;

        private string _pendingWebMessage;

        [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr hWnd, out RECT r);
        [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
        [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll", EntryPoint = "SetWindowLongPtr", SetLastError = true)]
        private static extern IntPtr SetWindowLongPtr(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

        private const int GWLP_HWNDPARENT = -8;

        private const int WS_EX_TOOLWINDOW = 0x00000080;
        private const int WS_EX_APPWINDOW = 0x00040000;

        [StructLayout(LayoutKind.Sequential)]
        struct RECT { public int Left, Top, Right, Bottom; }

        [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
        private static extern IntPtr CreateRoundRectRgn(
            int nLeftRect, int nTopRect, int nRightRect, int nBottomRect, 
            int nWidthEllipse, int nHeightEllipse);

        public Form1()
        {
            SetupTrayIcon(); // Must be first so icon is available
            SetupForm();
            EnsureStartupRegistration();
            UpdateManager.Initialize(); // Initialize Velopack update manager
            UpdateManager.UpdateReady += OnUpdateReady;
            SetupWebView();
            SetupHook();
            SetupStatePoller();
            
            // Check for updates on startup
            System.Threading.Tasks.Task.Run(async () =>
            {
                await UpdateManager.CheckForUpdatesAsync();
            });
        }

        private void OnUpdateReady()
        {
            if (InvokeRequired) { BeginInvoke(new Action(OnUpdateReady)); return; }

            string version = UpdateManager.GetPendingUpdateVersion();
            string msg = $"UPDATE_READY:{version}";

            if (webView?.CoreWebView2 != null)
            {
                webView.CoreWebView2.PostWebMessageAsString(msg);
            }
            else
            {
                _pendingWebMessage = msg;
            }
        }

        // ── System Tray Icon ───────────────────────────────────────────────────
        private void SetupTrayIcon()
        {
            // Load the icon from the executable's directory
            string iconPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "conslide_favicon.ico");
            Icon icon = null;
            
            if (System.IO.File.Exists(iconPath))
            {
                try { icon = new Icon(iconPath); }
                catch { icon = SystemIcons.Application; }
            }
            else
            {
                icon = SystemIcons.Application; // Fallback to default
            }

            // Create context menu
            _trayMenu = new ContextMenuStrip();
            _trayMenu.Items.Add("Open Palette", null, (s, e) => ShowPalette());
            _trayMenu.Items.Add("Check for Updates", null, async (s, e) => await CheckUpdatesWithNotification());
            _trayMenu.Items.Add(new ToolStripSeparator());
            _trayMenu.Items.Add("Restart App", null, (s, e) => RestartApp());
            _trayMenu.Items.Add("Reset (Clear Data)", null, (s, e) => ResetApp());
            _trayMenu.Items.Add(new ToolStripSeparator());
            _trayMenu.Items.Add("Exit", null, (s, e) => ExitApp());

            // Create tray icon
            _trayIcon = new NotifyIcon
            {
                Icon = icon,
                Text = "Conslide",
                Visible = true,
                ContextMenuStrip = _trayMenu
            };

            // Double-click opens palette
            _trayIcon.DoubleClick += (s, e) => ShowPalette();
        }

        private void RestartApp()
        {
            try
            {
                _trayIcon.Visible = false;
                _hook?.Uninstall();
                Application.Restart();
            }
            catch { }
        }

        private void ResetApp()
        {
            var result = MessageBox.Show(
                "This will clear all Conslide data and reset the app. Continue?",
                "Reset Conslide",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning);

            if (result == DialogResult.Yes)
            {
                try
                {
                    // Clear app data folder
                    string appData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Conslide");
                    if (Directory.Exists(appData))
                        Directory.Delete(appData, true);

                    // Clear local app data folder
                    string localAppData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Conslide");
                    if (Directory.Exists(localAppData))
                        Directory.Delete(localAppData, true);

                    RestartApp();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Failed to reset: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void ExitApp()
        {
            _trayIcon.Visible = false;
            _trayIcon.Dispose();
            _hook?.Uninstall();
            Application.Exit();
        }

        private async System.Threading.Tasks.Task CheckUpdatesWithNotification()
        {
            // Show checking dialog
            var checkingForm = new Form
            {
                FormBorderStyle = FormBorderStyle.FixedDialog,
                StartPosition = FormStartPosition.CenterScreen,
                Size = new Size(300, 120),
                Text = "Check for Updates",
                MaximizeBox = false,
                MinimizeBox = false,
                BackColor = Color.White
            };
            var label = new Label
            {
                Text = "Checking for updates...",
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleCenter,
                Font = new Font("Segoe UI", 10f)
            };
            checkingForm.Controls.Add(label);
            checkingForm.Show();
            
            await UpdateManager.CheckForUpdatesAsync();
            
            checkingForm.Close();
            
            if (UpdateManager.HasPendingUpdate())
            {
                string version = UpdateManager.GetPendingUpdateVersion();
                var result = MessageBox.Show(
                    $"Update {version} is ready to install.\n\nRestart Conslide to apply the update?",
                    "Update Available",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Information);
                
                if (result == DialogResult.Yes)
                {
                    UpdateManager.ApplyUpdateAndRestart();
                }
            }
            else
            {
                MessageBox.Show(
                    "You are up to date!",
                    "No Updates Available",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
            }
        }

        // ── Form ──────────────────────────────────────────────────────────────
 private void SetupForm()
{
    FormBorderStyle = FormBorderStyle.None;
    ShowInTaskbar   = false;
    TopMost         = true;
    BackColor       = Color.FromArgb(20, 20, 20); // Deep charcoal, near black
    // Removing TransparencyKey entirely to ensure mouse events are never passed through.
    // Rounded corners will now be handled inside the WebView2 via CSS or by setting Form Region.
    // TALLER AND WIDER for that Apple Spotlight look
    Size            = new Size(680, 480); 
    StartPosition   = FormStartPosition.Manual;
    Opacity         = 0;

    // Apply native rounded corners (12px radius = 24px ellipse size)
    // This perfectly crops the sharp white corners caused by the solid background
    Region = System.Drawing.Region.FromHrgn(CreateRoundRectRgn(0, 0, Width, Height, 24, 24));
}

        protected override CreateParams CreateParams
        {
            get
            {
                var cp = base.CreateParams;
                // Hide from Alt-Tab / task switcher
                cp.ExStyle |= WS_EX_TOOLWINDOW;
                cp.ExStyle &= ~WS_EX_APPWINDOW;
                return cp;
            }
        }

        // ── WebView2 ──────────────────────────────────────────────────────────
        private async void SetupWebView()
        {
            webView      = new Microsoft.Web.WebView2.WinForms.WebView2();
            webView.Dock = DockStyle.Fill;
            Controls.Add(webView);

            var env = await CoreWebView2Environment.CreateAsync(null, null,
                new CoreWebView2EnvironmentOptions("--disable-features=msSmartScreenProtection"));
            await webView.EnsureCoreWebView2Async(env);

            string localDistPath = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "dist");
            if (System.IO.Directory.Exists(localDistPath))
            {
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping("app.local", localDistPath, CoreWebView2HostResourceAccessKind.Allow);
            }

            webView.DefaultBackgroundColor                  = Color.White; // Solid background for mouse capture
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.Settings.IsWebMessageEnabled = true;
            webView.CoreWebView2.WebMessageReceived         += HandleWebMessage;

            if (!string.IsNullOrEmpty(_pendingWebMessage))
            {
                webView.CoreWebView2.PostWebMessageAsString(_pendingWebMessage);
                _pendingWebMessage = null;
            }

#if DEBUG
            // In debug mode, connect to the local webpack dev server for live updates
            webView.Source = new Uri("http://localhost:3000/palette.html");
#else
            // In release mode, serve the static frontend app directly from the binary directory!
            webView.Source = new Uri("http://app.local/palette.html");
#endif
        }

        protected override void OnDeactivate(EventArgs e)
        {
            base.OnDeactivate(e);
            
            // Check if the new foreground window is still us or our children
            IntPtr fg = GetForegroundWindow();
            if (fg == this.Handle || fg == _chordHint?.Handle) return;

            if (Opacity > 0)
            {
                // Only auto-restore when the palette was hidden because we switched AWAY from PowerPoint.
                // If the user clicked inside PowerPoint, treat it as an intentional close.
                _restorePaletteWhenPptFocused = !IsPptWindow(fg);
                HidePalette();
            }
        }

        // ── Keyboard hook ─────────────────────────────────────────────────────
        private void SetupHook()
        {
            _chordHint = new ChordHintForm();
            _hook = new KeyboardHook();
            _hook.OnShortcutTriggered += ShowPalette;
            _hook.OnDirectCommand     += RunDirectCommand;
            _hook.OnChordStarted      += prefix => _chordHint.ShowHint(prefix, _hook.PowerPointHwnd);
            _hook.OnChordCancelled    += () => _chordHint.HideHint();
            _hook.Install();
            UpdateProStatus();
        }

        private void UpdateProStatus()
        {
            try {
                string sessionFile = System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "Conslide", "session.json");
                if (System.IO.File.Exists(sessionFile)) {
                    string json = System.IO.File.ReadAllText(sessionFile);
                    _hook.IsPro = json.ToLower().Contains("\"tier\":\"pro\"");
                } else {
                    _hook.IsPro = false;
                }
            } catch { _hook.IsPro = false; }
        }


        private int _pptCheckCounter = 0;
        private bool _wasPptRunning = false;

        private void EnsureStartupRegistration()
        {
            try
            {
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true))
                {
                    if (key != null)
                    {
                        string appName = "Conslide";
                        string exePath = Application.ExecutablePath;

                        object val = key.GetValue(appName);
                        if (val == null || val.ToString() != exePath)
                        {
                            key.SetValue(appName, exePath);
                        }
                    }
                }
            }
            catch { /* Ignore if registry failed */ }
        }

        // ── State poller (checks if PPT is in text-editing mode) ─────────────
        private void SetupStatePoller()
        {
            _stateTimer          = new System.Windows.Forms.Timer();
            _stateTimer.Interval = 150; // ms
            _stateTimer.Tick    += (_, __) =>
            {
                // 1. Text editing state
                _hook.IsTextEditing = _ppt.IsTextEditing();

                // 2. Aggressive Safety: If foreground is not PPT or OurUI, reset everything.
                IntPtr fg = GetForegroundWindow();
                bool isOurUI = (fg == Handle || fg == _chordHint.Handle);
                bool isPpt = IsPptWindow(fg);

                if (!isOurUI && !isPpt)
                {
                    if (Opacity > 0)
                    {
                        _restorePaletteWhenPptFocused = true;
                        HidePalette();
                    }
                    _chordHint?.HideHint();
                    _hook.Reset();
                }

                // If the user clicked back into PowerPoint, treat it as an intentional close.
                if (!isOurUI && isPpt && Opacity > 0)
                {
                    _restorePaletteWhenPptFocused = false;
                    HidePalette();
                }

                // If we hid the palette only because PPT wasn't focused, restore it when PPT comes back.
                if (isPpt && _restorePaletteWhenPptFocused && Opacity == 0)
                {
                    RestorePaletteToPowerPoint();
                }

                // (We stay asleep in the background even if PPT closes, so if they re-open PPT later, we are still ready to help!)
            };
            _stateTimer.Start();
        }

        private void EnsureOwnedByPowerPoint(IntPtr pptHwnd)
        {
            if (pptHwnd == IntPtr.Zero) return;
            // Owner relationship helps keep the palette attached to PPT and keeps it out of Alt-Tab.
            try { _ = Handle; } catch { return; }
            try { SetWindowLongPtr(this.Handle, GWLP_HWNDPARENT, pptHwnd); } catch { }
        }

        private bool IsPptWindow(IntPtr hwnd)
        {
            if (hwnd == IntPtr.Zero) return false;
            try {
                GetWindowThreadProcessId(hwnd, out uint pid);
                using (var p = System.Diagnostics.Process.GetProcessById((int)pid)) {
                    return p.ProcessName.ToLower().Contains("powerpnt");
                }
            } catch { return false; }
        }

        [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr hWnd);
        [DllImport("kernel32.dll")] static extern uint GetCurrentThreadId();
        [DllImport("user32.dll")] static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

        // ── Palette show / position ───────────────────────────────────────────
        private void ShowPalette()
        {
            if (InvokeRequired) { Invoke(new Action(ShowPalette)); return; }

            IntPtr pptHwnd = _hook.PowerPointHwnd;
            if (pptHwnd == IntPtr.Zero) return;

            _restorePaletteWhenPptFocused = false;
            EnsureOwnedByPowerPoint(pptHwnd);

            if (GetWindowRect(pptHwnd, out RECT r))
            {
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;
                Left = r.Left + (w - Width)  / 2;
                Top  = r.Top  + (int)(h * 0.28);
            }

            // Force Focus Stealing (bypasses Windows foreground lock)
            IntPtr currentFg = GetForegroundWindow();
            uint fgThread = GetWindowThreadProcessId(currentFg, out _);
            uint appThread = GetCurrentThreadId();

            if (fgThread != appThread)
            {
                AttachThreadInput(appThread, fgThread, true);
                this.Show();
                this.Activate();
                SetForegroundWindow(this.Handle);
                AttachThreadInput(appThread, fgThread, false);
            }
            else
            {
                this.Show();
                this.Activate();
                SetForegroundWindow(this.Handle);
            }
            string sessionFile = System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "Conslide", "session.json");
            string sessionJson = "{}";
            if (System.IO.File.Exists(sessionFile)) {
                try { sessionJson = System.IO.File.ReadAllText(sessionFile); } catch { }
            }
            UpdateProStatus();
            webView.CoreWebView2.PostWebMessageAsString("FOCUS_WITH_SESSION:" + sessionJson);

            // Notify if update is ready to install
            if (UpdateManager.HasPendingUpdate())
            {
                string version = UpdateManager.GetPendingUpdateVersion();
                // Show simple notification in palette
                webView.CoreWebView2.PostWebMessageAsString($"UPDATE_READY:{version}");
            }
            else 
            {
                // Check silently in the background (UpdateManager handles rate-limiting)
                System.Threading.Tasks.Task.Run(async () => await UpdateManager.CheckForUpdatesAsync());
            }

            this.Opacity = 1;

            Activate();
            webView.Select();
            webView.Focus();
        }

        private void RestorePaletteToPowerPoint()
        {
            try
            {
                IntPtr pptHwnd = _hook.PowerPointHwnd;
                if (pptHwnd == IntPtr.Zero) return;

                EnsureOwnedByPowerPoint(pptHwnd);

                if (GetWindowRect(pptHwnd, out RECT r))
                {
                    int w = r.Right - r.Left;
                    int h = r.Bottom - r.Top;
                    Left = r.Left + (w - Width) / 2;
                    Top = r.Top + (int)(h * 0.28);
                }

                // Show without stealing focus from PowerPoint
                this.Show();
                this.Opacity = 1;
                _restorePaletteWhenPptFocused = false;
            }
            catch
            {
                // no-op
            }
        }

        // ── Direct command routing (from keyboard shortcut, no palette) ───────
        private void RunDirectCommand(string cmdId)
        {
            System.Diagnostics.Debug.WriteLine($"[COMMAND] Executing: {cmdId}");
            if (CmdMap.TryGetValue(cmdId, out var action))
            {
                System.Threading.ThreadPool.QueueUserWorkItem(_ => 
                {
                    try 
                    {
                        System.Diagnostics.Debug.WriteLine($"[COMMAND] Running action for: {cmdId}");
                        action(_ppt);
                        System.Diagnostics.Debug.WriteLine($"[COMMAND] Completed: {cmdId}");
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine($"[COMMAND] Error in {cmdId}: {ex.Message}");
                    }
                });
            }
            else
            {
                System.Diagnostics.Debug.WriteLine($"[COMMAND] Command not found: {cmdId}");
            }
        }

        private void HidePalette()
        {
            if (InvokeRequired) { Invoke(new Action(HidePalette)); return; }
            Opacity = 0;
            Hide();
            _chordHint?.HideHint();
        }

        // ── Web message routing (from palette UI click) ───────────────────────
        private void HandleWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            string msg = e.TryGetWebMessageAsString();
            System.Diagnostics.Debug.WriteLine("[Palette Message] " + msg);

            if (msg.StartsWith("OPEN_URL:"))
            {
                string url = msg.Substring("OPEN_URL:".Length);
                try { System.Diagnostics.Process.Start(url); } catch { }
                return;
            }

            if (msg == "CLOSE_PALETTE")
            {
                HidePalette();
                return;
            }

            if (msg == "GET_SESSION")
            {
                string sessionFile = System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "Conslide", "session.json");
                if (System.IO.File.Exists(sessionFile))
                {
                    string json = System.IO.File.ReadAllText(sessionFile);
                    webView.CoreWebView2.PostWebMessageAsString("SESSION_DATA:" + json);
                }
                else
                {
                    webView.CoreWebView2.PostWebMessageAsString("SESSION_DATA:{}");
                }
                return;
            }

            if (msg.StartsWith("UPDATE_TIER:"))
            {
                string newTier = msg.Substring("UPDATE_TIER:".Length);
                string sessionFile = System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "Conslide", "session.json");
                if (System.IO.File.Exists(sessionFile))
                {
                    try {
                        string json = System.IO.File.ReadAllText(sessionFile);
                        json = System.Text.RegularExpressions.Regex.Replace(json, "\"tier\"\\s*:\\s*\"[^\"]+\"", $"\"tier\":\"{newTier}\"");
                        System.IO.File.WriteAllText(sessionFile, json);
                        UpdateProStatus();
                    } catch { }
                }
                return;
            }

            if (msg == "GET_SLIDE_TEXT")
            {
                string json = _ppt.GetSlideText();
                webView.CoreWebView2.PostWebMessageAsString("SLIDE_TEXT:" + json);
                return;
            }

            if (msg.StartsWith("APPLY_TRANSLATION:"))
            {
                string json = msg.Substring("APPLY_TRANSLATION:".Length);
                _ppt.ApplyTranslation(json);
                HidePalette();
                return;
            }

            if (msg == "GET_SELECTED_TEXT")
            {
                string text = _ppt.GetSelectedText();
                // Send back string as Base64 to avoid JSON/quote parsing issues for now, or just send directly
                // WebView2 allows postMessage with string. If text has newlines, it's fine.
                webView.CoreWebView2.PostWebMessageAsString("SELECTED_TEXT:" + text);
                return;
            }

            if (msg.StartsWith("REPLACE_SELECTED_TEXT:"))
            {
                string text = msg.Substring("REPLACE_SELECTED_TEXT:".Length);
                _ppt.ReplaceSelectedText(text, false);
                HidePalette();
                return;
            }

            if (msg.StartsWith("REPLACE_SELECTED_TEXT_BULLETS:"))
            {
                string text = msg.Substring("REPLACE_SELECTED_TEXT_BULLETS:".Length);
                _ppt.ReplaceSelectedText(text, true);
                HidePalette();
                return;
            }

            if (msg.StartsWith("INSERT_LEAD_SENTENCE:"))
            {
                string text = msg.Substring("INSERT_LEAD_SENTENCE:".Length);
                _ppt.InsertLeadSentence(text);
                HidePalette();
                return;
            }

            if (msg == "APPLY_UPDATE")
            {
                // Apply update and restart
                UpdateManager.ApplyUpdateAndRestart();
                return;
            }

            // ── AI Agent Chatbot Commands ─────────────────────────────────────
            if (msg.StartsWith("CREATE_SLIDE_FROM_JSON:"))
            {
                string json = msg.Substring("CREATE_SLIDE_FROM_JSON:".Length);
                string result = _ppt.CreateSlideFromJson(json);
                webView.CoreWebView2.PostWebMessageAsString("AGENT_RESULT:" + result);
                return;
            }

            if (msg.StartsWith("EDIT_CURRENT_SLIDE_FROM_JSON:"))
            {
                string json = msg.Substring("EDIT_CURRENT_SLIDE_FROM_JSON:".Length);
                string result = _ppt.EditCurrentSlideFromJson(json);
                webView.CoreWebView2.PostWebMessageAsString("AGENT_RESULT:" + result);
                return;
            }

            if (msg == "GET_PPT_CONTEXT")
            {
                int slideCount = _ppt.GetSlideCount();
                int currentSlide = _ppt.GetCurrentSlideIndex();
                string slideText = _ppt.GetSlideText();
                string context = $"{{\"slideCount\":{slideCount},\"currentSlide\":{currentSlide},\"slideText\":{slideText}}}";
                webView.CoreWebView2.PostWebMessageAsString("PPT_CONTEXT:" + context);
                return;
            }

            if (msg == "GET_SLIDE_JSON")
            {
                string slideJson = _ppt.GetCurrentSlideAsJson();
                webView.CoreWebView2.PostWebMessageAsString("SLIDE_JSON:" + slideJson);
                return;
            }

            if (msg == "CREATE_BLANK_SLIDE")
            {
                int idx = _ppt.CreateNewSlide();
                webView.CoreWebView2.PostWebMessageAsString("AGENT_RESULT:OK:Blank slide " + idx + " created");
                return;
            }

            if (msg == "DUPLICATE_SLIDE")
            {
                string result = _ppt.DuplicateCurrentSlide();
                webView.CoreWebView2.PostWebMessageAsString("AGENT_RESULT:" + result);
                return;
            }

            if (msg != null && msg.StartsWith("CMD:"))
            {
                string cmdId = msg.Substring(4);
                
                // Special commands (non-PowerPoint operations)
                if (cmdId == "example")
                {
                    OpenExampleTaskPane();
                    return;
                }
                

                // Requirement: Error handling if nothing is selected for manipulation commands
                // Manipulation commands usually aren't 'add-' or 'insert-' or AI features
                bool isCreation = cmdId.StartsWith("add-") || cmdId.StartsWith("insert-");
                if (!isCreation)
                {
                    if (_ppt.GetSelectionCount() == 0)
                    {
                        webView.CoreWebView2.PostWebMessageAsString("NOTIFY_NO_SELECTION");
                        return; // Keep palette open so JS can show the error
                    }
                }

                RunDirectCommand(cmdId);
                HidePalette();
            }
        }

        // ── Open Example Task Pane ────────────────────────────────────────────
        private void OpenExampleTaskPane()
        {
            System.Diagnostics.Debug.WriteLine("[Command] Opening Example Task Pane");
            // The task pane will be opened via PowerPoint's Office.addin.showAsTaskpane()
            // when the manifest is properly installed
            // For now, you can trigger this via the manifest being registered
        }

        // ── Command map ───────────────────────────────────────────────────────
        private static readonly Dictionary<string, Action<PowerPointService>> CmdMap =
            new Dictionary<string, Action<PowerPointService>>
        {
            { "align-left",     p => p.AlignLeft()      },
            { "align-center-h", p => p.AlignCenterH()   },
            { "align-right",    p => p.AlignRight()     },
            { "align-top",      p => p.AlignTop()       },
            { "align-middle-v", p => p.AlignMiddleV()   },
            { "align-bottom",   p => p.AlignBottom()    },
            { "dist-h",         p => p.DistributeH()    },
            { "dist-v",         p => p.DistributeV()    },
            { "same-width",     p => p.SameWidth()      },
            { "same-height",    p => p.SameHeight()     },
            { "same-size",      p => p.SameSize()       },
            { "swap",           p => p.SwapShapes()     },
            { "group",          p => p.Group()          },
            { "ungroup",        p => p.Ungroup()        },
            { "add-rect",       p => p.AddRectangle()   },
            { "add-circle",     p => p.AddCircle()      },
            { "add-triangle",   p => p.AddTriangle()    },
            { "add-text",       p => p.AddTextBox()     },
            { "add-line",       p => p.AddLine()        },
            { "add-arrow",      p => p.AddArrow()       },

            { "align-matrix",   p => p.AlignMatrix()    },
            { "match-style",    p => p.MatchStyle()     },
            { "auto-fit",       p => p.AutoFit()        },
            { "enclose-icon",   p => p.EncloseIcon()    },
            { "expand-text",    p => p.ExpandText()     },
            { "add-row",        p => p.AddRow()         },
            { "add-col",        p => p.AddColumn()      },
        };

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            _stateTimer?.Stop();
            _hook.Uninstall();
            base.OnFormClosing(e);
        }
    }
}
