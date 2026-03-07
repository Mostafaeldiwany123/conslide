using System;
using System.Drawing;
using System.Windows.Forms;

namespace Conslide
{
    public class UpdatingForm : Form
    {
        public UpdatingForm()
        {
            this.Text = "Updating Conslide";
            this.Size = new Size(400, 150);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.None;
            this.BackColor = Color.FromArgb(124, 58, 237); // Purple matching app theme
            
            var label = new Label
            {
                Text = "Updating to latest version...",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 14, FontStyle.Regular),
                AutoSize = false,
                TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
                Dock = DockStyle.Fill
            };
            
            this.Controls.Add(label);
        }
    }
}
