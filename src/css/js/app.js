
/* =========================================================
   TRIVION
   THE ULTIMATE QUIZ EXPERIENCE
   Developed by Alpha Omega Store
   ========================================================= */

"use strict";

/* =========================
   CONFIGURATION
========================= */

const CONFIG = {
  questionBank: "./data/questions.json",
  questionsPerGame: 10,
  pointsPerCorrectAnswer: 10,
  leaderboardLimit: 10,

  timers: {
    easy: 40,
    medium: 60,
    hard: 65
  },

  storage: {
    language: "trivion_language",
    sound: "trivion_sound",
    statistics: "trivion_statistics",
    leaderboard: "trivion_leaderboard"
  }
};

/* =========================
   TRANSLATIONS
========================= */

const TEXT = {
  id: {
    homeTitle: "Selamat Datang di TRIVION",
    homeDescription: "Uji pengetahuanmu dan jadilah juara!",
    start: "Mulai Bermain",
    categoryTitle: "Pilih Kategori",
    question: "Pertanyaan",
    correct: "Benar!",
    incorrect: "Kurang tepat!",
    timeout: "Waktu habis!",
    explanation: "Penjelasan",
    next: "Pertanyaan Berikutnya",
    resultTitle: "Hasil Permainan",
    correctAnswers: "Jawaban Benar",
    wrongAnswers: "Jawaban Salah",
    accuracy: "Akurasi",
    playAgain: "Main Lagi",
    home: "Beranda",
    leaderboard: "Papan Peringkat",
    noQuestions: "Soal belum tersedia untuk kategori ini.",
    loading: "Memuat pertanyaan...",
    loadError: "Gagal memuat bank soal. Periksa file questions.json.",
    exitConfirm: "Yakin ingin keluar dari permainan?",
    categories: {
      general: "Pengetahuan Umum",
      science: "Sains dan Teknologi",
      history: "Sejarah dan Budaya",
      math: "Matematika dan Logika",
      nature: "Alam dan Lingkungan",
      trivia: "Teka-teki dan Trivia"
    }
  },

  en: {
    homeTitle: "Welcome to TRIVION",
    homeDescription: "Test your knowledge and become a champion!",
    start: "Start Playing",
    categoryTitle: "Choose a Category",
    question: "Question",
    correct: "Correct!",
    incorrect: "Not quite!",
    timeout: "Time is up!",
    explanation: "Explanation",
    next: "Next Question",
    resultTitle: "Game Results",
    correctAnswers: "Correct Answers",
    wrongAnswers: "Wrong Answers",
    accuracy: "Accuracy",
    playAgain: "Play Again",
    home: "Home",
    leaderboard: "Leaderboard",
    noQuestions: "No questions are available for this category.",
    loading: "Loading questions...",
    loadError: "Could not load the question bank. Check questions.json.",
    exitConfirm: "Are you sure you want to leave the game?",
    categories: {
      general: "General Knowledge",
      science: "Science and Technology",
      history: "History and Culture",
      math: "Mathematics and Logic",
      nature: "Nature and Environment",
      trivia: "Riddles and Trivia"
    }
  }
};

/* =========================
   DOM HELPERS
========================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => Array.from(
  document.querySelectorAll(selector)
);

const elements = {
  app: $("#app"),

  languageButton: $("#language-button"),
  languageLabel: $("#language-label"),

  soundButton: $("#sound-button"),
  soundLabel: $("#sound-label"),

  homeScreen: $("#home-screen"),
  homeTitle: $("#home-title"),
  homeDescription: $("#home-description"),
  startButton: $("#start-button"),
  startButtonLabel: $("#start-button-label"),

  totalScore: $("#total-score"),
  totalGames: $("#total-games"),
  bestScore: $("#best-score"),

  categoryScreen: $("#category-screen"),
  categoryTitle: $("#category-title"),
  categoryList: $("#category-list"),

  gameScreen: $("#game-screen"),
  exitGameButton: $("#exit-game-button"),
  questionCounter: $("#question-counter"),
  questionProgress: $("#question-progress"),
  timerDisplay: $("#timer-display"),
  currentScore: $("#current-score"),
  currentCategory: $("#current-category"),
  questionText: $("#question-text"),
  answerOptions: $("#answer-options"),
  answerFeedback: $("#answer-feedback"),

  resultScreen: $("#result-screen"),
  resultTitle: $("#result-title"),
  finalScore: $("#final-score"),
  correctAnswers: $("#correct-answers"),
  wrongAnswers: $("#wrong-answers"),
  accuracyRate: $("#accuracy-rate"),
  playAgainButton: $("#play-again-button"),
  homeButton: $("#home-button"),

  leaderboardScreen: $("#leaderboard-screen"),
  leaderboardList: $("#leaderboard-list"),

  footer: $("#app-footer")
};

/* =========================
   APPLICATION STATE
========================= */

