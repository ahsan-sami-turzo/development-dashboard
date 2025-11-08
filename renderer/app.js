const projects = window.electronAPI.getProjects();
const container = document.getElementById("services");

if (!projects.length) {
  container.innerHTML = "<p>No projects found in config/projects.json</p>";
} else {
  projects.forEach((proj) => {
    const div = document.createElement("div");
    div.classList.add("service");
    div.innerHTML = `
      <h3>
        <span class="status-dot" id="dot-${proj.name}">🔴</span>
        ${proj.name}
      </h3>
      <p><b>Path:</b> ${proj.cwd}</p>
      <p><b>Command:</b> ${proj.cmd}</p>
      <div class="buttons">
        <button class="start">Start</button>
        <button class="stop">Stop</button>
      </div>
      <pre class="log" id="log-${proj.name}"></pre>
    `;
    container.appendChild(div);

    const startBtn = div.querySelector(".start");
    const stopBtn = div.querySelector(".stop");
    const logArea = div.querySelector(".log");
    const dot = div.querySelector(".status-dot");

    const setStatus = (running) => {
      dot.textContent = running ? "🟢" : "🔴";
    };

    startBtn.onclick = () => {
      window.electronAPI.startService(proj);
      logArea.textContent += `[${proj.name}] starting...\n`;
    };

    stopBtn.onclick = () => {
      window.electronAPI.stopService(proj.name);
      logArea.textContent += `[${proj.name}] stopping...\n`;
    };

    window.electronAPI.onLog(({ name, log }) => {
      if (name === proj.name) {
        logArea.textContent += log;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    window.electronAPI.onStopped(({ name }) => {
      if (name === proj.name) {
        logArea.textContent += `\n[${name}] stopped.\n`;
        setStatus(false);
      }
    });

    window.electronAPI.onStarted(({ name }) => {
      if (name === proj.name) {
        logArea.textContent += `[${name}] started.\n`;
        setStatus(true);
      }
    });
  });
}
