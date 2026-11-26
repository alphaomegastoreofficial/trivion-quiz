/* =========================================================
   TRIVION
   THE ULTIMATE QUIZ EXPERIENCE
   KNOWLEDGE • CHALLENGE • VICTORY
   Developed by Alpha Omega Store
   ========================================================= */

"use strict";

/* =========================================================
   1. GAME CONFIGURATION
========================================================= */

const CONFIG = {
  questionBank: "./data/questions.json",
  questionsPerGame: 10,
  pointsPerCorrectAnswer: 10,
  leaderboardLimit: 10,
  answerDelay: 1600,

  timers: {
    easy: 40,
    medium: 60,
    hard: 65
  },

  categories: [
    "general",
    "science",
    "history",
    "math",
    "nature",
    "trivia"
  ],

  storage: {
    language: "trivion_language",
    sound: "trivion_sound",
    statistics: "trivion_statistics",
    leaderboard: "trivion_leaderboard"
  }
};

/* =========================================================
   2. LANGUAGE TRANSLATIONS
========================================================= */

const TEXT = {
  id: {
    homeTitle: "Selamat Datang di TRIVION",
    homeDescription: "Uji pengetahuanmu dan jadilah juara!",
    start: "Mulai Bermain",
    categoryTitle: "Pilih Kategori",
    categoryDescription: "Pilih kategori pengetahuan untuk memulai.",
    question: "Pertanyaan",
    correct: "Benar!",
    incorrect: "Kurang tepat!",
    timeout: "Waktu habis!",
    explanation: "Penjelasan",
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
    emptyLeaderboard: "Belum ada catatan permainan. Ayo mulai bermain!",
    backHome: "Kembali ke Beranda",
    exit: "Keluar",
    timeLeft: "WAKTU TERSISA",
    currentScore: "SKOR SAAT INI",
    finalScore: "SKOR AKHIR",
    points: "POIN",
    correctShort: "Benar",
    incorrectShort: "Salah",
    accuracyShort: "Akurasi",
    questionOf: "PERTANYAAN",
    totalScore: "Total Skor",
    gamesPlayed: "Permainan Dimainkan",
    bestScore: "Skor Terbaik",
    chooseChallenge: "PILIH TANTANGANMU",
    playerOverview: "Informasi Pemain",
    yourProgress: "PROGRES KAMU",
    discover: "TEMUKAN TRIVION",
    gameExperience: "Pengalaman Bermain",
    multipleCategories: "Beragam Kategori",
    multipleCategoriesDescription: "Jelajahi berbagai bidang pengetahuan.",
    timeChallenge: "Tantangan Waktu",
    timeChallengeDescription: "Jawab setiap pertanyaan sebelum waktu habis.",
    competition: "Kompetisi",
    competitionDescription: "Tingkatkan skor dan catatan pribadimu.",
    offline: "Permainan Offline",
    offlineDescription: "Nikmati kuis tanpa koneksi internet setelah dimuat.",
    challengeCompleted: "TANTANGAN SELESAI",
    performanceSummary: "Ringkasan performamu",
    yourAchievements: "PENCAPAIANMU",
    personalTopScores: "Catatan skor terbaikmu.",
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
    categoryDescription: "Choose a knowledge category to begin.",
    question: "Question",
    correct: "Correct!",
    incorrect: "Not quite!",
    timeout: "Time is up!",
    explanation: "Explanation",
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
    emptyLeaderboard: "No game records yet. Start playing!",
    backHome: "Back to Home",
    exit: "Exit",
    timeLeft: "TIME LEFT",
    currentScore: "CURRENT SCORE",
    finalScore: "YOUR FINAL SCORE",
    points: "POINTS",
    correctShort: "Correct",
    incorrectShort: "Incorrect",
    accuracyShort: "Accuracy",
    questionOf: "QUESTION",
    totalScore: "Total Score",
    gamesPlayed: "Games Played",
    bestScore: "Best Score",
    chooseChallenge: "CHOOSE YOUR CHALLENGE",
    playerOverview: "Player Overview",
    yourProgress: "YOUR PROGRESS",
    discover: "DISCOVER TRIVION",
    gameExperience: "Game Experience",
    multipleCategories: "Multiple Categories",
    multipleCategoriesDescription: "Explore different fields of knowledge.",
    timeChallenge: "Time Challenge",
    timeChallengeDescription: "Answer every question before time runs out.",
    competition: "Competition",
    competitionDescription: "Improve your score and personal records.",
    offline: "Offline Gameplay",
    offlineDescription: "Enjoy your quiz without an internet connection after loading.",
    challengeCompleted: "CHALLENGE COMPLETED",
    performanceSummary: "Your performance summary",
    yourAchievements: "YOUR ACHIEVEMENTS",
    personalTopScores: "Your personal top scores.",
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

/* =========================================================
   3. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

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

  footer: $("#app-footer") || $(".app-footer"),

  mainContent: $("#main-content")
};

/* =========================================================
   4. APPLICATION STATE
========================================================= */

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
  answerTimeout: null,

  answered: false,
  gameActive: false,
  gameSession: 0,

  lastAnswer: null,
  wasTimeout: false,
  lastFeedbackCorrect: false,

  bankLoading: false,
  bankLoadPromise: null
};

/* =========================================================
   5. STORAGE SYSTEM
========================================================= */

function loadSetting(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    if (typeof fallback === "boolean") {
      return saved === "true";
    }

    return saved;
  } catch (error) {
    console.warn("Could not read setting:", error);
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch (error) {
    console.warn("Could not save setting:", error);
    return false;
  }
}

function loadJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.warn("Could not read saved data:", error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Could not save data:", error);
    return false;
  }
}