const state = {
  language: loadSetting(CONFIG.storage.language, "id"),
  soundEnabled: loadSetting(CONFIG.storage.sound, false),

  questions: [],
  selectedQuestions: [],
  currentQuestionIndex: 0,

  currentCategory: null,
  currentQuestion: null,

  score: 0,
  correctCount: 0,
  wrongCount: 0,

  timeLeft: 0,
  timerInterval: null,

  answered: false,
  gameActive: false,
  gameSession: 0
};

/* =========================
   STORAGE HELPERS
========================= */

function loadSetting(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    return typeof fallback === "boolean"
      ? saved === "true"
      : saved;
  } catch (error) {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn("Storage unavailable:", error);
  }
}

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save data:", error);
  }
}

/* =========================
   LANGUAGE HELPERS
========================= */

function t(key) {
  const languageText = TEXT[state.language];

  return key.split(".").reduce(
    (value, part) => value?.[part],
    languageText
  ) ?? key;
}

function localized(value) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return value[state.language] || value.id || value.en || "";
}

function updateStaticLanguage() {
  if (elements.homeTitle) {
    elements.homeTitle.textContent = t("homeTitle");
  }

  if (elements.homeDescription) {
    elements.homeDescription.textContent = t("homeDescription");
  }

  if (elements.startButtonLabel) {
    elements.startButtonLabel.textContent = t("start");
  }

  if (elements.categoryTitle) {
    elements.categoryTitle.textContent = t("categoryTitle");
  }

  if (elements.resultTitle) {
    elements.resultTitle.textContent = t("resultTitle");
  }

  if (elements.languageLabel) {
    elements.languageLabel.textContent =
      state.language === "id" ? "ID" : "EN";
  }

  if (elements.playAgainButton) {
    elements.playAgainButton.textContent = t("playAgain");
  }

  if (elements.homeButton) {
    elements.homeButton.textContent = t("home");
  }

  updateSoundLabel();
  updateStatistics();
  renderLeaderboard();

  if (state.currentQuestion && state.gameActive) {
    updateQuestionLanguage();
  }

  if (elements.currentCategory && state.currentCategory) {
    elements.currentCategory.textContent =
      t(`categories.${state.currentCategory}`);
  }
}

function toggleLanguage() {
  state.language = state.language === "id" ? "en" : "id";

  saveSetting(CONFIG.storage.language, state.language);

  updateStaticLanguage();
}

/* =========================
   SOUND SYSTEM
========================= */

let audioContext = null;

function playSound(type) {
  if (!state.soundEnabled) {
    return;
  }

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const frequencies = {
      correct: 660,
      wrong: 220,
      click: 440,
      finish: 880
    };

    oscillator.frequency.value =
      frequencies[type] || 440;

    oscillator.type = "sine";

    gain.gain.setValueAtTime(
      0.12,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.18
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
  } catch (error) {
    console.warn("Sound unavailable:", error);
  }
}

function updateSoundLabel() {
  if (!elements.soundLabel) {
    return;
  }

  elements.soundLabel.textContent =
    state.soundEnabled ? "ON" : "OFF";
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;

  saveSetting(
    CONFIG.storage.sound,
    state.soundEnabled
  );

  updateSoundLabel();

  playSound("click");
}

/* =========================
   SCREEN NAVIGATION
========================= */

