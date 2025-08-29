const buttons = document.querySelectorAll('.color-btn');
const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');

let sequence = [];
let userSequence = [];
let level = 0;

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
  const btn = e.target;

  // Adiciona efeito de clique
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 200);

  const color = btn.dataset.color;
  userSequence.push(color);

  const currentStep = userSequence.length - 1;
  if(userSequence[currentStep] !== sequence[currentStep]) {
    alert(`Errou! Você chegou ao nível ${level}`);
    sequence = [];
    level = 0;
    status.textContent = "Clique em 'Iniciar' para jogar novamente";
    return;
  }

  if(userSequence.length === sequence.length) {
    setTimeout(nextLevel, 1000);
  }
}

// Eventos
buttons.forEach(btn => btn.addEventListener('click', handleUserClick));
startBtn.addEventListener('click', () => {
  sequence = [];
  nextLevel();
});
