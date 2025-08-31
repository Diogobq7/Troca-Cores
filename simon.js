const buttons = document.querySelectorAll('.color-btn');
const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const score = document.getElementById('score');

let sequence = [];
let userSequence = [];
let level = 0;
let isPlaying = false;

// Criando contexto de aúdio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Frequências diferentes para cada cor
const colorFrequencies = {
  "#FF0000": 261.6, // Dó
  "#00FF00": 329.6, // Mi
  "#0000FF": 392.0, // Sol
  "#FFFF00": 523.3  // Dó agudo
}

// Função para gerar e tocar o som da cor
function playSound(color) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = colorFrequencies[color];

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = "sine";
  osc.frequency.value = colorFrequencies[color] || 440;

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

// Função para gerar uma cor aleatória da lista de botões
function getRandomColor() {
  const idx = Math.floor(Math.random() * buttons.length);
  return buttons[idx].dataset.color;
}

// Mostra a sequência para o usuário
function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    const btn = document.querySelector(`.color-btn[data-color="${color}"]`);

    btn.classList.add('active');
    playSound(color);
    setTimeout(() => btn.classList.remove('active'), 500);
    
    i++;

    if(i >= sequence.length) clearInterval(interval);
  }, 700);
}

// Começa um novo nível
function nextLevel() {
  level++;
  status.textContent = `Nível ${level}`;
  userSequence = [];
  sequence.push(getRandomColor());
  showSequence();
}

// Verifica se o clique do usuário está correto
function handleUserClick(e) {
  if (!isPlaying) return;

  const btn = e.target;

  // Adiciona efeito de clique
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 200);

  const color = btn.dataset.color;
  userSequence.push(color);
  playSound(color);

  const currentStep = userSequence.length - 1;
  if(userSequence[currentStep] !== sequence[currentStep]) {
    alert(`Errou! Você chegou ao nível ${level}\nPontuação: ${score.textContent}\nTente novamente!`);
    sequence = [];
    level = 0;
    score.textContent = 0;
    status.textContent = "Clique em 'Iniciar' para jogar novamente";
    isPlaying = false;
    return;
  }

  if(userSequence.length === sequence.length) {
    score.textContent = level;
    setTimeout(nextLevel, 1000);
  }
}

// Eventos
buttons.forEach(btn => btn.addEventListener('click', handleUserClick));
startBtn.addEventListener('click', () => {
  sequence = [];
  score.textContent = 0;
  isPlaying = true;
  nextLevel();
});
