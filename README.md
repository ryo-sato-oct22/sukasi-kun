# Sukasi-kun (Environment Watermark Overlay) Chrome Extension

A Google Chrome extension that displays a customizable watermark (overlay badge) on the screen based on the current domain to help developers visually distinguish between Production, Staging, and Development environments.

## Key Features

1. **Domain Specification & Management**
   - Substring-based domain matching (e.g., specifying `localhost` will match `localhost:3000` or `localhost:8080`).
   - Easily register or delete multiple rules for specific domains.

2. **Real-time Watermark Overlay**
   - Displays a watermark badge at any of the four corners (top-left, top-right, bottom-left, bottom-right) when visiting configured domains.
   - Uses **Shadow DOM** for DOM injection to ensure that host website styles (CSS) do not override or break the watermark's layout.
   - Styled with `pointer-events: none` and `user-select: none`, ensuring it **does not block clicks, scrolling, or text selection** of underlying elements.

3. **High Customizability (Per Domain)**
   - Display text (e.g., `STAGING`, `LOCAL-DEV`)
   - Font size (10px to 60px)
   - Opacity (10% to 100%)
   - Text color (Color picker)
   - Background color (Color picker)
   - Badge position (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
   - **Real-time Live Preview** allows you to see the styled watermark directly in the extension popup before saving.
   - Changes apply **instantly to active tabs without requiring a page reload**.

---

## Directory Structure

```
sukasi-kun/
├── manifest.json       # Extension configuration file (Manifest V3)
├── popup.html          # Configuration Popup UI
├── popup.css           # Popup UI Styles (modern dark mode & glassmorphism)
├── popup.js            # Popup UI state management & storage handling
├── content.js          # Webpage watermark injection script (Shadow DOM)
├── icons/              # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md           # This documentation
```

---

## Installation (Chrome)

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle the **"Developer mode"** switch in the top-right corner to **ON**.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select this project's directory (`sukasi-kun` folder).
5. The extension **"Sukasi-kun (ウォーターマーク表示)"** will be added. You can pin it to the toolbar for quick access.

---

## Testing the Extension

1. Start a simple local web server (e.g., using Python):
   ```bash
   python3 -m http.server 8000
   ```
2. Navigate to `http://localhost:8000` in Chrome.
3. Click the extension popup icon in the toolbar.
4. Input the following settings:
   - **Domain**: `localhost`
   - **Text**: `LOCAL-DEV`
   - **Font Size**: `20px`
   - **Opacity**: `70%`
   - **Color**: `#ffffff`
   - **Background**: `#ff3366`
   - **Position**: `Top-Right`
5. Click **"Save Rule"** (ルールを保存).
6. Verify that the configured watermark badge appears instantly at the top-right corner of `http://localhost:8000`.
7. Try deleting the rule from the popup; the watermark will disappear instantly.

---

## Distribution via GitHub Releases

To distribute this extension on GitHub, it is recommended to publish it as a ZIP package using **GitHub Releases**.

### 1. Build the Release ZIP File
Run the following one-liner in your terminal to generate a clean `sukasi-kun.zip` containing only the extension files, excluding Git files and build plans:
```bash
python3 -c "import zipfile, os; zipf = zipfile.ZipFile('sukasi-kun.zip', 'w', zipfile.ZIP_DEFLATED); [zipf.write(f, f) for f in ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'content.js', 'README.md'] if os.path.exists(f)]; [zipf.write(os.path.join('icons', f), os.path.join('icons', f)) for f in os.listdir('icons') if os.path.exists('icons')]"
```

### 2. Push Your Repository to GitHub
```bash
git branch -M main
git remote add origin https://github.com/your-username/sukasi-kun.git
git push -u origin main
```

### 3. Publish on GitHub Releases
1. Navigate to your repository on GitHub, then click **"Releases"** -> **"Create a new release"** in the right sidebar.
2. Select or create a version tag (e.g., `v1.0.0`) and enter a title.
3. Drag and drop the generated `sukasi-kun.zip` into the binary attachment area.
4. Click **"Publish release"**.

Users can download the `sukasi-kun.zip` from your Release page, extract it, and install it in Chrome via the "Load unpacked" button.
