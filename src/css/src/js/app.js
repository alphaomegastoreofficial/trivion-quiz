
"use strict";

/* =========================================================
   TRIVION — MAIN APPLICATION ENGINE
   =========================================================
   Product      : TRIVION
   Tagline      : THE ULTIMATE QUIZ EXPERIENCE
   Developer    : Alpha Omega Store
   Version      : 1.0.0

   Core Features:
   - Indonesian and English language
   - Six quiz categories
   - Difficulty-based countdown timer
   - Answer validation and scoring
   - Local player statistics
   - Top 10 leaderboard
   - Sound effects
   - Responsive screen navigation

   ========================================================= */

(() => {
  /* =======================================================
     01. GAME CONFIGURATION
  ======================================================= */

  const CONFIG = Object.freeze({
    version: "1.0.0",

    questionBank: "./data/questions.json",

    questionsPerGame: 10,

    pointsPerCorrectAnswer: 10,

    timerByDifficulty: {
      easy: 40,
      medium: 60,
      hard: 65
    },

    leaderboardLimit: 10,

    storageKey: "trivion_player_data_v1",

    feedbackDelay: 1500,

    timeoutFeedbackDelay: 1800
  });

  /* =======================================================
     02. QUIZ CATEGORIES
  ======================================================= */

  const CATEGORIES = {
    general: {
      id: "Pengetahuan Umum",
      en: "General Knowledge"
    },

    science: {
      id: "Sains dan Teknologi",
      en: "Science & Technology"
    },

    history: {
      id: "Sejarah dan Budaya",
      en: "History & Culture"
    },

    math: {
      id: "Matematika dan Logika",
      en: "Mathematics & Logic"
    },

    nature: {
      id: "Alam dan Lingkungan",
      en: "Nature & Environment"
    },

    trivia: {
      id: "Teka-teki dan Trivia",
      en: "Riddles & Trivia"
    }
  };

  const ANSWER_KEYS = ["A", "B", "C", "D"];

  /* =======================================================
     03. LANGUAGE SYSTEM
  ======================================================= */

  const TRANSLATIONS = {
    id: {
      homeTitle: "Uji Pengetahuanmu. Raih Kemenangan.",

      homeDescription:
        "Tantang dirimu, jawab pertanyaan, dan buktikan kemampuanmu bersama TRIVION.",

      start: "MULAI BERMAIN",

      categoryTitle: "Pilih Kategori",

      correct: "Benar!",

      incorrect: "Belum tepat!",

      timeUp: "Waktu habis!",

      explanation: "Penjelasan",

      gameOver: "Permainan Selesai!",

      playAgain: "MAIN LAGI",

      home: "BERANDA",

      loading: "Memuat pertanyaan...",

      loadError:
        "Soal belum dapat dimuat. Periksa file bank soal.",

      invalidQuestion:
        "Bank soal memiliki format yang tidak valid.",

      notEnough:
        "Soal dalam kategori ini belum mencukupi untuk satu permainan.",

      confirmExit:
        "Keluar dari permainan sekarang? Progres permainan ini tidak akan disimpan.",

      noScores:
        "Belum ada skor. Jadilah pemain pertama!",

      soundOn: "Suara: ON",

      soundOff: "Suara: OFF",

      language: "ID",

      explanationLabel: "Penjelasan",

      points: "poin",

      seconds: "detik",

      rank: "Peringkat",

      player: "Pemain"
    },

    en: {
      homeTitle: "Test Your Knowledge. Claim Victory.",

      homeDescription:
        "Challenge yourself, answer questions, and prove your skills with TRIVION.",

      start: "START PLAYING",

      categoryTitle: "Choose a Category",

      correct: "Correct!",

      incorrect: "Not quite!",

      timeUp: "Time is up!",

      explanation: "Explanation",

      gameOver: "Game Completed!",

      playAgain: "PLAY AGAIN",

      home: "HOME",

      loading: "Loading questions...",

      loadError:
        "Questions could not be loaded. Check the question bank file.",

      invalidQuestion:
        "The question bank has an invalid format.",

      notEnough:
        "There are not enough questions in this category for a complete game.",

      confirmExit:
        "Exit the game now? Your current game progress will not be saved.",

      noScores:
        "No scores yet. Be the first player!",

      soundOn: "Sound: ON",

      soundOff: "Sound: OFF",

      language: "EN",

      explanationLabel: "Explanation",

      points: "points",

      seconds: "seconds",

      rank: "Rank",

      player: "Player"
    }
  };

  /* =======================================================
     04. APPLICATION STATE
  ======================================================= */

  let language = "id";

  let soundEnabled = false;

  let questions = [];

  let currentQuestions = [];

  let currentQuestion = null;

  let currentQuestionIndex = 0;

  let currentCategory = null;

  let currentScore = 0;

  let correctCount = 0;

  let wrongCount = 0;

  let timeLeft = 0;

  let timerInterval = null;

  let nextQuestionTimeout = null;

  let gameActive = false;

  let answerLocked = false;

  let audioContext = null;

  let playerData = loadPlayerData();

  /* =======================================================
     05. DOM UTILITIES
  ======================================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));

  const getElement = (id) =>
    document.getElementById(id);

  function getText(key) {
    return TRANSLATIONS[language][key] || key;
  }

  function getLocalized(value) {
    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object") {
      return (
        value[language] ||
        value.id ||
        value.en ||
        ""
      );
    }

    return "";
  }

  /* =======================================================
     06. PLAYER DATA AND LOCAL STORAGE
  ======================================================= */

  function getDefaultPlayerData() {
    return {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0,
      leaderboard: []
    };
  }

  function loadPlayerData() {
    try {
      const saved = localStorage.getItem(
        CONFIG.storageKey
      );

      if (!saved) {
        return getDefaultPlayerData();
      }

      const data = JSON.parse(saved);

      return {
        totalGames: Number(data.totalGames) || 0,

        totalScore: Number(data.totalScore) || 0,

        bestScore: Number(data.bestScore) || 0,

        leaderboard: Array.isArray(data.leaderboard)
          ? data.leaderboard
          : []
      };

    } catch (error) {
      console.error(
        "TRIVION storage error:",
        error
      );

      return getDefaultPlayerData();
    }
  }

  function savePlayerData() {
    try {
      localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(playerData)
      );

      return true;

    } catch (error) {
      console.error(
        "Unable to save TRIVION data:",
        error
      );

      return false;
    }
  }

  function updatePlayerStatistics() {
    const totalScore = getElement("total-score");

    const totalGames = getElement("total-games");

    const bestScore = getElement("best-score");

    if (totalScore) {
      totalScore.textContent =
        playerData.totalScore;
    }

    if (totalGames) {
      totalGames.textContent =
        playerData.totalGames;
    }

    if (bestScore) {
      bestScore.textContent =
        playerData.bestScore;
    }
  }

  /* =======================================================
     07. SCREEN NAVIGATION
  ======================================================= */

  function showScreen(screenId) {
    const screens = $$(".screen");

    screens.forEach((screen) => {
      const isActive =
        screen.id === screenId;

      screen.classList.toggle(
        "active",
        isActive
      );

      screen.hidden = !isActive;
    });

    $$("[data-screen]").forEach((button) => {
      const isActive =
        button.dataset.screen === screenId;

      button.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {
        button.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        button.removeAttribute(
          "aria-current"
        );
      }
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =======================================================
     08. QUESTION BANK VALIDATION
  ======================================================= */

  function validateQuestion(question) {
    if (
      !question ||
      typeof question !== "object"
    ) {
      return false;
    }

    if (
      typeof question.id !== "string" ||
      !question.id.trim()
    ) {
      return false;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        CATEGORIES,
        question.category
      )
    ) {
      return false;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        CONFIG.timerByDifficulty,
        question.difficulty
      )
    ) {
      return false;
    }

    if (
      !question.question ||
      typeof question.question !== "object"
    ) {
      return false;
    }

    if (
      typeof question.question.id !== "string" ||
      typeof question.question.en !== "string"
    ) {
      return false;
    }

    if (
      !question.options ||
      typeof question.options !== "object"
    ) {
      return false;
    }

    if (
      !ANSWER_KEYS.includes(question.answer)
    ) {
      return false;
    }

    return ANSWER_KEYS.every((key) => {
      const option = question.options[key];

      return (
        option &&
        typeof option.id === "string" &&
        typeof option.en === "string"
      );
    });
  }

  async function loadQuestions() {
    if (questions.length > 0) {
      return questions;
    }

    const response = await fetch(
      CONFIG.questionBank,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Question bank could not be loaded."
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Question bank must be an array."
      );
    }

    const validQuestions =
      data.filter(validateQuestion);

    if (validQuestions.length === 0) {
      throw new Error(
        "No valid questions found."
      );
    }

    questions = validQuestions;

    return questions;
  }

  /* =======================================================
     09. RANDOM QUESTION SELECTION
  ======================================================= */

  function shuffleArray(array) {
    const result = [...array];

    for (
      let index = result.length - 1;
      index > 0;
      index--
    ) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1)
      );

      [
        result[index],
        result[randomIndex]
      ] = [
        result[randomIndex],
        result[index]
      ];
    }

    return result;
  }

  /* =======================================================
     10. START GAME
  ======================================================= */

  async function startGame(category) {
    if (!CATEGORIES[category]) {
      return;
    }

    stopTimer();

    clearTimeout(nextQuestionTimeout);

    currentCategory = category;

    gameActive = false;

    showScreen("game-screen");

    const questionText =
      getElement("question-text");

    if (questionText) {
      questionText.textContent =
        getText("loading");
    }

    try {
      await loadQuestions();

      const categoryQuestions =
        questions.filter(
          (question) =>
            question.category === category
        );

      if (
        categoryQuestions.length <
        CONFIG.questionsPerGame
      ) {
        alert(getText("notEnough"));

        showScreen("category-screen");

        return;
      }

      currentQuestions = shuffleArray(
        categoryQuestions
      ).slice(
        0,
        CONFIG.questionsPerGame
      );

      currentQuestionIndex = 0;

      currentScore = 0;

      correctCount = 0;

      wrongCount = 0;

      answerLocked = false;

      gameActive = true;

      renderQuestion();

    } catch (error) {
      console.error(
        "TRIVION loading error:",
        error
      );

      alert(getText("loadError"));

      showScreen("category-screen");
    }
  }

  /* =======================================================
     11. RENDER QUESTION
  ======================================================= */

  function renderQuestion() {
    if (!gameActive) {
      return;
    }

    if (
      currentQuestionIndex >=
      currentQuestions.length
    ) {
      finishGame();

      return;
    }

    stopTimer();

    clearTimeout(nextQuestionTimeout);

    answerLocked = false;

    currentQuestion =
      currentQuestions[currentQuestionIndex];

    const questionNumber =
      currentQuestionIndex + 1;

    const counter =
      getElement("question-counter");

    const progress =
      getElement("question-progress");

    const score =
      getElement("current-score");

    const category =
      getElement("current-category");

    const questionText =
      getElement("question-text");

    const feedback =
      getElement("answer-feedback");

    if (counter) {
      counter.textContent =
        `${questionNumber}/${CONFIG.questionsPerGame}`;
    }

    if (progress) {
      const percentage =
        (questionNumber /
          CONFIG.questionsPerGame) * 100;

      progress.style.width =
        `${percentage}%`;

      progress.setAttribute(
        "aria-valuenow",
        String(questionNumber)
      );
    }

    if (score) {
      score.textContent = currentScore;
    }

    if (category) {
      category.textContent =
        getLocalized(
          CATEGORIES[currentCategory]
        );
    }

    if (questionText) {
      questionText.textContent =
        getLocalized(
          currentQuestion.question
        );
    }

    if (feedback) {
      feedback.textContent = "";

      feedback.className = "";

      feedback.hidden = true;
    }

    renderAnswerOptions();

    const seconds =
      CONFIG.timerByDifficulty[
        currentQuestion.difficulty
      ];

    startTimer(seconds);
  }

  /* =======================================================
     12. ANSWER OPTIONS
  ======================================================= */

  function renderAnswerOptions() {
    const buttons = $$(
      ".answer-option[data-answer]"
    );

    buttons.forEach((button) => {
      const answerKey =
        button.dataset.answer;

      const answerText =
        button.querySelector(
          ".answer-text"
        );

      const answerValue =
        currentQuestion.options[answerKey];

      const localizedAnswer =
        getLocalized(answerValue);

      if (answerText) {
        answerText.textContent =
          localizedAnswer;
      } else {
        button.textContent =
          localizedAnswer;
      }

      button.disabled = false;

      button.classList.remove(
        "correct",
        "incorrect",
        "selected"
      );

      button.setAttribute(
        "aria-pressed",
        "false"
      );
    });
  }

  /* =======================================================
     13. COUNTDOWN TIMER
  ======================================================= */

  function startTimer(seconds) {
    stopTimer();

    timeLeft = seconds;

    updateTimerDisplay();

    timerInterval = window.setInterval(() => {
      if (
        !gameActive ||
        answerLocked
      ) {
        stopTimer();

        return;
      }

      timeLeft--;

      updateTimerDisplay();

      if (timeLeft <= 0) {
        stopTimer();

        handleTimeUp();
      }

    }, 1000);
  }

  function updateTimerDisplay() {
    const display =
      getElement("timer-display");

    if (!display) {
      return;
    }

    display.textContent =
      `${timeLeft}s`;

    display.classList.toggle(
      "timer-warning",
      timeLeft <= 10
    );

    display.classList.toggle(
      "timer-danger",
      timeLeft <= 5
    );

    display.setAttribute(
      "aria-label",
      `${timeLeft} seconds remaining`
    );
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);

      timerInterval = null;
    }
  }

  /* =======================================================
     14. ANSWER VALIDATION AND SCORING
  ======================================================= */

  function handleAnswer(selectedAnswer) {
    if (
      !gameActive ||
      answerLocked ||
      !ANSWER_KEYS.includes(selectedAnswer)
    ) {
      return;
    }

    answerLocked = true;

    stopTimer();

    const isCorrect =
      selectedAnswer === currentQuestion.answer;

    if (isCorrect) {
      currentScore +=
        CONFIG.pointsPerCorrectAnswer;

      correctCount++;

      playSound("correct");

    } else {
      wrongCount++;

      playSound("incorrect");
    }

    updateAnswerButtons(selectedAnswer);

    showAnswerFeedback(isCorrect);

    const scoreElement =
      getElement("current-score");

    if (scoreElement) {
      scoreElement.textContent =
        currentScore;
    }

    nextQuestionTimeout =
      window.setTimeout(() => {
        currentQuestionIndex++;

        renderQuestion();

      }, CONFIG.feedbackDelay);
  }

  function updateAnswerButtons(selectedAnswer) {
    const buttons = $$(
      ".answer-option[data-answer]"
    );

    buttons.forEach((button) => {
      const key = button.dataset.answer;

      button.disabled = true;

      if (
        key === currentQuestion.answer
      ) {
        button.classList.add("correct");
      }

      if (
        key === selectedAnswer &&
        selectedAnswer !== currentQuestion.answer
      ) {
        button.classList.add("incorrect");
      }

      button.setAttribute(
        "aria-pressed",
        String(key === selectedAnswer)
      );
    });
  }

  function showAnswerFeedback(isCorrect) {
    const feedback =
      getElement("answer-feedback");

    if (!feedback) {
      return;
    }

    const message = isCorrect
      ? getText("correct")
      : getText("incorrect");

    const explanation =
      getLocalized(
        currentQuestion.explanation
      );

    feedback.textContent = explanation
      ? `${message} ${getText("explanationLabel")}: ${explanation}`
      : message;

    feedback.className = isCorrect
      ? "feedback-correct"
      : "feedback-incorrect";

    feedback.hidden = false;
  }

  /* =======================================================
     15. TIMEOUT HANDLING
  ======================================================= */

  function handleTimeUp() {
    if (
      !gameActive ||
      answerLocked
    ) {
      return;
    }

    answerLocked = true;

    wrongCount++;

    const buttons = $$(
      ".answer-option[data-answer]"
    );

    buttons.forEach((button) => {
      button.disabled = true;

      if (
        button.dataset.answer ===
        currentQuestion.answer
      ) {
        button.classList.add("correct");
      }
    });

    const feedback =
      getElement("answer-feedback");

    if (feedback) {
      const explanation =
        getLocalized(
          currentQuestion.explanation
        );

      feedback.textContent = explanation
        ? `${getText("timeUp")} ${getText("explanationLabel")}: ${explanation}`
        : getText("timeUp");

      feedback.className =
        "feedback-incorrect";

      feedback.hidden = false;
    }

    playSound("timeout");

    nextQuestionTimeout =
      window.setTimeout(() => {
        currentQuestionIndex++;

        renderQuestion();

      }, CONFIG.timeoutFeedbackDelay);
  }

  /* =======================================================
     16. FINISH GAME
  ======================================================= */

  function finishGame() {
    stopTimer();

    clearTimeout(nextQuestionTimeout);

    gameActive = false;

    answerLocked = true;

    const totalQuestions =
      currentQuestions.length;

    const accuracy =
      totalQuestions > 0
        ? Math.round(
            (correctCount / totalQuestions) * 100
          )
        : 0;

    playerData.totalGames++;

    playerData.totalScore +=
      currentScore;

    playerData.bestScore = Math.max(
      playerData.bestScore,
      currentScore
    );

    playerData.leaderboard.push({
      score: currentScore,

      correct: correctCount,

      wrong: wrongCount,

      accuracy,

      category: currentCategory,

      date: new Date().toISOString()
    });

    playerData.leaderboard.sort(
      (a, b) => b.score - a.score
    );

    playerData.leaderboard =
      playerData.leaderboard.slice(
        0,
        CONFIG.leaderboardLimit
      );

    savePlayerData();

    updatePlayerStatistics();

    renderResults(accuracy);

    showScreen("result-screen");

    playSound("complete");
  }

  /* =======================================================
     17. RESULT SCREEN
  ======================================================= */

  function renderResults(accuracy) {
    const title =
      getElement("result-title");

    const score =
      getElement("final-score");

    const correct =
      getElement("correct-answers");

    const wrong =
      getElement("wrong-answers");

    const accuracyElement =
      getElement("accuracy-rate");

    if (title) {
      title.textContent =
        getText("gameOver");
    }

    if (score) {
      score.textContent =
        currentScore;
    }

    if (correct) {
      correct.textContent =
        correctCount;
    }

    if (wrong) {
      wrong.textContent =
        wrongCount;
    }

    if (accuracyElement) {
      accuracyElement.textContent =
        `${accuracy}%`;
    }
  }

  /* =======================================================
     18. LEADERBOARD
  ======================================================= */

  function renderLeaderboard() {
    const list =
      getElement("leaderboard-list");

    if (!list) {
      return;
    }

    list.replaceChildren();

    if (
      playerData.leaderboard.length === 0
    ) {
      const emptyMessage =
        document.createElement("p");

      emptyMessage.textContent =
        getText("noScores");

      list.appendChild(emptyMessage);

      return;
    }

    playerData.leaderboard.forEach(
      (entry, index) => {
        const item =
          document.createElement("div");

        item.className =
          "leaderboard-entry";

        const rank =
          document.createElement("span");

        rank.className =
          "leaderboard-rank";

        rank.textContent =
          `#${index + 1}`;

        const category =
          document.createElement("span");

        category.className =
          "leaderboard-category";

        category.textContent =
          getLocalized(
            CATEGORIES[entry.category]
          ) || entry.category;

        const score =
          document.createElement("strong");

        score.className =
          "leaderboard-score";

        score.textContent =
          `${entry.score} pts`;

        item.append(
          rank,
          category,
          score
        );

        list.appendChild(item);
      }
    );
  }

  /* =======================================================
     19. LANGUAGE UPDATE
  ======================================================= */

  function updateLanguage() {
    const languageLabel =
      getElement("language-label");

    const soundLabel =
      getElement("sound-label");

    if (languageLabel) {
      languageLabel.textContent =
        getText("language");
    }

    if (soundLabel) {
      soundLabel.textContent =
        soundEnabled
          ? getText("soundOn")
          : getText("soundOff");
    }

    const homeTitle =
      getElement("home-title");

    const homeDescription =
      getElement("home-description");

    const startButtonLabel =
      getElement("start-button-label");

    const categoryTitle =
      getElement("category-title");

    if (homeTitle) {
      homeTitle.textContent =
        getText("homeTitle");
    }

    if (homeDescription) {
      homeDescription.textContent =
        getText("homeDescription");
    }

    if (startButtonLabel) {
      startButtonLabel.textContent =
        getText("start");
    }

    if (categoryTitle) {
      categoryTitle.textContent =
        getText("categoryTitle");
    }

    $$("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;

      if (
        TRANSLATIONS[language][key]
      ) {
        element.textContent =
          TRANSLATIONS[language][key];
      }
    });

    updatePlayerStatistics();

    if (
      gameActive &&
      currentQuestion
    ) {
      renderQuestion();
    }

    if (
      $("#result-screen")?.classList.contains("active")
    ) {
      const total =
        currentQuestions.length;

      const accuracy =
        total > 0
          ? Math.round(
              (correctCount / total) * 100
            )
          : 0;

      renderResults(accuracy);
    }

    if (
      $("#leaderboard-screen")?.classList.contains("active")
    ) {
      renderLeaderboard();
    }
  }

  function toggleLanguage() {
    language =
      language === "id"
        ? "en"
        : "id";

    updateLanguage();
  }

  /* =======================================================
     20. SOUND EFFECT SYSTEM
  ======================================================= */

  function playSound(type) {
    if (!soundEnabled) {
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
        audioContext =
          new AudioContextClass();
      }

      if (
        audioContext.state === "suspended"
      ) {
        audioContext.resume();
      }

      const sounds = {
        correct: [660, 880],

        incorrect: [300, 220],

        timeout: [220],

        complete: [523, 659, 784]
      };

      const frequencies =
        sounds[type];

      if (!frequencies) {
        return;
      }

      frequencies.forEach(
        (frequency, index) => {
          const oscillator =
            audioContext.createOscillator();

          const gain =
            audioContext.createGain();

          const startTime =
            audioContext.currentTime +
            index * 0.12;

          oscillator.type = "sine";

          oscillator.frequency.value =
            frequency;

          gain.gain.setValueAtTime(
            0.0001,
            startTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.12,
            startTime + 0.02
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            startTime + 0.18
          );

          oscillator.connect(gain);

          gain.connect(
            audioContext.destination
          );

          oscillator.start(startTime);

          oscillator.stop(
            startTime + 0.2
          );
        }
      );

    } catch (error) {
      console.warn(
        "TRIVION sound unavailable:",
        error
      );
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;

    const soundLabel =
      getElement("sound-label");

    if (soundLabel) {
      soundLabel.textContent =
        soundEnabled
          ? getText("soundOn")
          : getText("soundOff");
    }

    if (soundEnabled) {
      playSound("correct");
    }
  }

  /* =======================================================
     21. EVENT LISTENERS
  ======================================================= */

  function setupEventListeners() {

    /* START BUTTON */

    const startButton =
      getElement("start-button");

    if (startButton) {
      startButton.addEventListener(
        "click",
        () => {
          showScreen("category-screen");
        }
      );
    }

    /* LANGUAGE BUTTON */

    const languageButton =
      getElement("language-button");

    if (languageButton) {
      languageButton.addEventListener(
        "click",
        toggleLanguage
      );
    }

    /* SOUND BUTTON */

    const soundButton =
      getElement("sound-button");

    if (soundButton) {
      soundButton.addEventListener(
        "click",
        toggleSound
      );
    }

    /* CATEGORY SELECTION */

    const categoryList =
      getElement("category-list");

    if (categoryList) {
      categoryList.addEventListener(
        "click",
        (event) => {
          const button =
            event.target.closest(
              "[data-category]"
            );

          if (
            !button ||
            !categoryList.contains(button)
          ) {
            return;
          }

          startGame(
            button.dataset.category
          );
        }
      );
    }

    /* ANSWER BUTTONS */

    $$(".answer-option[data-answer]").forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            handleAnswer(
              button.dataset.answer
            );
          }
        );
      }
    );

    /* PLAY AGAIN */

    const playAgainButton =
      getElement("play-again-button");

    if (playAgainButton) {
      playAgainButton.addEventListener(
        "click",
        () => {
          if (currentCategory) {
            startGame(currentCategory);
          } else {
            showScreen("category-screen");
          }
        }
      );
    }

    /* HOME BUTTON */

    const homeButton =
      getElement("home-button");

    if (homeButton) {
      homeButton.addEventListener(
        "click",
        () => {
          showScreen("home-screen");
        }
      );
    }

    /* EXIT GAME */

    const exitButton =
      getElement("exit-game-button");

    if (exitButton) {
      exitButton.addEventListener(
        "click",
        () => {
          if (!gameActive) {
            showScreen("category-screen");

            return;
          }

          if (
            window.confirm(
              getText("confirmExit")
            )
          ) {
            stopTimer();

            clearTimeout(
              nextQuestionTimeout
            );

            gameActive = false;

            showScreen("category-screen");
          }
        }
      );
    }

    /* BOTTOM NAVIGATION */

    $$("[data-screen]").forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const target =
              button.dataset.screen;

            if (!target) {
              return;
            }

            if (
              target === "leaderboard-screen"
            ) {
              renderLeaderboard();
            }

            const allowedScreens = [
              "home-screen",
              "category-screen",
              "leaderboard-screen"
            ];

            if (
              !allowedScreens.includes(target)
            ) {
              return;
            }

            if (
              gameActive &&
              target !== "home-screen"
            ) {
              return;
            }

            showScreen(target);
          }
        );
    );
  }

  /* =======================================================
     22. APPLICATION INITIALIZATION
  ======================================================= */

  function initializeApp() {
    setupEventListeners();

    updatePlayerStatistics();

    updateLanguage();

    showScreen("home-screen");

    console.log(
      `TRIVION v${CONFIG.version} — Application initialized.`
    );
  }

  /* =======================================================
     23. START APPLICATION
  ======================================================= */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApp
    );
  } else {
    initializeApp();
  }

})();
