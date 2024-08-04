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
let timerInterval;
let timerRunning = false;
let timeLeft = 1500;
let sessionCount = 0;

// Função para carregar tarefas do LocalStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

// Função para salvar tarefas no LocalStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        tasks.push(taskItem.textContent.trim());
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para adicionar tarefa ao DOM
function addTaskToDOM(taskText) {
    const taskItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskSpan);
    taskList.appendChild(taskItem);

    saveTasks();
}

// Função para adicionar tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTaskToDOM(taskText);
        taskInput.value = '';
    }
}

// Função para carregar o estado do temporizador do LocalStorage
function loadTimerState() {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedTimerRunning = localStorage.getItem('timerRunning');
    if (savedTimeLeft !== null) {
        timeLeft = parseInt(savedTimeLeft, 10);
        updateTimerDisplay();
    }
    if (savedTimerRunning === 'true') {
        startTimer();
    }
}

// Função para salvar o estado do temporizador no LocalStorage
function saveTimerState() {
    localStorage.setItem('timeLeft', timeLeft);
    localStorage.setItem('timerRunning', timerRunning);
}

// Função para formatar tempo em minutos e segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função para atualizar o display do temporizador
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

// Função para iniciar o temporizador
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            updateProgressBar();
            saveTimerState();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                sessionCount++;
                if (sessionCount % 4 === 0) {
                    timeLeft = 1800; // Pausa longa (30 minutos)
                } else {
                    timeLeft = 300; // Pausa curta (5 minutos)
                }
                alert('Tempo esgotado! Iniciando próxima sessão.');
                updateTimerDisplay();
                saveTimerState();
            }
        }, 1000);
    }
}

// Função para pausar o temporizador
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        saveTimerState();
    }
}

// Função para resetar o temporizador
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timeLeft = 1500;
    updateTimerDisplay();
    updateProgressBar();
    saveTimerState();
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progress = ((1500 - timeLeft) / 1500) * 100;
    progressBar.style.width = `${progress}%`;
}

// Adicionando event listeners aos botões
addTaskBtn.addEventListener('click', addTask);
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Carregando tarefas e estado do temporizador ao carregar a página
window.addEventListener('load', () => {
    loadTasks();
    loadTimerState();
});