function getDefaultStatistics() {
  return {
    totalGames: 0,
    totalScore: 0,
    bestScore: 0
  };
}

function getStatistics() {
  const saved = loadJSON(
    CONFIG.storage.statistics,
    getDefaultStatistics()
  );

  return {
    totalGames: Number(saved.totalGames) || 0,
    totalScore: Number(saved.totalScore) || 0,
    bestScore: Number(saved.bestScore) || 0
  };
}

function getLeaderboard() {
  const saved = loadJSON(
    CONFIG.storage.leaderboard,
    []
  );

  return Array.isArray(saved) ? saved : [];
}

/* =========================================================
   6. LANGUAGE SYSTEM
========================================================= */

function t(key) {
  const dictionary = TEXT[state.language] || TEXT.id;

  return key.split(".").reduce(
    (value, part) => value?.[part],
    dictionary
  ) ?? key;
}

function localized(value) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[state.language] ||
    value.id ||
    value.en ||
    ""
  );
}

function toggleLanguage() {
  state.language = state.language === "id" ? "en" : "id";

  saveSetting(CONFIG.storage.language, state.language);

  updateStaticLanguage();
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
    elements.playAgainButton.textContent =
      `${t("playAgain")} →`;
  }

  if (elements.homeButton) {
    elements.homeButton.textContent = t("home").toUpperCase();
  }

  if (elements.exitGameButton) {
    elements.exitGameButton.textContent =
      `← ${t("exit")}`;
  }

  updateHomeStaticText();
  updateCategoryStaticText();
  updateGameStaticText();
  updateResultStaticText();
  updateNavigationText();

  updateSoundLabel();
  updateStatistics();
  renderLeaderboard();

  if (state.currentQuestion && state.gameActive) {
    updateQuestionLanguage();
    updateAnswerFeedbackLanguage();
  }

  if (state.currentCategory && elements.currentCategory) {
    elements.currentCategory.textContent =
      t(`categories.${state.currentCategory}`).toUpperCase();
  }
}

