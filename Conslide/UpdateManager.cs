using System;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using Velopack;
using Velopack.Sources;

namespace Conslide
{
    public class UpdateManager
    {
        private static Velopack.UpdateManager _um;
        private static UpdateInfo _updateInfo;
        private static bool _updateDownloaded = false;
        private static bool _isDownloading = false;
        private static DateTime _lastUpdateCheck = DateTime.MinValue;

        public static event Action UpdateReady;

        private static void Log(string msg)
        {
            try {
                File.AppendAllText(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Conslide", "updater_debug.log"), $"[{DateTime.Now:HH:mm:ss}] {msg}\n");
            } catch { }
        }

        public static void Initialize()
        {
            try
            {
                Log("Initialize called.");
                var source = new GithubSource("https://github.com/Mostafaeldiwany123/conslide", null, false);
                _um = new Velopack.UpdateManager(source);
                Log($"UpdateManager created. IsInstalled: {_um.IsInstalled}");

                Task.Run(async () => await CheckForUpdatesAsync());
            }
            catch (Exception ex)
            {
                Log($"Init failed: {ex.Message}");
            }
        }

        public static async Task CheckForUpdatesAsync()
        {
            try
            {
                if ((DateTime.Now - _lastUpdateCheck).TotalMinutes < 15) return;
                _lastUpdateCheck = DateTime.Now;

                Log("CheckForUpdatesAsync started.");
                if (_um == null || !_um.IsInstalled)
                {
                    Log("App is not installed via Velopack. Skipping update check.");
                    return;
                }

                _updateInfo = await _um.CheckForUpdatesAsync();
                if (_updateInfo != null)
                {
                    Log($"Update available: {_updateInfo.TargetFullRelease.Version}");
                    await DownloadUpdateInBackground();
                }
                else
                {
                    Log("No updates available.");
                }
            }
            catch (Exception ex)
            {
                Log($"Check failed: {ex.Message}");
            }
        }

        private static async Task DownloadUpdateInBackground()
        {
            if (_updateInfo == null || _isDownloading || _updateDownloaded) return;
            
            _isDownloading = true;
            try
            {
                Log("Downloading update...");
                await _um.DownloadUpdatesAsync(_updateInfo);
                _updateDownloaded = true;
                Log("Downloaded update successfully.");

                try
                {
                    UpdateReady?.Invoke();
                }
                catch (Exception ex)
                {
                    Log($"UpdateReady event failed: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                Log($"Download failed: {ex.Message}");
            }
            _isDownloading = false;
        }

        public static bool HasPendingUpdate()
        {
            Log($"HasPendingUpdate called: {_updateDownloaded}");
            return _updateDownloaded;
        }

        public static string GetPendingUpdateVersion()
        {
            if (_updateInfo != null && _updateInfo.TargetFullRelease != null) 
            {
                return _updateInfo.TargetFullRelease.Version.ToString();
            }
            return "";
        }

        public static void ApplyUpdateAndRestart()
        {
            try
            {
                Log($"ApplyUpdateAndRestart called. downloaded: {_updateDownloaded}");
                if (_updateDownloaded && _updateInfo != null && _um != null)
                {
                    Log("Applying update and restarting...");
                    _um.ApplyUpdatesAndRestart(_updateInfo);
                }
                else
                {
                    Log("Fallback: Opening GitHub releases page");
                    System.Diagnostics.Process.Start("https://github.com/Mostafaeldiwany123/conslide/releases/latest");
                }
            }
            catch (Exception ex)
            {
                Log($"Apply failed: {ex.Message}");
            }
        }
    }
}
