const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config", "projects.json");

function loadProjects() {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(data);
    const basePath = process.env.BASE_PROJECTS_PATH;
    return (json.projects || []).map(proj => ({
      ...proj,
      cwd: proj.cwd.replace("${BASE_PROJECTS_PATH}", basePath)
    }));
  } catch (err) {
    console.error("Failed to load projects.json:", err);
    return [];
  }
}

contextBridge.exposeInMainWorld("electronAPI", {
  startService: (service) => ipcRenderer.invoke("start-service", service),
  stopService: (name) => ipcRenderer.invoke("stop-service", name),
  onLog: (callback) =>
    ipcRenderer.on("service-log", (event, data) => callback(data)),
  onStopped: (callback) =>
    ipcRenderer.on("service-stopped", (event, data) => callback(data)),
  onStarted: (callback) =>
    ipcRenderer.on("service-started", (event, data) => callback(data)),
  getProjects: () => loadProjects(),
});
