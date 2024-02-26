// Selecionando elementos do DOM
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const timerDisplay = document.getElementById('timer');
const timerCircle = document.getElementById('timer-circle');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Variáveis do temporizador
let timerInterval; // Variável para armazenar o intervalo do temporizador
let timerRunning = false; // Indica se o temporizador está em execução
let timeLeft = 1500; // Tempo restante do temporizador em segundos (25 minutos)
let sessionCount = 0; // Contador de sessões

// Associar a função de adicionar tarefa ao pressionar a tecla Enter no campo de entrada
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Adicionar evento de clique para adicionar tarefa à lista
addTaskBtn.addEventListener('click', addTask);

// Função para adicionar tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskSpan);
        taskList.appendChild(taskItem);
        taskInput.value = ''; // Limpar o campo de entrada após adicionar a tarefa
    }
}

// Adicionar evento de clique para remover tarefa da lista ao marcar o checkbox
taskList.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        const taskItem = event.target.parentElement;
        taskItem.remove(); // Remove o elemento pai (a <li>) quando o checkbox é marcado
    }
});

// Adicionar evento de clique para iniciar o temporizador
startBtn.addEventListener('click', startTimer);

// Adicionar evento de clique para pausar o temporizador
pauseBtn.addEventListener('click', pauseTimer);

// Adicionar evento de clique para resetar o temporizador
resetBtn.addEventListener('click', resetTimer);

// Função para iniciar o temporizador
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        startBtn.disabled = true; // Desativar o botão de iniciar durante a contagem regressiva
        timerInterval = setInterval(updateTimer, 1000); // Iniciar o intervalo do temporizador
    }
}

// Função para pausar o temporizador
function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    startBtn.disabled = false; // Habilitar o botão de iniciar quando o temporizador é pausado
}

// Função para resetar o temporizador
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    sessionCount = 0; // Reiniciar o contador de sessões
    timeLeft = 1500; // Reiniciar o tempo restante do temporizador (25 minutos)
    startBtn.disabled = false; // Habilitar o botão de iniciar ao resetar o temporizador
    updateTimerDisplay(); // Atualizar a exibição do temporizador
}

// Função para atualizar o temporizador
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        clearInterval(timerInterval);
        timerRunning = false;
        sessionCount++; // Incrementar o contador de sessões

        // Tocar o som e mostrar mensagem dependendo da fase do ciclo
        if (sessionCount === 1 || sessionCount === 3 || sessionCount === 5 || sessionCount === 7) {
            playSoundAndShowMessage("sound/short_break_sound.mp3", "Pequena Pausa");
        } else if (sessionCount === 2 || sessionCount === 4 || sessionCount === 6) {
            playSoundAndShowMessage("sound/work_sound.mp3", "Concentre-se na sua tarefa");
        } else if (sessionCount === 8) {
            playSoundAndShowMessage("sound/long_break_sound.mp3", "Longa Pausa");
        }

        // Reiniciar o temporizador após completar uma sessão
        if (sessionCount < 6) {
            timeLeft = (sessionCount % 2 === 0) ? 1500 : 300; // Definir o tempo restante com base na sessão atual
            startTimer();
        } else {
            // Reiniciar o ciclo após completar todas as sessões
            sessionCount = 0;
            startTimer();
        }
    }
}

// Função para executar som e mostrar mensagem
function playSoundAndShowMessage(soundFile, message) {
    const audio = new Audio(soundFile);
    audio.play(); // Tocar o som
    alert(message); // Mostrar mensagem
}

// Função para atualizar a exibição do temporizador
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Calcular o ângulo do segundo atual (de 0 a 360 graus)
    const angle = (1 - (seconds / 60)) * 360;

    // Atualizar o raio da sombra secundária (brilho) para acompanhar o tempo
    timerCircle.style.boxShadow = `
        /* Sombra com brilho */
        ${calculateShadow(angle)}px 0 10px 2px #fff,
        /* Sombra sem brilho */
        0 0 0 0 transparent;
    `;
}

// Função para calcular o raio da sombra com base no ângulo
function calculateShadow(angle) {
    // Converter o ângulo para radianos
    const radians = angle * (Math.PI / 180);
    // Calcular o raio da sombra com base no ângulo (menor raio para ângulos maiores)
    return Math.max(10, 20 - 10 * Math.sin(radians));
}


// Chamar a função para atualizar a cor da borda do círculo inicialmente
updateTimerCircleColor();


// Função para executar som e mostrar mensagem
function playSoundAndDisplayMessage(message) {
    // Reproduzir o som
    playSound();

    // Mostrar mensagem
    alert(message);
}

