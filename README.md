# Conslide — PowerPoint Add-in

> Professional layout automation for PowerPoint. Align, size, distribute, and create shapes with lightning speed.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Microsoft PowerPoint** (desktop or web)
- **Windows** (for sideloading)

### 1. Install Dependencies

```bash
cd "auxi alternative"
npm install
```

### 2. Start the Dev Server

```bash
npm start
```

This launches a **webpack-dev-server** on `https://localhost:3000` with HTTPS enabled.

> ⚠️ **First time?** Your browser will show an SSL warning because of the self-signed certificate. Click "Advanced" → "Proceed to localhost" to trust it. You MUST do this before loading the add-in in PowerPoint.

### 3. Sideload into PowerPoint (Windows)

1. Open **PowerPoint**.
2. Go to **Insert** → **My Add-ins** → **Upload My Add-in** (or **Manage My Add-ins**).
3. Browse to the `manifest.xml` file in this project folder.
4. Click **Upload**.
5. You'll see a new **"Conslide"** tab in the ribbon!

### 4. Using the Add-in

| Action | How |
|---|---|
| **Open Task Pane** | Click "Open Panel" in the Conslide ribbon tab |
| **Command Palette** | Press `Alt + Space` (or click the search bar in the task pane) |
| **Execute a command** | Type to search, use ↑↓ arrows, press Enter |
| **Filter by category** | Press Tab to cycle categories, or click pills |

---

## 📋 Command Reference

### Layout
| Command | Shortcut | Description |
|---|---|---|
| Swap Shapes | `/` | Swap positions of two selected shapes |
| Align Left | `AL` | Align to master shape's left edge |
| Align Right | `AR` | Align to master shape's right edge |
| Align Top | `AT` | Align to master shape's top edge |
| Align Bottom | `AB` | Align to master shape's bottom edge |
| Align Center | `AC` | Align to master horizontal center |
| Align Middle | `AM` | Align to master vertical middle |
| Group | `Ctrl+G` | Group selected shapes |

### Sizing
| Command | Shortcut | Description |
|---|---|---|
| Same Size | `SS` | Match width & height to master |
| Same Width | `SW` | Match width to master |
| Same Height | `SH` | Match height to master |

### Distribution
| Command | Shortcut | Description |
|---|---|---|
| Distribute Horizontally | `DH` | Even horizontal spacing |
| Distribute Vertically | `DV` | Even vertical spacing |

### Creation
| Command | Shortcut | Description |
|---|---|---|
| Rectangle | `R` | Insert rectangle |
| Circle | `O` | Insert circle |
| Text Box | `T` | Insert text box |
| Triangle | `G` | Insert triangle |

### Smart Editing
| Command | Shortcut | Math |
|---|---|---|
| Add Column | `AC` | `newWidth = bbox.width / (N+1)` — shrink existing, insert right |
| Add Row | `AR` | `newHeight = bbox.height / (N+1)` — shrink existing, insert bottom |

---

## 🏗 Architecture

```
auxi alternative/
├── manifest.xml            ← Office Add-in manifest (Shared Runtime)
├── package.json            ← Dependencies & scripts
├── webpack.config.js       ← Dual-entry build config
├── tailwind.config.js      ← Design tokens
├── public/
│   ├── taskpane.html       ← Task pane shell
│   ├── commands.html       ← Commands entry (Shared Runtime)
│   └── assets/             ← Icons
└── src/
    ├── index.jsx           ← Entry point (React mount)
    ├── App.jsx             ← Root component
    ├── styles/
    │   └── index.css       ← Tailwind + Glassmorphism styles
    ├── components/
    │   ├── CommandPalette/
    │   │   └── CommandPalette.jsx  ← Floating search bar
    │   └── TaskPane/
    │       └── TaskPanePanel.jsx   ← Sidebar panel
    ├── registry/
    │   └── CommandRegistry.js      ← Central command map
    ├── services/
    │   └── PowerPointService.js    ← Office.js coordinate-math engine
    └── commands/
        └── commands.js             ← Ribbon button handlers
```

### Key Design Patterns

- **Command Registry**: All commands are defined in a single JSON-like registry (`CommandRegistry.js`). Adding a new command = adding one object. Scales to 100+ features.
- **Service Layer**: `PowerPointService.js` contains all Office.js coordinate math, completely isolated from UI.
- **Shared Runtime**: The manifest configures `Runtime lifetime="long"` so the commands page and task pane share state.
- **Batch Sync**: All Office.js operations use minimal `context.sync()` calls for sub-100ms execution.

---

## 🔧 Development

```bash
npm start     # Dev server with hot reload
npm run build # Production bundle to dist/
npm run lint  # ESLint check
```

### Adding a New Command

1. Add the Office.js function to `src/services/PowerPointService.js`
2. Add an entry to the `COMMAND_REGISTRY` array in `src/registry/CommandRegistry.js`
3. Done! It automatically appears in the Command Palette and Task Pane.

---

## 🛠 Project Components & Building

This repository contains two main components: the **Desktop Add-in** (native Windows app) and the **Web Application** (user dashboard and pricing).

### A. Desktop Add-in (Native App)

Use this when you want to build the `Conslide.exe` standalone application.

```powershell
# 1. Build the Desktop Frontend
npm run build

# 2. Build the C# Native Application
cd Conslide
dotnet build -c Release

# 3. Create the redistributable zip
Compress-Archive -Path ".\bin\Release\net48\*" -DestinationPath ".\Conslide.zip" -Force
```

### B. Web Application (User Dashboard)

Use this when you want to build and deploy the `conslide-webapp`.

```powershell
# 1. Navigate to the webapp directory
cd "website"

# 2. Install dependencies (first time only)
npm install

# 3. Build the web application
npm run build
```

The output will be in the `website/dist` folder, ready for deployment to any static hosting (Vercel, Netlify, etc.).

---

### 💡 Development Tips

- **Reset App Data:** Run `taskkill /F /IM Conslide.exe; Remove-Item -Path "$env:APPDATA\Conslide" -Recurse -Force` to wipe local cache and login state.
- **Desktop Shortcut:** The native app lives in `Conslide/bin/Release/net48/Conslide.exe`.

---

## 📄 License

**All Rights Reserved**

This software is proprietary and confidential. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without express written permission from the author.

See [LICENSE](LICENSE) for full terms.
