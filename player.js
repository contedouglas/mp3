document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM carregado");

  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const continueBtn = document.getElementById("continueBtn");

  if (!qoreAudio || !player || !instrucao || !rewindBtn || !forwardBtn || !continueBtn) {
    console.error("❌ Um ou mais elementos não foram encontrados no DOM.");
    return;
  }

  let eventos = [];
  const executados = new Set();

  function setPlayUI() {
    console.log("▶️ setPlayUI chamado");
    player.innerText = "⏸️";
    player.classList.add("animate-pulse");
  }

  function setPauseUI() {
    console.log("⏸️ setPauseUI chamado");
    player.innerText = "▶️";
    player.classList.remove("animate-pulse");
  }

  function tocarOuPausarAudio() {
    if (qoreAudio.paused) {
      console.log("🔊 Tocando áudio");
      qoreAudio.play();
      setPlayUI();
    } else {
      console.log("⏸️ Pausando áudio");
      qoreAudio.pause();
      setPauseUI();
    }
  }

  function retomarQoreAudio() {
    console.log("🟢 Retomando após pausa automática");
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
        console.log(`🎯 Evento acionado no tempo ${evento.tempo}s`);
        executados.add(evento.tempo);
        executarAcoes(evento.acoes);
        if (evento.pausar) {
          console.log("⛔ Evento com pausa automática");
          qoreAudio.pause();
          setPauseUI();
          instrucao.style.display = "block";
        }
      }
    });
  }

  function carregarConfiguracao() {
    const configTag = document.getElementById("qore-config");
    if (!configTag) {
      console.error("❌ Configuração JSON (qore-config) não encontrada");
      return;
    }

    try {
      const json = JSON.parse(configTag.textContent);
      eventos = json.eventos || [];
      console.log("✅ Configuração carregada:", eventos);
    } catch (e) {
      console.error("❌ Erro ao ler configuração JSON:", e);
    }
  }

  // Bind listeners
  player.addEventListener("click", () => {
    console.log("🖱️ Clique no botão player");
    tocarOuPausarAudio();
  });

  rewindBtn.addEventListener("click", () => {
    console.log("⏪ Retrocedendo 10s");
    qoreAudio.currentTime -= 10;
  });

  forwardBtn.addEventListener("click", () => {
    console.log("⏩ Avançando 10s");
    qoreAudio.currentTime += 10;
  });

  continueBtn.addEventListener("click", () => {
    console.log("▶️ Botão 'Continuar' clicado");
    retomarQoreAudio();
  });

  qoreAudio.addEventListener("timeupdate", monitorarTempo);
  qoreAudio.addEventListener("play", () => console.log("🎵 Evento play"));
  qoreAudio.addEventListener("pause", () => console.log("🛑 Evento pause"));

  carregarConfiguracao();

  // Fallbacks para uso
  window.turnOffAllLabels = () => console.log("🔕 Todas as labels desligadas");
  window.activateLabel = id => console.log("✅ Ativada:", id);
  window.activateBarGraph = () => console.log("📊 Gráfico ativado");

  // Exposição externa
  window.tocarQoreAudio = tocarOuPausarAudio;
  window.retomarQoreAudio = retomarQoreAudio;
});
