// player.js
document.addEventListener("DOMContentLoaded", () => {
  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");

  let tocando = false;
  let pausas = [];
  const executadas = new Set();

  function setPlayUI() {
    player.innerText = "⏸️";
    player.style.animation = "pulse 1.5s infinite";
  }

  function setPauseUI() {
    player.innerText = "▶️";
    player.style.animation = "none";
  }

  function tocarQoreAudio() {
    if (qoreAudio.paused) {
      qoreAudio.play();
      setPlayUI();
      tocando = true;
    } else {
      qoreAudio.pause();
      setPauseUI();
      tocando = false;
    }
  }

  function retomarQoreAudio() {
    instrucao.style.display = "none";
    qoreAudio.play();
    setPlayUI();
    tocando = true;
  }

  function carregarConfiguracoes() {
    const config = document.getElementById("qore-config");
    if (config) {
      const json = JSON.parse(config.textContent);
      pausas = json.pausas || [];
    }
  }

  function executarAcoes(acoes) {
    acoes.forEach(acao => {
      if (acao === "turnOffAllLabels") return turnOffAllLabels();
      if (acao === "activateBarGraph") return activateBarGraph();
      if (acao.startsWith("activate:")) return activateLabel(acao.split(":")[1]);
    });
  }

  function monitorarTempo() {
    const tempo = Math.floor(qoreAudio.currentTime);
    pausas.forEach(({ tempo: t, acoes }) => {
      if (tempo >= t && !executadas.has(t)) {
        executadas.add(t);
        qoreAudio.pause();
        setPauseUI();
        instrucao.style.display = "block";
        executarAcoes(acoes);
        tocando = false;
      }
    });
  }

  // Estilo de animação pulse
  const css = document.createElement("style");
  css.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(css);

  carregarConfiguracoes();
  qoreAudio.addEventListener("timeupdate", monitorarTempo);

  window.tocarQoreAudio = tocarQoreAudio;
  window.retomarQoreAudio = retomarQoreAudio;

  // Simulações da matriz (pode ser sobrescrito no embed se necessário)
  window.turnOffAllLabels = () => console.log("🔕 Todas as labels desligadas");
  window.activateLabel = id => console.log("✅ Ativada:", id);
  window.activateBarGraph = () => console.log("📊 Gráfico ativado");
});
