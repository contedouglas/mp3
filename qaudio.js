document.addEventListener("DOMContentLoaded", function () {
  const qoreAudio = document.getElementById("audioQore");
  const instrucao = document.getElementById("pausaInstrucao");
  const player = document.getElementById("circlePlayer");

  let tocando = false;
  let audioCtx, analyser, source, dataArray, animationFrame;

  // 🧠 Carrega eventos do JSON embed
  const eventos = JSON.parse(document.getElementById("qore-eventos").textContent);
  let eventosExecutados = new Set();

  function tocarQoreAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source = audioCtx.createMediaElementSource(qoreAudio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    if (tocando) {
      qoreAudio.pause();
    } else {
      audioCtx.resume();
      qoreAudio.play();
    }
  }

  qoreAudio.onplay = () => {
    tocando = true;
    player.innerText = "⏸️";
    startPulse();
    qoreAudio.addEventListener("timeupdate", monitorarEventos);
  };

  qoreAudio.onpause = () => {
    tocando = false;
    player.innerText = "▶️";
    stopPulse();
  };

  qoreAudio.onended = () => {
    tocando = false;
    player.innerText = "▶️";
    stopPulse();
  };

  function monitorarEventos() {
    const tempo = Math.floor(qoreAudio.currentTime);
    eventos.forEach((evento) => {
      if (tempo >= evento.time && !eventosExecutados.has(evento.time)) {
        eventosExecutados.add(evento.time);
        evento.commands.forEach(cmd => {
          try {
            eval(cmd);
          } catch (e) {
            console.warn("Erro ao executar comando:", cmd, e);
          }
        });
        if (evento.pause) {
          qoreAudio.pause();
          instrucao.style.display = "block";
        }
      }
    });
  }

  function retomarQoreAudio() {
    instrucao.style.display = "none";
    qoreAudio.play();
  }

  function startPulse() {
    function animate() {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const scale = 1 + avg / 300;
      player.style.transform = `scale(${scale})`;

      animationFrame = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopPulse() {
    cancelAnimationFrame(animationFrame);
    player.style.transform = "scale(1)";
  }

  // Mock da matriz (substitua pelas reais no site)
  function turnOffAllLabels() { console.log("🔕 Todas as labels desligadas"); }
  function activateLabel(id) { console.log("✅ Ativada:", id); }
  function activateBarGraph() { console.log("📊 Gráfico ativado"); }

  // Acessível globalmente
  window.tocarQoreAudio = tocarQoreAudio;
  window.retomarQoreAudio = retomarQoreAudio;
});
