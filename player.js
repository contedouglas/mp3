document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM carregado");

  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const continueBtn = document.getElementById("continueBtn");

  if (!qoreAudio || !player) {
    console.error("❌ Elementos obrigatórios não encontrados.");
    return;
  }

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
      console.log("▶️ Play acionado");
      qoreAudio.play();
      setPlayUI();
    } else {
      console.log("⏸️ Pause acionado");
      qoreAudio.pause();
      setPauseUI();
    }
  }

  function retomarQoreAudio() {
    console.log("🔁 Retomando áudio após pausa automática");
    instrucao.style.display = "none";
    qoreAudio.play();
    setPlayUI();
  }

  function executarAcoes(acoes) {
    console.log("⚙️ Executando ações:", acoes);
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
        console.log(`🎯 Evento no segundo ${evento.tempo}`);
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

  function carregarConfiguracoes() {
    const configTag = document.getElementById("qore-config");
    if (!configTag) {
      console.error("❌ Config JSON não encontrado");
      return;
    }
    try {
      const json = JSON.parse(configTag.textContent);
      eventos = json.eventos || [];
      console.log("✅ Eventos carregados:", eventos);
    } catch (e) {
      console.error("❌ Erro ao ler JSON:", e);
    }
  }

  player.addEventListener("click", () => {
    console.log("🖱️ Clique detectado");
    tocarOuPausarAudio();
  });

  rewindBtn?.addEventListener("click", () => {
    console.log("⏪ Retrocedendo 10s");
    qoreAudio.currentTime -= 10;
  });

  forwardBtn?.addEventListener("click", () => {
    console.log("⏩ Avançando 10s");
    qoreAudio.currentTime += 10;
  });

  continueBtn?.addEventListener("click", retomarQoreAudio);
  qoreAudio.addEventListener("timeupdate", monitorarTempo);

  // Defaults para suas funções, sobrescreva no embed se quiser
  window.turnOffAllLabels = () => console.log("🔕 Todas as labels desligadas");
  window.activateLabel = id => console.log("✅ Ativada:", id);
  window.activateBarGraph = () => console.log("📊 Gráfico ativado");

  // Inicializa
  carregarConfiguracoes();
});
