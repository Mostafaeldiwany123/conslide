using System;
using System.Drawing;
using System.Net;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using System.IO;

namespace Conslide
{
    public class WelcomeForm : Form
    {
        private Microsoft.Web.WebView2.WinForms.WebView2 webView;
        private HttpListener listener;
        private string tokenFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Conslide", "token.txt");
        private int port = 24892;

        private const string FONT_LINK = "<link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>";
        private const string BASE_FONT = "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;";

        public WelcomeForm()
        {
            SetupUI();
        }

        private async void SetupUI()
        {
            this.Text = "Welcome to Conslide";
            this.Size = new Size(560, 600);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.White;

            webView = new Microsoft.Web.WebView2.WinForms.WebView2();
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);

            var env = await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions());
            await webView.EnsureCoreWebView2Async(env);

            string localDistPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist");
            if (Directory.Exists(localDistPath))
            {
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping("app.local", localDistPath, CoreWebView2HostResourceAccessKind.Allow);
            }

            ShowInitialPage();
            StartListener();
        }

        private void StartListener()
        {
            listener = new HttpListener();
            listener.Prefixes.Add($"http://127.0.0.1:{port}/");
            try
            {
                listener.Start();
                listener.BeginGetContext(new AsyncCallback(ListenerCallback), listener);
            }
            catch { }
        }

        private void ListenerCallback(IAsyncResult result)
        {
            if (listener == null || !listener.IsListening) return;
            try
            {
                var context = listener.EndGetContext(result);
                var request = context.Request;
                string payload = null;

                if (request.HttpMethod == "POST")
                {
                    using (StreamReader reader = new StreamReader(request.InputStream, request.ContentEncoding))
                    {
                        payload = reader.ReadToEnd();
                    }
                }
                else
                {
                    string token = request.QueryString["token"];
                    if (!string.IsNullOrEmpty(token)) payload = token;
                }

                if (!string.IsNullOrEmpty(payload))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(tokenFile));
                    
                    if (request.HttpMethod == "POST") {
                        string sessionFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Conslide", "session.json");
                        File.WriteAllText(sessionFile, payload);
                        File.WriteAllText(tokenFile, "session_active");
                    } else {
                        File.WriteAllText(tokenFile, payload); // Fallback for old clients
                    }

                    string responseString = "<html><head>" + FONT_LINK + "<style>body{" + BASE_FONT + " text-align:center; margin-top:50px; color:#111827;}</style></head><body><h2>Authentication Successful!</h2><p>You can close this tab and return to the Conslide app.</p><script>window.close();</script></body></html>";
                    
                    // Add CORS headers so localhost fetch won't crash
                    context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
                    context.Response.AppendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                    
                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
                    context.Response.ContentLength64 = buffer.Length;
                    context.Response.OutputStream.Write(buffer, 0, buffer.Length);
                    context.Response.OutputStream.Close();

                    this.Invoke(new Action(() => {
                        ShowSuccessPage();
                    }));
                }
                else if (request.HttpMethod == "OPTIONS")
                {
                    context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
                    context.Response.AppendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                    context.Response.AppendHeader("Access-Control-Allow-Headers", "Content-Type");
                    context.Response.Close();
                }

                listener.BeginGetContext(new AsyncCallback(ListenerCallback), listener);
            }
            catch { }
        }

        private void ShowInitialPage()
        {
            string iconUrl = "http://app.local/conslide_favicon.png";
#if DEBUG
            iconUrl = "http://localhost:8080/conslide_favicon.png";
#endif

            string html = $@"
            <html>
            <head>
                {FONT_LINK}
                <style>
                    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                    body {{ {BASE_FONT} display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #ffffff; color: #111827; overflow: hidden; -webkit-font-smoothing: antialiased; }}
                    .container {{ text-align: center; max-width: 420px; padding: 48px 40px; width: 100%; }}
                    .logo {{ width: 100px; height: 100px; border-radius: 22px; margin-bottom: 28px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); }}
                    h1 {{ font-size: 28px; font-weight: 600; margin: 0 0 10px; letter-spacing: -0.02em; color: #111827; }}
                    p {{ font-size: 15px; color: #6B7280; margin: 0 0 36px; line-height: 1.6; }}
                    button {{ {BASE_FONT} background-color: #7C3AED; color: white; border: none; padding: 0 28px; height: 48px; font-size: 16px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; width: 100%; box-shadow: 0 1px 3px rgba(124, 58, 237, 0.3); letter-spacing: -0.01em; }}
                    button:hover {{ background-color: #6D28D9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35); }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <img src='{iconUrl}' class='logo' onerror=""this.style.display='none'"" />
                    <h1>Connect your account</h1>
                    <p>Sign in or create an account on our website to get started. Your browser will open automatically.</p>
                    <button onclick='window.chrome.webview.postMessage(""CONNECT"")'>Connect</button>
                </div>
            </body>
            </html>
            ";

            webView.NavigateToString(html);

            webView.WebMessageReceived += (s, ev) =>
            {
                if (ev.TryGetWebMessageAsString() == "CONNECT")
                {
                    System.Diagnostics.Process.Start($"https://conslide.netlify.app/login?port={port}");
                    string waitingHtml = $@"
                    <html>
                    <head>
                        {FONT_LINK}
                        <style>
                            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                            body {{ {BASE_FONT} display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #ffffff; color: #111827; overflow: hidden; -webkit-font-smoothing: antialiased; }}
                            .container {{ text-align: center; max-width: 420px; padding: 48px 40px; width: 100%; }}
                            .spinner {{ width: 40px; height: 40px; border: 3px solid #E5E7EB; border-top: 3px solid #7C3AED; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }}
                            @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
                            h1 {{ font-size: 22px; font-weight: 600; margin: 0 0 8px; color: #111827; }}
                            p {{ font-size: 14px; color: #9CA3AF; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='spinner'></div>
                            <h1>Waiting for authentication...</h1>
                            <p>Complete sign in on your browser to continue.</p>
                        </div>
                    </body>
                    </html>";
                    webView.NavigateToString(waitingHtml);
                }
                else if (ev.TryGetWebMessageAsString() == "START")
                {
                    // Only open PowerPoint if it's not already running
                    bool powerPointRunning = System.Diagnostics.Process.GetProcessesByName("powerpnt").Length > 0;
                    if (!powerPointRunning)
                    {
                        try { System.Diagnostics.Process.Start("powerpnt.exe"); } catch { }
                    }
                    this.DialogResult = DialogResult.OK;
                    this.Close();
                }
            };
        }

        private void ShowSuccessPage()
        {
            this.Size = new Size(560, 600);
            this.CenterToScreen();

            string html = @"
            <html>
            <head>
                " + FONT_LINK + @"
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { " + BASE_FONT + @" display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #ffffff; color: #111827; overflow: hidden; -webkit-font-smoothing: antialiased; }
                    .wrapper { max-width: 420px; width: 100%; text-align: center; padding: 40px; }
                    
                    .logo-check { width: 64px; height: 64px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
                    h1 { font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.02em; margin-bottom: 8px; }
                    .subtitle { font-size: 15px; color: #6B7280; margin-bottom: 32px; }
                    
                    .instructions { background-color: #F9FAFB; padding: 20px; border-radius: 12px; font-size: 14px; border: 1px solid #E5E7EB; text-align: left; margin-bottom: 32px; }
                    .instructions strong { display: block; margin-bottom: 12px; color: #111827; font-weight: 600; }
                    .instructions .steps { color: #4B5563; line-height: 1.8; }
                    .kbd { display: inline-block; padding: 1px 6px; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 12px; font-weight: 600; color: #374151; box-shadow: 0 1px 1px rgba(0,0,0,0.04); }

                    .start-btn { background-color: #7C3AED; color: white; border: none; width: 100%; height: 48px; font-size: 16px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 1px 3px rgba(124,58,237,0.25); " + BASE_FONT + @" }
                    .start-btn:hover { background-color: #6D28D9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
                </style>
            </head>
            <body>
                <div class='wrapper'>
                    <div class='logo-check'>
                        <svg width=""32"" height=""32"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""3"" stroke-linecap=""round"" stroke-linejoin=""round"">
                            <polyline points=""20 6 9 17 4 12""/>
                        </svg>
                    </div>
                    <h1>You're connected!</h1>
                    <p class='subtitle'>Your account is successfully linked.</p>

                    <div class='instructions'>
                        <strong>Quick Start Guide</strong>
                        <div class='steps'>
                            1. Open any PowerPoint presentation<br/>
                            2. Press <span class='kbd'>Alt</span> + <span class='kbd'>Space</span> to open the palette<br/>
                            3. Use AI agents or type commands instantly
                        </div>
                    </div>

                    <button class='start-btn' onclick='window.chrome.webview.postMessage(""START"")'>Start Using Conslide</button>
                </div>
            </body>
            </html>
            ";

            webView.NavigateToString(html);
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            try { listener?.Stop(); } catch { }
            // Properly dispose WebView2 to prevent "Class not registered" error
            // when Form1 creates its own WebView2 instance
            try
            {
                if (webView != null)
                {
                    this.Controls.Remove(webView);
                    webView.Dispose();
                    webView = null;
                }
            }
            catch { }
            base.OnFormClosing(e);
        }

        public static bool IsAuthenticated()
        {
            string tokenPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Conslide", "token.txt");
            return File.Exists(tokenPath);
        }
    }
}
