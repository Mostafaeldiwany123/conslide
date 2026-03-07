using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Conslide
{
    /// <summary>
    /// Tiny floating hint that appears briefly when a chord prefix key is pressed.
    /// Shows something like "A ▸" to indicate the system is waiting for the second key.
    /// </summary>
    public class ChordHintForm : Form
    {
        private Label _label;

        [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
        [StructLayout(LayoutKind.Sequential)]
        struct RECT { public int Left, Top, Right, Bottom; }

        public ChordHintForm()
        {
            FormBorderStyle = FormBorderStyle.None;
            ShowInTaskbar   = false;
            TopMost         = true;
            BackColor       = Color.White;
            Size            = new Size(160, 60);
            Opacity         = 0;
            StartPosition   = FormStartPosition.Manual;

            // Premium Rounded look
            Region = System.Drawing.Region.FromHrgn(CreateRoundRectRgn(0, 0, Width, Height, 24, 24));

            _label = new Label
            {
                Text      = "",
                ForeColor = Color.FromArgb(60, 60, 70),
                Font      = new Font("Inter", 20f, FontStyle.Bold),
                TextAlign = ContentAlignment.MiddleCenter,
                Dock      = DockStyle.Fill,
                BackColor = Color.Transparent,
            };
            Controls.Add(_label);
        }

        private System.Drawing.Drawing2D.GraphicsPath GetRoundedPath(Rectangle rect, int radius)
        {
            var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddArc(rect.X, rect.Y, radius, radius, 180, 90);
            path.AddArc(rect.X + rect.Width - radius, rect.Y, radius, radius, 270, 90);
            path.AddArc(rect.X + rect.Width - radius, rect.Y + rect.Height - radius, radius, radius, 0, 90);
            path.AddArc(rect.X, rect.Y + rect.Height - radius, radius, radius, 90, 90);
            path.CloseFigure();
            return path;
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            // Subtle premium border
            using (Pen p = new Pen(Color.FromArgb(210, 210, 220), 2))
            {
                e.Graphics.DrawPath(p, GetRoundedPath(new Rectangle(1, 1, Width - 3, Height - 3), 24));
            }
        }

        [DllImport("Gdi32.dll")] private static extern IntPtr CreateRoundRectRgn(int l, int t, int r, int b, int w, int h);

        public void ShowHint(string prefix, IntPtr pptHwnd)
        {
            if (InvokeRequired) { Invoke(new Action(() => ShowHint(prefix, pptHwnd))); return; }

            // 1. Better text with clear indicator
            _label.Text = prefix.ToUpper() + "  ▸  ?";

            Opacity = 1.0;
            Show(); // Show first to ensure handle is created

            // 2. Exact Positioning: Bottom-Center of PowerPoint
            if (pptHwnd != IntPtr.Zero && GetWindowRect(pptHwnd, out RECT r))
            {
                int pptW = r.Right - r.Left;
                int pptH = r.Bottom - r.Top;
                
                // Horizontal Center
                int newL = r.Left + (pptW - Width) / 2;
                // Bottom anchored
                int newT = r.Bottom - Height - (int)(pptH * 0.12);

                Location = new Point(newL, newT);
            }
            
            BringToFront();
        }

        public void HideHint()
        {
            if (InvokeRequired) { Invoke(new Action(HideHint)); return; }
            Opacity = 0;
            Hide();
        }
    }
}
