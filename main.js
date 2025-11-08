const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const kill = require("tree-kill");
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: envFile });

let processes = {};

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.loadFile("renderer/index.html");

  // Open DevTools only in development
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

// ===== Start service =====
ipcMain.handle("start-service", (event, { name, cmd, cwd }) => {
  if (processes[name]) return; // already running

  const [command, ...args] = cmd.split(" ");
  const proc = spawn(command, args, { cwd, shell: true, detached: true });

  processes[name] = proc;
  event.sender.send("service-started", { name });

  proc.stdout.on("data", (data) => {
    event.sender.send("service-log", { name, log: data.toString() });
  });

  proc.stderr.on("data", (data) => {
    event.sender.send("service-log", { name, log: data.toString() });
  });

  proc.on("close", (code) => {
    event.sender.send("service-stopped", { name, code });
    delete processes[name];
  });
});

// ===== Stop service =====
ipcMain.handle("stop-service", (event, name) => {
  const proc = processes[name];
  if (proc) {
    console.log(`Stopping ${name} (PID ${proc.pid})...`);
    kill(proc.pid, "SIGTERM", (err) => {
      if (err) {
        console.error(`Failed to kill ${name}:`, err);
        event.sender.send("service-log", {
          name,
          log: `Error stopping ${name}: ${err.message}\n`,
        });
      } else {
        console.log(`${name} stopped successfully`);
        event.sender.send("service-stopped", { name, code: 0 });
      }
    });
    delete processes[name];
  }
});