function showScreen(screenName) {
  const screens = [
    "home",
    "category",
    "game",
    "result",
    "leaderboard"
  ];

  screens.forEach((name) => {
    const screen = $(`#${name}-screen`);

    if (!screen) {
      return;
    }

    const isActive = name === screenName;

    screen.hidden = !isActive;
    screen.classList.toggle("active", isActive);
  });

  $$("[data-screen]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.screen === screenName
    );
  });

  if (elements.footer) {
    elements.footer.hidden = screenName === "game";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================
   QUESTION BANK
========================= */

function validateQuestion(question) {
  if (!question || typeof question !== "object") {
    return false;
  }

  if (
    typeof question.id !== "string" ||
    typeof question.category !== "string" ||
    !["easy", "medium", "hard"].includes(question.difficulty)
  ) {
    return false;
  }

  if (!localizedForValidation(question.question)) {
    return false;
  }

  if (!question.options || typeof question.options !== "object") {
    return false;
  }

  const answers = ["A", "B", "C", "D"];

  for (const answer of answers) {
    if (!localizedForValidation(question.options[answer])) {
      return false;
    }
  }

  if (!answers.includes(question.answer)) {
    return false;
  }

  return true;
}

function localizedForValidation(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Boolean(
    value &&
    typeof value === "object" &&
    (
      (typeof value.id === "string" && value.id.trim()) ||
      (typeof value.en === "string" && value.en.trim())
    )
  );
}

async function loadQuestionBank() {
  if (state.questions.length > 0) {
    return true;
  }

  try {
    const response = await fetch(CONFIG.questionBank, {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("Question bank not found.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid question bank format.");
    }

    state.questions = data.filter(validateQuestion);

    if (state.questions.length === 0) {
      throw new Error("No valid questions found.");
    }

    return true;
  } catch (error) {
    console.error("Question bank error:", error);
    return false;
  }
}

/* =========================
   CATEGORY SELECTION
========================= */

function openCategorySelection() {
  showScreen("category");
}

function getCategoryQuestions(category) {
  return state.questions.filter(
    (question) => question.category === category
  );
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* =========================
   GAME INITIALIZATION
========================= */

async function startGame(category) {
  const session = ++state.gameSession;

  stopTimer();

  state.gameActive = false;
  state.answered = false;

  showScreen("game");

  if (elements.questionText) {
    elements.questionText.textContent = t("loading");
  }

  const loaded = await loadQuestionBank();

  if (session !== state.gameSession) {
    return;
  }

  if (!loaded) {
    showScreen("category");

    alert(t("loadError"));
    return;
  }

  const availableQuestions = getCategoryQuestions(category);

  if (availableQuestions.length < CONFIG.questionsPerGame) {
    showScreen("category");

    alert(t("noQuestions"));
    return;
  }

  state.currentCategory = category;

  state.selectedQuestions = shuffleArray(
    availableQuestions
  ).slice(0, CONFIG.questionsPerGame);

  state.currentQuestionIndex = 0;
  state.score = 0;
  state.correctCount = 0;
  state.wrongCount = 0;

  state.gameActive = true;

  renderQuestion();
}

/* =========================
   QUESTION RENDERING
========================= */

function renderQuestion() {
  const question =
    state.selectedQuestions[state.currentQuestionIndex];

  if (!question) {
    finishGame();
    return;
  }

  state.currentQuestion = question;
  state.answered = false;

  const questionNumber = state.currentQuestionIndex + 1;

  if (elements.questionCounter) {
    elements.questionCounter.textContent =
      `${questionNumber} / ${CONFIG.questionsPerGame}`;
  }

  if (elements.questionProgress) {
    elements.questionProgress.style.width =
      `${(questionNumber / CONFIG.questionsPerGame) * 100}%`;
  }

  if (elements.currentScore) {
    elements.currentScore.textContent = state.score;
  }

  if (elements.currentCategory) {
    elements.currentCategory.textContent =
      t(`categories.${state.currentCategory}`);
  }

  if (elements.answerFeedback) {
    elements.answerFeedback.hidden = true;
    elements.answerFeedback.textContent = "";
  }

  updateQuestionLanguage();

  startTimer(question.difficulty);
}

function updateQuestionLanguage() {
  const question = state.currentQuestion;

  if (!question) {
    return;
  }

  if (elements.questionText) {
    elements.questionText.textContent =
      localized(question.question);
  }

  ["A", "B", "C", "D"].forEach((answer) => {
    const button = $(
      `.answer-option[data-answer="${answer}"]`
    );

    if (!button) {
      return;
    }

    const textElement = button.querySelector(".answer-text");

    if (textElement) {
      textElement.textContent =
        localized(question.options[answer]);
    }
  });

  if (state.answered) {
    updateAnswerExplanation();
  }
}

/* =========================
   TIMER SYSTEM
========================= */

function startTimer(difficulty) {
  stopTimer();

  state.timeLeft =
    CONFIG.timers[difficulty] || CONFIG.timers.medium;

  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    if (!state.gameActive || state.answered) {
      stopTimer();
      return;
    }

    state.timeLeft--;

    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  if (!elements.timerDisplay) {
    return;
  }

  elements.timerDisplay.textContent = state.timeLeft;

  elements.timerDisplay.classList.toggle(
    "timer-warning",
    state.timeLeft <= 10
  );
}

/* =========================
   ANSWER SYSTEM
========================= */

function handleAnswer(selectedAnswer) {
  if (
    !state.gameActive ||
    state.answered ||
    !state.currentQuestion
  ) {
    return;
  }

  if (!["A", "B", "C", "D"].includes(selectedAnswer)) {
    return;
  }

  state.answered = true;

  stopTimer();

  const isCorrect =
    selectedAnswer === state.currentQuestion.answer;

  if (isCorrect) {
    state.correctCount++;

    state.score += CONFIG.pointsPerCorrectAnswer;

    playSound("correct");
  } else {
    state.wrongCount++;

    playSound("wrong");
  }

  if (elements.currentScore) {
    elements.currentScore.textContent = state.score;
  }

  updateAnswerButtons(selectedAnswer);

  showAnswerFeedback(isCorrect);

  updateAnswerExplanation();

  const session = state.gameSession;

  window.setTimeout(() => {
    if (session !== state.gameSession || !state.gameActive) {
      return;
    }

    goToNextQuestion();
  }, 1600);
}

function handleTimeout() {
  if (state.answered || !state.gameActive) {
    return;
  }

  state.answered = true;

  stopTimer();

  state.wrongCount++;

  updateAnswerButtons(null);

  showAnswerFeedback(false, true);

  updateAnswerExplanation();

  const session = state.gameSession;

  window.setTimeout(() => {
    if (session !== state.gameSession || !state.gameActive) {
      return;
    }

    goToNextQuestion();
  }, 1600);
}

function updateAnswerButtons(selectedAnswer) {
  const correctAnswer = state.currentQuestion.answer;

  $$(".answer-option").forEach((button) => {
    const answer = button.dataset.answer;

    button.disabled = true;

    button.classList.remove(
      "correct",
      "incorrect",
      "selected"
    );

    if (answer === correctAnswer) {
      button.classList.add("correct");
    } else if (answer === selectedAnswer) {
      button.classList.add("incorrect");
    }
  });
}

function showAnswerFeedback(isCorrect, timeout = false) {
  if (!elements.answerFeedback) {
    return;
  }

  elements.answerFeedback.hidden = false;

  elements.answerFeedback.classList.remove(
    "correct",
    "incorrect"
  );

  elements.answerFeedback.classList.add(
    isCorrect ? "correct" : "incorrect"
  );

  elements.answerFeedback.textContent = timeout
    ? t("timeout")
    : isCorrect
      ? t("correct")
      : t("incorrect");
}

function updateAnswerExplanation() {
  if (!elements.answerFeedback || !state.currentQuestion) {
    return;
  }

  const explanation = localized(
    state.currentQuestion.explanation
  );

  if (!explanation) {
    return;
  }

  elements.answerFeedback.textContent +=
    ` ${t("explanation")}: ${explanation}`;
}

/* =========================
   QUESTION PROGRESSION
========================= */

function goToNextQuestion() {
  if (!state.gameActive) {
    return;
  }

  state.currentQuestionIndex++;

  if (
    state.currentQuestionIndex >=
    state.selectedQuestions.length
  ) {
    finishGame();
    return;
  }

  renderQuestion();
}

/* =========================
   GAME RESULTS
========================= */

function finishGame() {
  stopTimer();

  state.gameActive = false;
  state.answered = true;

  const accuracy = Math.round(
    (state.correctCount / CONFIG.questionsPerGame) * 100
  );

  if (elements.finalScore) {
    elements.finalScore.textContent = state.score;
  }

  if (elements.correctAnswers) {
    elements.correctAnswers.textContent =
      state.correctCount;
  }

  if (elements.wrongAnswers) {
    elements.wrongAnswers.textContent =
      state.wrongCount;
  }

  if (elements.accuracyRate) {
    elements.accuracyRate.textContent =
      `${accuracy}%`;
  }

  saveGameResult();

  updateStatistics();

  playSound("finish");

  showScreen("result");
}

/* =========================
   STATISTICS
========================= */

function saveGameResult() {
  const statistics = loadJSON(
    CONFIG.storage.statistics,
    {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0
    }
  );

  statistics.totalGames++;
  statistics.totalScore += state.score;

  statistics.bestScore = Math.max(
    statistics.bestScore,
    state.score
  );

  saveJSON(
    CONFIG.storage.statistics,
    statistics
  );

  const leaderboard = loadJSON(
    CONFIG.storage.leaderboard,
    []
  );

  leaderboard.push({
    score: state.score,
    correct: state.correctCount,
    category: state.currentCategory,
    date: new Date().toISOString()
  });

  leaderboard.sort((a, b) => b.score - a.score);

  saveJSON(
    CONFIG.storage.leaderboard,
    leaderboard.slice(0, CONFIG.leaderboardLimit)
  );
}

function updateStatistics() {
  const statistics = loadJSON(
    CONFIG.storage.statistics,
    {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0
    }
  );

  if (elements.totalScore) {
    elements.totalScore.textContent =
      statistics.totalScore;
  }

  if (elements.totalGames) {
    elements.totalGames.textContent =
      statistics.totalGames;
  }

  if (elements.bestScore) {
    elements.bestScore.textContent =
      statistics.bestScore;
  }
}

/* =========================
   LEADERBOARD
========================= */

function renderLeaderboard() {
  if (!elements.leaderboardList) {
    return;
  }

  const leaderboard = loadJSON(
    CONFIG.storage.leaderboard,
    []
  );

  elements.leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.textContent =
      state.language === "id"
        ? "Belum ada catatan permainan."
        : "No game records yet.";

    elements.leaderboardList.appendChild(emptyMessage);

    return;
  }

  leaderboard.forEach((entry, index) => {
    const item = document.createElement("div");

    item.className = "leaderboard-item";

    const rank = document.createElement("span");
    rank.textContent = `#${index + 1}`;

    const category = document.createElement("span");
    category.textContent =
      t(`categories.${entry.category}`);

    const score = document.createElement("strong");
    score.textContent = `${entry.score} pts`;

    item.append(rank, category, score);

    elements.leaderboardList.appendChild(item);
  });
}

/* =========================
   EVENT LISTENERS
========================= */

function setupEventListeners() {
  elements.startButton?.addEventListener(
    "click",
    openCategorySelection
  );

  elements.languageButton?.addEventListener(
    "click",
    toggleLanguage
  );

  elements.soundButton?.addEventListener(
    "click",
    toggleSound
  );

  elements.exitGameButton?.addEventListener(
    "click",
    () => {
      if (!state.gameActive) {
        showScreen("home");
        return;
      }

      if (confirm(t("exitConfirm"))) {
        state.gameSession++;
        state.gameActive = false;
        stopTimer();
        showScreen("home");
      }
    }
  );

  elements.answerOptions?.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        ".answer-option"
      );

      if (!button) {
        return;
      }

      handleAnswer(button.dataset.answer);
    }
  );

  elements.playAgainButton?.addEventListener(
    "click",
    () => {
      if (state.currentCategory) {
        startGame(state.currentCategory);
      } else {
        openCategorySelection();
      }
    }
  );

  elements.homeButton?.addEventListener(
    "click",
    () => {
      state.gameSession++;
      state.gameActive = false;
      stopTimer();
      showScreen("home");
    }
  );

  $$("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      if (category) {
        startGame(category);
      }
    });
  });

  $$("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const screenName = button.dataset.screen;

      if (
        ["home", "category", "leaderboard"].includes(screenName)
      ) {
        if (state.gameActive && screenName !== "game") {
          return;
        }

        if (screenName === "category") {
          openCategorySelection();
        } else {
          showScreen(screenName);
        }
      }
    });
  });
}

/* =========================
   APPLICATION INITIALIZATION
========================= */

function initializeApp() {
  setupEventListeners();

  updateStaticLanguage();

  showScreen("home");

  console.log(
    "TRIVION initialized successfully."
  );
}

document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);
