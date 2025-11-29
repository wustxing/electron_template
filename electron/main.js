import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { release } from 'os';
import { join } from 'path';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
/** process.js 必须位于非依赖项的顶部 */
import { isPackaged } from './helpers/process.js'

import ipc from './ipc/index.js'

console.log('Electron Main Process!');
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = process.env.NODE_ENV == 'development';
process.env.DIST = join(__dirname, '../dist');

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win = null;
// Here, you can also use other preload
const preload = join(__dirname, 'preload.mjs');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1400,
    height: 900,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
      webSecurity: false,      // 禁用 web 安全，允许加载 file:// 协议
      allowRunningInsecureContent: true // 允许加载不安全的内容
    },
  });

  if (isDev) {
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  
  ipc(win)

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  createWindow();

  if (isDev) {
    const { installExtension, VUEJS_DEVTOOLS } = await import('@tomjs/electron-devtools-installer');

    installExtension(VUEJS_DEVTOOLS)
      .then(ext => {
        console.log('Added Extension: ', ext.name);
      })
      .catch(() => {
        console.log('Failed to install extensions');
      });
  }
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  console.log("open-win====")
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});