using System;
using System.Windows.Forms;
using Velopack;

namespace Conslide
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            // Configure Velopack with auto-restart on update
            VelopackApp.Build()
                .WithFirstRun((v) => {
                    // First install - no special action needed
                })
                .WithRestarted((v) => {
                    // App was restarted after update
                    System.Diagnostics.Debug.WriteLine($"[Velopack] Restarted after update to {v}");
                })
                .Run();

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