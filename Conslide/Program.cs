using System;
using System.Windows.Forms;

namespace Conslide
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            // Set working directory to app location (important for MSIX packaged apps)
            System.IO.Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Ensure clean shutdown for COM objects
            Application.ApplicationExit += (s, e) => {
                ForceCleanup();
            };

            if (!WelcomeForm.IsAuthenticated())
            {
                using (var welcome = new WelcomeForm())
                {
                    var result = welcome.ShowDialog();
                    if (!WelcomeForm.IsAuthenticated())
                    {
                        ForceCleanup();
                        return;
                    }
                }

                ForceCleanup();
            }

            Application.Run(new Form1());
            ForceCleanup();
        }

        static void ForceCleanup()
        {
            // Aggressive cleanup of COM objects to prevent file locks
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            System.Threading.Thread.Sleep(300);
        }
    }
}