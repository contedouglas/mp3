document.addEventListener("DOMContentLoaded", () => {
  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const continueBtn = document.getElementById("continueBtn");

  let eventos = [];
  const executados = new Set();

  function setPlayUI() {
    player.innerText = "⏸️";
    player.classList.add("animate-pulse");
  }

  function setPauseUI() {
    player.innerText = "▶️";
    player.classList.remove("animate-pulse");
  }

  function tocarOuPausarAudio() {
    if (qoreAudio.paused) {
      qoreAudio.play();
      setPlayUI();
    } else {
      qoreAudio.pause();
      setPauseUI();
    }
  }

  function retomarQoreAudio() {
    instrucao.style.display = "none";
    qoreAudio.play();
    setPlayUI();
  }

  function executarAcoes(acoes) {
    acoes.forEach(acao => {
      if (acao === "turnOffAllLabels") {
        window.turnOffAllLabels?.();
      } else if (acao === "activateBarGraph") {
        window.activateBarGraph?.();
      } else if (acao.startsWith("activate:")) {
        const id = acao.split(":")[1];
        window.activateLabel?.(id);
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
        }
      }
    });
  }

  function carregarConfiguracao() {
    const configTag = document.getElementById("qore-config");
    if (!configTag) return;
    try {
      const json = JSON.parse(configTag.textContent);
      eventos = json.eventos || [];
    } catch (e) {
      console.error("Erro ao ler configuração JSON:", e);
    }
  }

  // Setup
  player.addEventListener("click", tocarOuPausarAudio);
  rewindBtn.addEventListener("click", () => qoreAudio.currentTime -= 10);
  forwardBtn.addEventListener("click", () => qoreAudio.currentTime += 10);
  continueBtn.addEventListener("click", retomarQoreAudio);
  qoreAudio.addEventListener("timeupdate", monitorarTempo);

  carregarConfiguracao();

  // Fallbacks para ações
  window.turnOffAllLabels = () => console.log("🔕 Todas as labels desligadas");
  window.activateLabel = id => console.log("✅ Ativada:", id);
  window.activateBarGraph = () => console.log("📊 Gráfico ativado");
});