function updateHomeStaticText() {
  const playerHeading = $(".player-section .section-heading h2");

  if (playerHeading) {
    playerHeading.textContent = t("playerOverview");
  }

  const playerEyebrow = $(".player-section .section-eyebrow");

  if (playerEyebrow) {
    playerEyebrow.textContent = t("yourProgress");
  }

  const featureHeading = $(".features-section .section-heading h2");

  if (featureHeading) {
    featureHeading.textContent = t("gameExperience");
  }

  const featureEyebrow = $(".features-section .section-eyebrow");

  if (featureEyebrow) {
    featureEyebrow.textContent = t("discover");
  }

  const statLabels = $$(".stat-card .stat-label");

  const labels = [
    t("totalScore"),
    t("gamesPlayed"),
    t("bestScore")
  ];

  statLabels.forEach((label, index) => {
    if (labels[index]) {
      label.textContent = labels[index];
    }
  });

  const featureCards = $$(".feature-card");

  const features = [
    [t("multipleCategories"), t("multipleCategoriesDescription")],
    [t("timeChallenge"), t("timeChallengeDescription")],
    [t("competition"), t("competitionDescription")],
    [t("offline"), t("offlineDescription")]
  ];

  featureCards.forEach((card, index) => {
    const heading = $("h3", card);
    const description = $("p", card);

    if (heading && features[index]) {
      heading.textContent = features[index][0];
    }

    if (description && features[index]) {
      description.textContent = features[index][1];
    }
  });
}

function updateCategoryStaticText() {
  const eyebrow = $(".category-screen .section-eyebrow");

  if (eyebrow) {
    eyebrow.textContent = t("chooseChallenge");
  }

  const description = $(".category-screen .screen-heading > p:last-child");

  if (description) {
    description.textContent = t("categoryDescription");
  }

  const backButton = $(
    '.category-screen [data-screen="home-screen"]'
  );

  if (backButton) {
    backButton.textContent = `← ${t("backHome")}`;
  }

  const categoryButtons = $$("[data-category]");

  categoryButtons.forEach((button) => {
    const category = button.dataset.category;
    const title = $("strong", button);
    const subtitle = $("small", button);

    if (title && CONFIG.categories.includes(category)) {
      title.textContent = t(`categories.${category}`);
    }

    if (subtitle) {
      const englishNames = {
        general: "General Knowledge",
        science: "Science & Technology",
        history: "History & Culture",
        math: "Mathematics & Logic",
        nature: "Nature & Environment",
        trivia: "Riddles & Trivia"
      };

      const indonesianNames = {
        general: "Pengetahuan Umum",
        science: "Sains dan Teknologi",
        history: "Sejarah dan Budaya",
        math: "Matematika dan Logika",
        nature: "Alam dan Lingkungan",
        trivia: "Teka-teki dan Trivia"
      };

      subtitle.textContent =
        state.language === "id"
          ? englishNames[category]
          : indonesianNames[category];
    }
  });
}

function updateGameStaticText() {
  const timerLabel = $(".timer-card span");

  if (timerLabel) {
    timerLabel.textContent = t("timeLeft");
  }

  const scoreLabel = $(".score-card span");

  if (scoreLabel) {
    scoreLabel.textContent = t("currentScore");
  }
}

function updateResultStaticText() {
  const eyebrow = $(".result-content .section-eyebrow");

  if (eyebrow) {
    eyebrow.textContent = t("challengeCompleted");
  }

  const description = $(".result-content > p:not(.section-eyebrow)");

  if (description) {
    description.textContent = t("performanceSummary");
  }

  const finalScoreLabel = $(".final-score-card > span");

  if (finalScoreLabel) {
    finalScoreLabel.textContent = t("finalScore");
  }

  const finalScoreUnit = $(".final-score-card > small");

  if (finalScoreUnit) {
    finalScoreUnit.textContent = t("points");
  }

  const resultLabels = $$(".result-stats > div span");

  const labels = [
    t("correctShort"),
    t("incorrectShort"),
    t("accuracyShort")
  ];

  resultLabels.forEach((label, index) => {
    if (labels[index]) {
      label.textContent = labels[index];
    }
  });
}

