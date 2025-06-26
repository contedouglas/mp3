document.addEventListener("DOMContentLoaded", () => {
  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const continueBtn = document.getElementById("continueBtn");

  let eventos = [];
  const executados = new Set();
  let tocando = false;

  // Utilitários visuais
  function setPlayUI() {
    player.innerText = "⏸️";
    player.classList.add("animate-pulse");
  }

  function setPauseUI() {
    player.innerText = "▶️";
    player.classList.remove("animate-pulse");
  }

  // Controle do player
  function togglePlayPause() {
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

  function executarAcoes(acoes) {
    acoes.forEach(acao => {
      if (acao === "turnOffAllLabels") {
        if (typeof turnOffAllLabels === "function") turnOffAllLabels();
      } else if (acao === "activateBarGraph") {
        if (typeof activateBarGraph === "function") activateBarGraph();
      } else if (acao.startsWith("activate:")) {
        const id = acao.split(":")[1];
        if (typeof activateLabel === "function") activateLabel(id);
      }
    });
  }

  function monitorarTempo() {
    const tempoAtual = Math.floor(qoreAudio.currentTime);
    eventos.forEach(evento => {
      if (tempoAtual >= evento.tempo && !executados.has(evento.tempo)) {
        executados.add(evento.tempo);
        executarAcoes(evento.acoes);

        if (evento.pausar) {
          qoreAudio.pause();
          setPauseUI();
          instrucao.style.display = "block";
          tocando = false;
        }
      }
    });
  }

  function carregarConfiguracao() {
    const config = document.getElementById("qore-config");
    if (config) {
      const json = JSON.parse(config.textContent);
      eventos = json.eventos || [];
    }
  }

  // Controles básicos
  player.addEventListener("click", togglePlayPause);
  rewindBtn.addEventListener("click", () => qoreAudio.currentTime -= 10);
  forwardBtn.addEventListener("click", () => qoreAudio.currentTime += 10);
  continueBtn.addEventListener("click", retomarQoreAudio);
  qoreAudio.addEventListener("timeupdate", monitorarTempo);

  // Inicialização
  carregarConfiguracao();

  // Fallbacks (sobrescreva no embed)
  window.turnOffAllLabels = () => console.log("🔕 Todas as labels desligadas");
  window.activateLabel = id => console.log("✅ Ativada:", id);
  window.activateBarGraph = () => console.log("📊 Gráfico ativado");

  // Expor para uso externo
  window.retomarQoreAudio = retomarQoreAudio;
  window.tocarQoreAudio = togglePlayPause;
});