function updateNavigationText() {
  const navigation = $$(".bottom-navigation .nav-item");

  const labels = [
    t("home"),
    state.language === "id" ? "Kategori" : "Categories",
    state.language === "id" ? "Skor" : "Scores"
  ];

  navigation.forEach((item, index) => {
    const small = $("small", item);

    if (small && labels[index]) {
      small.textContent = labels[index];
    }
  });

  const leaderboardEyebrow = $(
    ".leaderboard-screen .section-eyebrow"
  );

  if (leaderboardEyebrow) {
    leaderboardEyebrow.textContent = t("yourAchievements");
  }

  const leaderboardDescription = $(
    ".leaderboard-screen .screen-heading > p:last-child"
  );

  if (leaderboardDescription) {
    leaderboardDescription.textContent = t("personalTopScores");
  }

  const leaderboardBackButton = $(
    '.leaderboard-screen [data-screen="home-screen"]'
  );

  if (leaderboardBackButton) {
    leaderboardBackButton.textContent = `← ${t("backHome")}`;
  }
}

/* =========================================================
   7. SOUND SYSTEM
========================================================= */

let audioContext = null;

function playSound(type) {
  if (!state.soundEnabled) {
    return;
  }

  try {
    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const frequencies = {
      correct: 660,
      wrong: 220,
      click: 440,
      finish: 880
    };

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequencies[type] || 440;

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
  if (elements.soundLabel) {
    elements.soundLabel.textContent =
      state.soundEnabled ? "ON" : "OFF";
  }

  if (elements.soundButton) {
    elements.soundButton.setAttribute(
      "aria-label",
      state.soundEnabled
        ? "Turn sound off"
        : "Turn sound on"
    );
  }
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

/* =========================================================
   8. SCREEN NAVIGATION
========================================================= */

const SCREEN_IDS = {
  home: "home-screen",
  category: "category-screen",
  game: "game-screen",
  result: "result-screen",
  leaderboard: "leaderboard-screen"
};

function normalizeScreenName(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value)
    .replace("-screen", "")
    .trim();

  return Object.prototype.hasOwnProperty.call(
    SCREEN_IDS,
    normalized
  )
    ? normalized
    : null;
}

function showScreen(screenName) {
  const normalized = normalizeScreenName(screenName);

  if (!normalized) {
    console.warn("Unknown screen:", screenName);
    return;
  }

  Object.entries(SCREEN_IDS).forEach(([name, id]) => {
    const screen = $(`#${id}`);

    if (!screen) {
      return;
    }

    const isActive = name === normalized;

    screen.hidden = !isActive;
    screen.classList.toggle("active", isActive);
  });

  $$("[data-screen]").forEach((button) => {
    const target = normalizeScreenName(button.dataset.screen);

    button.classList.toggle(
      "active",
      target === normalized
    );
  });

  if (elements.footer) {
    elements.footer.hidden = normalized === "game";
  }

  if (elements.mainContent) {
    elements.mainContent.setAttribute(
      "data-current-screen",
      normalized
    );
  }

  if (normalized === "leaderboard") {
    renderLeaderboard();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================================================
   9. QUESTION BANK VALIDATION
========================================================= */

function localizedForValidation(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  return Boolean(
    (
      typeof value.id === "string" &&
      value.id.trim().length > 0
    ) ||
    (
      typeof value.en === "string" &&
      value.en.trim().length > 0
    )
  );
}

function validateQuestion(question) {
  if (!question || typeof question !== "object") {
    return false;
  }

  if (
    typeof question.id !== "string" ||
    !question.id.trim()
  ) {
    return false;
  }

  if (!CONFIG.categories.includes(question.category)) {
    return false;
  }

  if (
    !["easy", "medium", "hard"].includes(
      question.difficulty
    )
  ) {
    return false;
  }

  if (!localizedForValidation(question.question)) {
    return false;
  }

  if (
    !question.options ||
    typeof question.options !== "object"
  ) {
    return false;
  }

  const answerLetters = ["A", "B", "C", "D"];

  for (const letter of answerLetters) {
    if (!localizedForValidation(question.options[letter])) {
      return false;
    }
  }

  if (!answerLetters.includes(question.answer)) {
    return false;
  }

  if (
    question.explanation !== undefined &&
    question.explanation !== null &&
    !localizedForValidation(question.explanation)
  ) {
    return false;
  }

  return true;
}

async function loadQuestionBank() {
  if (state.questions.length > 0) {
    return true;
  }

  if (state.bankLoadPromise) {
    return state.bankLoadPromise;
  }

  state.bankLoading = true;

  state.bankLoadPromise = (async () => {
    try {
      const response = await fetch(CONFIG.questionBank, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(
          `Question bank request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Question bank must be a JSON array.");
      }

      const validQuestions = data.filter(validateQuestion);

      if (validQuestions.length === 0) {
        throw new Error("No valid questions found.");
      }

      state.questions = validQuestions;

      console.info(
        `TRIVION: ${validQuestions.length} questions loaded.`
      );

      return true;
    } catch (error) {
      console.error("Question bank error:", error);
      state.questions = [];
      return false;
    } finally {
      state.bankLoading = false;
      state.bankLoadPromise = null;
    }
  })();

  return state.bankLoadPromise;
}

/* =========================================================
   10. CATEGORY SELECTION
========================================================= */

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

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

/* =========================================================
   11. GAME INITIALIZATION
========================================================= */

async function startGame(category) {
  if (!CONFIG.categories.includes(category)) {
    console.error("Invalid category:", category);
    return;
  }

  const session = ++state.gameSession;

  stopTimer();
  clearAnswerTimeout();

  state.gameActive = false;
  state.answered = false;
  state.currentCategory = category;
  state.currentQuestion = null;

  state.lastAnswer = null;
  state.wasTimeout = false;

  resetAnswerButtons();

  showScreen("game");

  if (elements.questionText) {
    elements.questionText.textContent = t("loading");
  }

  if (elements.answerFeedback) {
    elements.answerFeedback.hidden = true;
    elements.answerFeedback.textContent = "";
  }

  const loaded = await loadQuestionBank();

  if (session !== state.gameSession) {
    return;
  }

  if (!loaded) {
    showScreen("category");
    window.alert(t("loadError"));
    return;
  }

  const availableQuestions = getCategoryQuestions(category);

  if (availableQuestions.length < CONFIG.questionsPerGame) {
    showScreen("category");
    window.alert(t("noQuestions"));
    return;
  }

  state.selectedQuestions = shuffleArray(
    availableQuestions
  ).slice(0, CONFIG.questionsPerGame);

  state.currentQuestionIndex = 0;

  state.score = 0;
  state.correctCount = 0;
  state.wrongCount = 0;

  state.timeLeft = 0;
  state.gameActive = true;
  state.answered = false;

  if (elements.currentScore) {
    elements.currentScore.textContent = "0";
  }

  renderQuestion();
}

/* =========================================================
   12. QUESTION RENDERING
========================================================= */

function renderQuestion() {
  if (!state.gameActive) {
    return;
  }

  const question =
    state.selectedQuestions[state.currentQuestionIndex];

  if (!question) {
    finishGame();
    return;
  }

  state.currentQuestion = question;
  state.answered = false;
  state.lastAnswer = null;
  state.wasTimeout = false;
  state.lastFeedbackCorrect = false;

  resetAnswerButtons();

  const questionNumber = state.currentQuestionIndex + 1;

  if (elements.questionCounter) {
    elements.questionCounter.textContent =
      `${t("questionOf")} ${questionNumber} / ${state.selectedQuestions.length}`;
  }

  if (elements.questionProgress) {
    const progress =
      (questionNumber / state.selectedQuestions.length) * 100;

    elements.questionProgress.style.width = `${progress}%`;
    elements.questionProgress.setAttribute(
      "aria-valuenow",
      String(Math.round(progress))
    );
  }

  if (elements.currentScore) {
    elements.currentScore.textContent = state.score;
  }

  if (elements.currentCategory) {
    elements.currentCategory.textContent =
      t(`categories.${state.currentCategory}`).toUpperCase();
  }

  if (elements.answerFeedback) {
    elements.answerFeedback.hidden = true;
    elements.answerFeedback.textContent = "";
    elements.answerFeedback.classList.remove(
      "correct",
      "incorrect"
    );
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

    const textElement = $(".answer-text", button);

    if (textElement) {
      textElement.textContent =
        localized(question.options[answer]);
    }
  });

  if (state.answered) {
    updateAnswerFeedbackLanguage();
  }
}

/* =========================================================
   13. TIMER SYSTEM
========================================================= */

function startTimer(difficulty) {
  stopTimer();

  state.timeLeft =
    CONFIG.timers[difficulty] || CONFIG.timers.medium;

  updateTimerDisplay();

  state.timerInterval = window.setInterval(() => {
    if (!state.gameActive || state.answered) {
      stopTimer();
      return;
    }

    state.timeLeft = Math.max(0, state.timeLeft - 1);

    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval !== null) {
    window.clearInterval(state.timerInterval);
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

  elements.timerDisplay.setAttribute(
    "aria-label",
    `${state.timeLeft} seconds`
  );
}

/* =========================================================
   14. ANSWER BUTTON RESET
========================================================= */

function resetAnswerButtons() {
  $$(".answer-option").forEach((button) => {
    button.disabled = false;

    button.classList.remove(
      "correct",
      "incorrect",
      "selected"
    );

    button.removeAttribute("aria-pressed");
  });
}

/* =========================================================
   15. ANSWER SYSTEM
========================================================= */

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
  state.lastAnswer = selectedAnswer;
  state.wasTimeout = false;

  stopTimer();

  const isCorrect =
    selectedAnswer === state.currentQuestion.answer;

  state.lastFeedbackCorrect = isCorrect;

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

  scheduleNextQuestion();
}

function handleTimeout() {
  if (!state.gameActive || state.answered) {
    return;
  }

  state.answered = true;
  state.lastAnswer = null;
  state.wasTimeout = true;
  state.lastFeedbackCorrect = false;

  stopTimer();

  state.wrongCount++;

  updateAnswerButtons(null);
  showAnswerFeedback(false, true);
  updateAnswerExplanation();

  scheduleNextQuestion();
}

function updateAnswerButtons(selectedAnswer) {
  if (!state.currentQuestion) {
    return;
  }

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

    if (answer === selectedAnswer) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-pressed",
      String(answer === selectedAnswer)
    );
  });
}

/* =========================================================
   16. ANSWER FEEDBACK AND EXPLANATION
========================================================= */

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

  const message = timeout
    ? t("timeout")
    : isCorrect
      ? t("correct")
      : t("incorrect");

  elements.answerFeedback.textContent = message;
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

  const message = state.wasTimeout
    ? t("timeout")
    : state.lastFeedbackCorrect
      ? t("correct")
      : t("incorrect");

  elements.answerFeedback.textContent =
    `${message} ${t("explanation")}: ${explanation}`;
}

function updateAnswerFeedbackLanguage() {
  if (!state.answered || !elements.answerFeedback) {
    return;
  }

  showAnswerFeedback(
    state.lastFeedbackCorrect,
    state.wasTimeout
  );

  updateAnswerExplanation();
}

/* =========================================================
   17. QUESTION PROGRESSION
========================================================= */

function clearAnswerTimeout() {
  if (state.answerTimeout !== null) {
    window.clearTimeout(state.answerTimeout);
    state.answerTimeout = null;
  }
}

function scheduleNextQuestion() {
  clearAnswerTimeout();

  const currentSession = state.gameSession;

  state.answerTimeout = window.setTimeout(() => {
    state.answerTimeout = null;

    if (
      currentSession !== state.gameSession ||
      !state.gameActive
    ) {
      return;
    }

    goToNextQuestion();
  }, CONFIG.answerDelay);
}

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

/* =========================================================
   18. GAME RESULTS
========================================================= */

function finishGame() {
  if (!state.gameActive) {
    return;
  }

  stopTimer();
  clearAnswerTimeout();

  state.gameActive = false;
  state.answered = true;

  const totalQuestions = state.selectedQuestions.length;

  const accuracy = totalQuestions > 0
    ? Math.round(
        (state.correctCount / totalQuestions) * 100
      )
    : 0;

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
  renderLeaderboard();

  playSound("finish");

  showScreen("result");
}

/* =========================================================
   19. SAVE GAME RESULT
========================================================= */

function saveGameResult() {
  const statistics = getStatistics();

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

  const leaderboard = getLeaderboard();

  leaderboard.push({
    score: state.score,
    correct: state.correctCount,
    wrong: state.wrongCount,
    category: state.currentCategory,
    date: new Date().toISOString()
  });

  leaderboard.sort((first, second) => {
    if (second.score !== first.score) {
      return second.score - first.score;
    }

    return second.correct - first.correct;
  });

  saveJSON(
    CONFIG.storage.leaderboard,
    leaderboard.slice(0, CONFIG.leaderboardLimit)
  );
}

/* =========================================================
   20. PLAYER STATISTICS
========================================================= */

function updateStatistics() {
  const statistics = getStatistics();

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

/* =========================================================
   21. LEADERBOARD
========================================================= */

function renderLeaderboard() {
  if (!elements.leaderboardList) {
    return;
  }

  const leaderboard = getLeaderboard();

  elements.leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-state";
    emptyMessage.textContent = t("emptyLeaderboard");

    elements.leaderboardList.appendChild(emptyMessage);

    return;
  }

  leaderboard
    .slice(0, CONFIG.leaderboardLimit)
    .forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-item";

      const rank = document.createElement("span");
      rank.className = "leaderboard-rank";
      rank.textContent = `#${index + 1}`;

      const category = document.createElement("span");
      category.className = "leaderboard-category";
      category.textContent =
        t(`categories.${entry.category}`);

      const score = document.createElement("strong");
      score.className = "leaderboard-score";
      score.textContent = `${Number(entry.score) || 0} ${t("points")}`;

      item.append(rank, category, score);

      elements.leaderboardList.appendChild(item);
    });
}

/* =========================================================
   22. EXIT AND RESET GAME
========================================================= */

function stopCurrentGame() {
  state.gameSession++;

  state.gameActive = false;
  state.answered = false;

  stopTimer();
  clearAnswerTimeout();

  resetAnswerButtons();
}

function exitGame() {
  if (!state.gameActive) {
    stopCurrentGame();
    showScreen("home");
    return;
  }

  if (!window.confirm(t("exitConfirm"))) {
    return;
  }

  stopCurrentGame();
  showScreen("home");
}

function returnHome() {
  stopCurrentGame();
  showScreen("home");
}

/* =========================================================
   23. EVENT LISTENERS
========================================================= */

function setupEventListeners() {
  elements.startButton?.addEventListener(
    "click",
    () => {
      playSound("click");
      openCategorySelection();
    }
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
    exitGame
  );

  elements.answerOptions?.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        ".answer-option"
      );

      if (!button || button.disabled) {
        return;
      }

      handleAnswer(button.dataset.answer);
    }
  );

  elements.playAgainButton?.addEventListener(
    "click",
    () => {
      playSound("click");

      if (state.currentCategory) {
        startGame(state.currentCategory);
      } else {
        openCategorySelection();
      }
    }
  );

  elements.homeButton?.addEventListener(
    "click",
    returnHome
  );

  $$("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      if (!CONFIG.categories.includes(category)) {
        return;
      }

      playSound("click");
      startGame(category);
    });
  });

  $$("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const screenName = normalizeScreenName(
        button.dataset.screen
      );

      if (!screenName) {
        return;
      }

      if (state.gameActive) {
        return;
      }

      playSound("click");

      if (screenName === "category") {
        openCategorySelection();
        return;
      }

      if (screenName === "home") {
        showScreen("home");
        return;
      }

      if (screenName === "leaderboard") {
        renderLeaderboard();
        showScreen("leaderboard");
      }
    });
  });
}

/* =========================================================
   24. APPLICATION INITIALIZATION
========================================================= */

function initializeApp() {
  if (!elements.app) {
    console.error(
      "TRIVION initialization failed: #app element not found."
    );

    return;
  }

  setupEventListeners();

  updateStaticLanguage();
  updateSoundLabel();
  updateStatistics();
  renderLeaderboard();

  resetAnswerButtons();

  showScreen("home");

  console.info(
    "TRIVION initialized successfully."
  );
}

/* =========================================================
   25. START APPLICATION
========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApp,
    { once: true }
  );
} else {
  initializeApp();
}

/* =========================================================
   END OF TRIVION APPLICATION
   Developed by Alpha Omega Store
   ========================================================= */
