/* -------------------------------------------------------------
 * Application Logic: VocabVibe - Premium Vocabulary Learning Hub
 * Author: Antigravity AI
 * Features: State Management, Dictionary API, Dynamic Quiz,
 *           3D Flashcards, Confetti Canvas & Persistence.
 * ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Application State & Local Storage Setup
  // ==========================================
  
  let state = {
    activeTab: "dashboard-tab",
    username: "Scholar",
    stats: {
      lookups: 0,
      quizzesPlayed: 0,
      correctAnswers: 0,
      totalQuestionsPlayed: 0,
      streak: 1,
      lastActiveDate: null
    },
    favorites: [],
    recentLookups: [],
    currentWotd: null,
    
    // Quiz State
    quiz: {
      questions: [],
      currentIndex: 0,
      score: 0,
      selectedOptionIndex: null,
      isAnswered: false
    },
    
    // Flashcard State
    flashcards: {
      deck: [],
      currentIndex: 0,
      masteredCount: 0,
      totalCount: 0
    }
  };

  // Theme management functions
  function setTheme(themeName) {
    const themes = [
      "theme-rutgers-scarlet",
      "theme-cosmic-dark",
      "theme-sunset-glow",
      "theme-aurora-wave",
      "theme-cyberpunk-neon",
      "theme-solar-light",
      "light-theme",
      "dark-theme"
    ];
    themes.forEach(t => document.body.classList.remove(t));

    document.body.classList.add(themeName);

    if (themeName === "theme-solar-light" || themeName === "light-theme") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.add("dark-theme");
    }

    localStorage.setItem("vocab_theme", themeName);
    updateThemeUI(themeName);
  }

  function updateThemeUI(themeName) {
    const triggerText = document.querySelector(".active-theme-name");
    if (triggerText) {
      const themeLabels = {
        "theme-rutgers-scarlet": "Rutgers Scarlet",
        "theme-cosmic-dark": "Crimson Dark",
        "theme-sunset-glow": "Sunset Glow",
        "theme-aurora-wave": "Aurora Mint",
        "theme-cyberpunk-neon": "Cyberpunk",
        "theme-solar-light": "Solar Light"
      };
      triggerText.textContent = themeLabels[themeName] || "Rutgers Scarlet";
    }

    const options = document.querySelectorAll(".theme-option");
    options.forEach(opt => {
      const optTheme = opt.getAttribute("data-theme");
      if (optTheme === themeName) {
        opt.classList.add("active");
        const check = opt.querySelector(".check-icon");
        if (check) check.style.display = "block";
      } else {
        opt.classList.remove("active");
        const check = opt.querySelector(".check-icon");
        if (check) check.style.display = "none";
      }
    });
  }

  // Load state from Local Storage
  function loadStateFromLocalStorage() {
    const savedUsername = localStorage.getItem("vocab_username");
    if (savedUsername) state.username = savedUsername;

    const savedStats = localStorage.getItem("vocab_stats");
    if (savedStats) {
      state.stats = JSON.parse(savedStats);
      // Clean undefined fields in older saves
      if (state.stats.totalQuestionsPlayed === undefined) {
        state.stats.totalQuestionsPlayed = state.stats.quizzesPlayed * 5;
      }
    }

    const savedFavorites = localStorage.getItem("vocab_favorites");
    if (savedFavorites) state.favorites = JSON.parse(savedFavorites);

    const savedRecentLookups = localStorage.getItem("vocab_recent_lookups");
    if (savedRecentLookups) state.recentLookups = JSON.parse(savedRecentLookups);

    // Maintain Theme preference
    const savedTheme = localStorage.getItem("vocab_theme") || "theme-rutgers-scarlet";
    if (savedTheme === "light" || savedTheme === "light-theme") {
      setTheme("theme-solar-light");
    } else if (savedTheme === "dark" || savedTheme === "dark-theme") {
      setTheme("theme-rutgers-scarlet");
    } else {
      setTheme(savedTheme);
    }

    // Maintain Mode (Light/Dark) preference
    const savedMode = localStorage.getItem("vocab_mode") || "dark";
    if (savedMode === "light") {
      document.body.classList.add("mode-light");
      updateModeUI("light");
    } else {
      document.body.classList.remove("mode-light");
      updateModeUI("dark");
    }

    calculateStreak();
  }

  // Save state back to Local Storage
  function saveStateToLocalStorage() {
    localStorage.setItem("vocab_username", state.username);
    localStorage.setItem("vocab_stats", JSON.stringify(state.stats));
    localStorage.setItem("vocab_favorites", JSON.stringify(state.favorites));
    localStorage.setItem("vocab_recent_lookups", JSON.stringify(state.recentLookups));
  }

  // Streak logic
  function calculateStreak() {
    const todayStr = new Date().toDateString();
    const lastActive = state.stats.lastActiveDate;

    if (!lastActive) {
      state.stats.streak = 1;
      state.stats.lastActiveDate = todayStr;
    } else if (lastActive !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastActive === yesterdayStr) {
        state.stats.streak += 1;
      } else {
        // Broke the streak
        state.stats.streak = 1;
      }
      state.stats.lastActiveDate = todayStr;
    }
    saveStateToLocalStorage();
  }

  // DOM Elements Caching
  const els = {
    // Nav links
    navDashboard: document.getElementById("nav-dashboard"),
    navDictionary: document.getElementById("nav-dictionary"),
    navPractice: document.getElementById("nav-practice"),
    logoBtn: document.getElementById("logo-btn"),
    themeToggle: document.getElementById("theme-toggle"),
    
    // Tab Contents
    tabs: document.querySelectorAll(".tab-content"),
    navLinks: document.querySelectorAll(".nav-link"),
    
    // Dashboard Panel
    usernameDisplay: document.getElementById("username-display"),
    streakCountVal: document.getElementById("streak-count-val"),
    statsLookups: document.getElementById("stats-lookups"),
    statsQuestions: document.getElementById("stats-questions"),
    statsAccuracy: document.getElementById("stats-accuracy"),
    statsLevel: document.getElementById("stats-level"),
    favoritesList: document.getElementById("favorites-list"),
    favoritesCount: document.getElementById("favorites-count"),
    recentsList: document.getElementById("recents-list"),
    clearRecentsBtn: document.getElementById("clear-recents-btn"),
    
    // Word of the Day Card
    wotdFavBtn: document.getElementById("wotd-fav-btn"),
    wotdHeartIcon: document.querySelector(".wotd-heart-icon"),
    wotdWordText: document.getElementById("wotd-word-text"),
    wotdWordPos: document.getElementById("wotd-word-pos"),
    wotdWordDef: document.getElementById("wotd-word-def"),
    wotdWordExample: document.getElementById("wotd-word-example"),
    wotdSearchBtn: document.getElementById("wotd-search-btn"),
    
    // Dictionary Tab
    dictionarySearchForm: document.getElementById("dictionary-search-form"),
    dictionarySearchInput: document.getElementById("dictionary-search-input"),
    searchClearBtn: document.getElementById("search-clear-btn"),
    suggestionsChipsContainer: document.getElementById("suggestions-chips-container"),
    dictLoading: document.getElementById("dict-loading"),
    dictError: document.getElementById("dict-error"),
    dictErrorMsg: document.getElementById("dict-error-msg"),
    errorSuggestChips: document.getElementById("error-suggest-chips"),
    dictResults: document.getElementById("dict-results"),
    resultsWordText: document.getElementById("results-word-text"),
    resultsFavBtn: document.getElementById("results-fav-btn"),
    resultsHeartIcon: document.querySelector(".results-heart-icon"),
    resultsPhonetic: document.getElementById("results-phonetic"),
    resultsPronounceBtn: document.getElementById("results-pronounce-btn"),
    phoneticAudio: document.getElementById("phonetic-audio"),
    resultsCopyBtn: document.getElementById("results-copy-btn"),
    resultsMeaningsContainer: document.getElementById("results-meanings-container"),
    
    // Practice Sidebar / Modes Tab Routing
    modeQuizBtn: document.getElementById("mode-quiz-btn"),
    modeFlashcardsBtn: document.getElementById("mode-flashcards-btn"),
    quizPanel: document.getElementById("quiz-panel"),
    flashcardsPanel: document.getElementById("flashcards-panel"),
    
    // Quiz Mode Views
    quizStateStart: document.getElementById("quiz-state-start"),
    quizStatePlay: document.getElementById("quiz-state-play"),
    quizStateEnd: document.getElementById("quiz-state-end"),
    quizStartActionBtn: document.getElementById("quiz-start-action-btn"),
    
    // Active Quiz Card
    quizQCurrent: document.getElementById("quiz-q-current"),
    quizQTotal: document.getElementById("quiz-q-total"),
    quizScoreVal: document.getElementById("quiz-score-val"),
    quizProgressFill: document.getElementById("quiz-progress-fill"),
    quizQuestionType: document.getElementById("quiz-question-type"),
    quizQuestionTextVal: document.getElementById("quiz-question-text-val"),
    quizOptionsContainer: document.getElementById("quiz-options-container"),
    quizExplanation: document.getElementById("quiz-explanation"),
    quizExplanationHeader: document.getElementById("quiz-explanation-header"),
    quizExplanationTitle: document.getElementById("quiz-explanation-title"),
    explWordText: document.getElementById("expl-word-text"),
    explWordPos: document.getElementById("expl-word-pos"),
    explWordDef: document.getElementById("expl-word-def"),
    explWordExample: document.getElementById("expl-word-example"),
    quizQuitBtn: document.getElementById("quiz-quit-btn"),
    quizNextBtn: document.getElementById("quiz-next-btn"),
    
    // Quiz End Summary Card
    quizScoreCircle: document.getElementById("quiz-score-circle"),
    quizFinalPercent: document.getElementById("quiz-final-percent"),
    quizFinalFraction: document.getElementById("quiz-final-fraction"),
    quizEndTitle: document.getElementById("quiz-end-title"),
    quizEndSubtitle: document.getElementById("quiz-end-subtitle"),
    quizReviewList: document.getElementById("quiz-review-list"),
    quizEndDashboardBtn: document.getElementById("quiz-end-dashboard-btn"),
    quizRetryBtn: document.getElementById("quiz-retry-btn"),
    
    // Flashcard Scene
    flashcardTriggerArea: document.getElementById("flashcard-trigger-area"),
    flashcardElement: document.getElementById("flashcard-element"),
    flashcardDeckIndicator: document.getElementById("flashcard-deck-indicator"),
    flashcardProgressFill: document.getElementById("flashcard-progress-fill"),
    flashcardResetDeck: document.getElementById("flashcard-reset-deck"),
    fcFrontPos: document.getElementById("fc-front-pos"),
    fcFrontWord: document.getElementById("fc-front-word"),
    fcFrontPhonetic: document.getElementById("fc-front-phonetic"),
    fcBackPos: document.getElementById("fc-back-pos"),
    fcBackWord: document.getElementById("fc-back-word"),
    fcBackDefinition: document.getElementById("fc-back-definition"),
    fcBackExample: document.getElementById("fc-back-example"),
    fcBackSyns: document.getElementById("fc-back-syns"),
    fcBackAnts: document.getElementById("fc-back-ants"),
    fcMasteredCount: document.getElementById("fc-mastered-count"),
    fcActionFail: document.getElementById("fc-action-fail"),
    fcActionSuccess: document.getElementById("fc-action-success"),
    flashcardCompleteState: document.getElementById("flashcard-complete-state"),
    fcFinalMastered: document.getElementById("fc-final-mastered"),
    fcFinalTotal: document.getElementById("fc-final-total"),
    fcRestartDeckBtn: document.getElementById("fc-restart-deck-btn"),
    
    // Extras
    confettiCanvas: document.getElementById("confetti-canvas"),
    toastMessage: document.getElementById("toast-message")
  };


  // ==========================================
  // 2. Application Core Router
  // ==========================================
  
  function switchTab(tabId) {
    state.activeTab = tabId;
    
    els.tabs.forEach(tab => {
      tab.classList.remove("active");
    });
    
    els.navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-target") === tabId) {
        link.classList.add("active");
      }
    });
    
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }

    // Scroll to top of tab view
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Specialize tab re-initializations
    if (tabId === "dashboard-tab") {
      updateDashboardUI();
    } else if (tabId === "dictionary-tab") {
      populateSuggestions();
    } else if (tabId === "practice-tab") {
      // Default practice to Active mode
      if (els.quizPanel.classList.contains("active")) {
        // Quiz is active
      } else if (els.flashcardsPanel.classList.contains("active")) {
        // Flashcard is active
      } else {
        switchPracticeMode("quiz");
      }
    }
  }

  // Bind main navigation clicks
  els.navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const tabTarget = link.getAttribute("data-target");
      switchTab(tabTarget);
    });
  });

  els.logoBtn.addEventListener("click", () => {
    switchTab("dashboard-tab");
  });

  // Theme Selector Dropdown Logic
  const themeSelectorContainer = document.querySelector(".theme-selector-container");
  if (els.themeToggle && themeSelectorContainer) {
    els.themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      themeSelectorContainer.classList.toggle("open");
    });

    // Close dropdown on click outside
    document.addEventListener("click", () => {
      themeSelectorContainer.classList.remove("open");
    });

    // Theme option clicks
    const options = document.querySelectorAll(".theme-option");
    options.forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedTheme = opt.getAttribute("data-theme");
        setTheme(selectedTheme);
        themeSelectorContainer.classList.remove("open");
      });
    });
  }

  // Light/Dark Mode Toggle Event Bindings
  const modeToggleBtn = document.getElementById("mode-toggle-btn");
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("mode-light");
      if (isLight) {
        document.body.classList.remove("mode-light");
        localStorage.setItem("vocab_mode", "dark");
        updateModeUI("dark");
      } else {
        document.body.classList.add("mode-light");
        localStorage.setItem("vocab_mode", "light");
        updateModeUI("light");
      }
    });
  }

  function updateModeUI(mode) {
    const sunIcon = document.querySelector(".mode-sun-icon");
    const moonIcon = document.querySelector(".mode-moon-icon");
    if (sunIcon && moonIcon) {
      if (mode === "light") {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      } else {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      }
    }
  }


  // ==========================================
  // 3. Welcome Banner & Stats Calculation
  // ==========================================

  function getVocabularyLevel(lookups, quizzes, accuracy) {
    const isRutgers = document.body.classList.contains("theme-rutgers-scarlet");
    const totalPoints = lookups * 2 + quizzes * 10 + (accuracy >= 80 ? 25 : 0);
    
    if (isRutgers) {
      if (totalPoints > 200) return "Knight Commander";
      if (totalPoints > 100) return "Scarlet Knight";
      if (totalPoints > 40) return "Squire";
      if (totalPoints > 10) return "Page";
      return "Novice Recruit";
    }
    
    if (totalPoints > 200) return "Lexicographer";
    if (totalPoints > 100) return "Word Master";
    if (totalPoints > 40) return "Scholar";
    if (totalPoints > 10) return "Wordsmith";
    return "Novice";
  }

  function updateDashboardUI() {
    // Username Display with direct change capability
    els.usernameDisplay.innerText = state.username;
    
    // Bind click to change username directly
    els.usernameDisplay.onclick = () => {
      const inputName = prompt("Enter your custom Scholar name:", state.username);
      if (inputName && inputName.trim().length > 0) {
        state.username = inputName.trim();
        els.usernameDisplay.innerText = state.username;
        saveStateToLocalStorage();
        showToast(`Welcome, ${state.username}! Name updated successfully.`);
      }
    };

    els.streakCountVal.innerText = state.stats.streak;
    els.statsLookups.innerText = state.stats.lookups;
    els.statsQuestions.innerText = state.stats.quizzesPlayed;

    // Accuracy Calculation
    let accuracy = 0;
    if (state.stats.totalQuestionsPlayed > 0) {
      accuracy = Math.round((state.stats.correctAnswers / state.stats.totalQuestionsPlayed) * 100);
    }
    els.statsAccuracy.innerText = accuracy + "%";

    // Vocabulary Level / Knight's Rank
    const levelStr = getVocabularyLevel(state.stats.lookups, state.stats.quizzesPlayed, accuracy);
    els.statsLevel.innerText = levelStr;

    // Dynamically rename the stat card label for Rutgers Theme
    const levelLabel = document.querySelector(".icon-gold + .stat-data .stat-label");
    if (levelLabel) {
      if (document.body.classList.contains("theme-rutgers-scarlet")) {
        levelLabel.textContent = "Knight's Rank";
      } else {
        levelLabel.textContent = "Vocabulary Level";
      }
    }

    // Render Favorite Words scrollable list
    renderFavorites();

    // Render Recent Lookups list
    renderRecents();

    // Word of the Day Initialization
    initWordOfTheDay();
    
    lucide.createIcons();
  }

  // Sync favorites rendering
  function renderFavorites() {
    els.favoritesCount.innerText = state.favorites.length;
    els.favoritesList.innerHTML = "";

    if (state.favorites.length === 0) {
      els.favoritesList.innerHTML = `
        <div class="empty-state">
          <i data-lucide="heart" class="empty-icon"></i>
          <p>No favorite words yet. Click the heart icon on any word to save it!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    state.favorites.forEach(wordObj => {
      const item = document.createElement("div");
      item.className = "list-item";
      
      const partsOfSpeech = wordObj.type ? wordObj.type : "word";
      
      item.innerHTML = `
        <div class="list-item-word-group">
          <span class="list-item-text">${wordObj.word}</span>
          <span class="list-item-pos">${partsOfSpeech}</span>
        </div>
        <div class="list-item-actions">
          <button class="item-action-btn hover-danger remove-fav-btn" data-word="${wordObj.word}" title="Remove from favorites">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      `;

      // Search clicked word
      item.onclick = (e) => {
        if (e.target.closest(".remove-fav-btn")) return; // skip if delete button is clicked
        triggerDirectSearch(wordObj.word);
      };

      // Handle delete button
      item.querySelector(".remove-fav-btn").onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(wordObj);
        renderFavorites();
        // Update large result heart icon if that word is currently being viewed
        if (state.activeTab === "dictionary-tab" && els.resultsWordText.innerText.toLowerCase() === wordObj.word.toLowerCase()) {
          syncHeartUI(false);
        }
      };

      els.favoritesList.appendChild(item);
    });

    lucide.createIcons();
  }

  // Render recent lookup searches list
  function renderRecents() {
    els.recentsList.innerHTML = "";

    if (state.recentLookups.length === 0) {
      els.recentsList.innerHTML = `
        <div class="empty-state">
          <i data-lucide="clock" class="empty-icon"></i>
          <p>No recent lookups. Search for a word in the Dictionary to get started!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    state.recentLookups.forEach(wordStr => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div class="list-item-word-group">
          <span class="list-item-text">${wordStr}</span>
        </div>
        <div class="list-item-actions">
          <i data-lucide="chevron-right" style="width: 14px; height: 14px; opacity: 0.5;"></i>
        </div>
      `;

      item.onclick = () => {
        triggerDirectSearch(wordStr);
      };

      els.recentsList.appendChild(item);
    });

    lucide.createIcons();
  }

  // Clear recents
  els.clearRecentsBtn.onclick = () => {
    state.recentLookups = [];
    saveStateToLocalStorage();
    renderRecents();
    showToast("Recent lookup history cleared.");
  };

  // Toast notifications
  let toastTimeout = null;
  function showToast(text, isSuccess = true) {
    clearTimeout(toastTimeout);
    els.toastMessage.querySelector(".toast-text").innerText = text;
    
    const icon = els.toastMessage.querySelector(".toast-icon");
    if (isSuccess) {
      icon.setAttribute("data-lucide", "check-circle");
      els.toastMessage.style.borderColor = "var(--success)";
      els.toastMessage.style.borderLeftColor = "var(--success)";
    } else {
      icon.setAttribute("data-lucide", "alert-circle");
      els.toastMessage.style.borderColor = "var(--danger)";
      els.toastMessage.style.borderLeftColor = "var(--danger)";
    }
    
    lucide.createIcons();
    
    els.toastMessage.classList.add("active");
    toastTimeout = setTimeout(() => {
      els.toastMessage.classList.remove("active");
    }, 3200);
  }


  // ==========================================
  // 4. Word of the Day (WOTD) System
  // ==========================================

  function getWordOfTheDay() {
    // Generate persistent word index using day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const wotdIndex = dayOfYear % VOCAB_DATABASE.length;
    return VOCAB_DATABASE[wotdIndex];
  }

  function initWordOfTheDay() {
    const wotd = getWordOfTheDay();
    state.currentWotd = wotd;

    els.wotdWordText.innerText = wotd.word;
    els.wotdWordPos.innerText = wotd.type;
    els.wotdWordDef.innerText = wotd.definition;
    els.wotdWordExample.innerText = `"${wotd.example}"`;

    // Sync Heart/Fav button state
    const isSaved = state.favorites.some(f => f.word.toLowerCase() === wotd.word.toLowerCase());
    if (isSaved) {
      els.wotdFavBtn.classList.add("active");
      els.wotdHeartIcon.style.fill = "var(--danger)";
    } else {
      els.wotdFavBtn.classList.remove("active");
      els.wotdHeartIcon.style.fill = "none";
    }
  }

  // WOTD Favorite Button click trigger
  els.wotdFavBtn.addEventListener("click", () => {
    if (state.currentWotd) {
      const isSaved = toggleFavorite(state.currentWotd);
      if (isSaved) {
        els.wotdFavBtn.classList.add("active");
        els.wotdHeartIcon.style.fill = "var(--danger)";
      } else {
        els.wotdFavBtn.classList.remove("active");
        els.wotdHeartIcon.style.fill = "none";
      }
      renderFavorites();
    }
  });

  els.wotdSearchBtn.addEventListener("click", () => {
    if (state.currentWotd) {
      triggerDirectSearch(state.currentWotd.word);
    }
  });


  // ==========================================
  // 5. Dictionary Lookup Controller
  // ==========================================

  // Populate suggestion chips underneath search bar
  function populateSuggestions() {
    els.suggestionsChipsContainer.innerHTML = "";
    
    // Choose 4 random words from VOCAB_DATABASE
    const shuffled = [...VOCAB_DATABASE].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 4);

    selection.forEach(wordObj => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerText = wordObj.word;
      chip.onclick = () => {
        triggerDirectSearch(wordObj.word);
      };
      els.suggestionsChipsContainer.appendChild(chip);
    });
  }

  // Search input and submission
  els.dictionarySearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = els.dictionarySearchInput.value.trim().toLowerCase();
    if (query.length > 0) {
      searchWord(query);
    }
  });

  els.dictionarySearchInput.addEventListener("input", () => {
    if (els.dictionarySearchInput.value.length > 0) {
      els.searchClearBtn.style.display = "flex";
    } else {
      els.searchClearBtn.style.display = "none";
    }
  });

  els.searchClearBtn.addEventListener("click", () => {
    els.dictionarySearchInput.value = "";
    els.searchClearBtn.style.display = "none";
    els.dictionarySearchInput.focus();
  });

  function triggerDirectSearch(wordStr) {
    els.dictionarySearchInput.value = wordStr;
    els.searchClearBtn.style.display = "flex";
    switchTab("dictionary-tab");
    searchWord(wordStr);
  }

  // Save/Unsave Favorite toggle action
  function toggleFavorite(wordObj) {
    const wordClean = wordObj.word.toLowerCase();
    const index = state.favorites.findIndex(f => f.word.toLowerCase() === wordClean);
    
    if (index > -1) {
      state.favorites.splice(index, 1);
      saveStateToLocalStorage();
      showToast(`Removed "${wordObj.word}" from Favorites.`, false);
      return false; // Not saved
    } else {
      state.favorites.push({
        word: wordObj.word,
        type: wordObj.type || "word",
        definition: wordObj.definition || "",
        example: wordObj.example || ""
      });
      saveStateToLocalStorage();
      showToast(`Saved "${wordObj.word}" to Favorites!`, true);
      return true; // Is saved
    }
  }

  function syncHeartUI(isSaved) {
    if (isSaved) {
      els.resultsFavBtn.classList.add("active");
      els.resultsHeartIcon.style.fill = "var(--danger)";
    } else {
      els.resultsFavBtn.classList.remove("active");
      els.resultsHeartIcon.style.fill = "none";
    }
  }

  // Search Word Logic (incorporates API with rich Local Fallback)
  async function searchWord(wordStr) {
    const wordClean = wordStr.trim().toLowerCase();
    
    // Clear old displays
    els.dictError.style.display = "none";
    els.dictResults.style.display = "none";
    els.dictLoading.style.display = "flex";

    // Update Recents state list
    state.recentLookups = [wordClean, ...state.recentLookups.filter(w => w !== wordClean)].slice(0, 5);
    state.stats.lookups += 1;
    saveStateToLocalStorage();

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordClean}`);
      if (response.ok) {
        const data = await response.json();
        renderAPIResults(data[0]);
      } else {
        // Fall back to offline words database
        const localMatch = VOCAB_DATABASE.find(item => item.word.toLowerCase() === wordClean);
        if (localMatch) {
          renderLocalResults(localMatch, "Local Database Fallback Active");
        } else {
          showSearchError(wordClean);
        }
      }
    } catch (err) {
      // Network failure: fallback to local database immediately
      const localMatch = VOCAB_DATABASE.find(item => item.word.toLowerCase() === wordClean);
      if (localMatch) {
        renderLocalResults(localMatch, "Offline Mode (Local Database)");
      } else {
        showSearchError(wordClean, "Network connection unavailable and word not found in offline vocabulary database.");
      }
    } finally {
      els.dictLoading.style.display = "none";
    }
  }

  // Render results fetched from public Free Dictionary API
  function renderAPIResults(entry) {
    els.dictResults.style.display = "block";
    els.resultsWordText.innerText = entry.word;
    
    // Heart fav sync
    const isSaved = state.favorites.some(f => f.word.toLowerCase() === entry.word.toLowerCase());
    syncHeartUI(isSaved);

    // Bind Favorite Heart trigger
    els.resultsFavBtn.onclick = () => {
      // Create a simplified word object from API entry
      const mainPos = entry.meanings[0] ? entry.meanings[0].partOfSpeech : "noun";
      const mainDef = entry.meanings[0]?.definitions[0] ? entry.meanings[0].definitions[0].definition : "";
      const mainExample = entry.meanings[0]?.definitions[0]?.example || "";
      
      const wordObj = {
        word: entry.word,
        type: mainPos,
        definition: mainDef,
        example: mainExample
      };
      
      const toggledState = toggleFavorite(wordObj);
      syncHeartUI(toggledState);
    };

    // Phonetic text
    const phoneticVal = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || "";
    els.resultsPhonetic.innerText = phoneticVal;

    // Pronunciation audio finder
    const audioObj = entry.phonetics?.find(p => p.audio && p.audio.trim().length > 0);
    if (audioObj) {
      els.phoneticAudio.src = audioObj.audio;
      els.resultsPronounceBtn.style.display = "inline-flex";
      els.resultsPronounceBtn.onclick = () => {
        els.phoneticAudio.play().catch(e => console.log("Audio play blocked: ", e));
      };
    } else {
      els.resultsPronounceBtn.style.display = "none";
    }

    // Render Copy Button
    els.resultsCopyBtn.onclick = () => {
      const topDef = entry.meanings[0]?.definitions[0]?.definition || "";
      const copyText = `"${entry.word}" (${entry.meanings[0]?.partOfSpeech || "word"}): ${topDef}`;
      navigator.clipboard.writeText(copyText).then(() => {
        showToast("Definition copied to clipboard!");
      });
    };

    // Render Meanings list blocks
    els.resultsMeaningsContainer.innerHTML = "";
    
    entry.meanings.forEach(meaning => {
      const block = document.createElement("div");
      block.className = "meaning-block";

      let definitionsHTML = "";
      // Limit to top 3 definitions per part of speech to avoid giant blocks
      meaning.definitions.slice(0, 3).forEach(def => {
        const exampleHTML = def.example ? `
          <div class="def-example-box">
            <span>"${def.example}"</span>
          </div>
        ` : "";

        definitionsHTML += `
          <li class="definition-item">
            <p class="def-text">${def.definition}</p>
            ${exampleHTML}
          </li>
        `;
      });

      // Synonyms chips list
      let synonymsHTML = "";
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        let chips = "";
        meaning.synonyms.slice(0, 5).forEach(syn => {
          chips += `<span class="chip search-chip" data-search="${syn}">${syn}</span>`;
        });
        synonymsHTML = `
          <div class="meta-group">
            <span class="meta-lbl">Synonyms</span>
            <div class="suggestions-chips">${chips}</div>
          </div>
        `;
      }

      // Antonyms chips list
      let antonymsHTML = "";
      if (meaning.antonyms && meaning.antonyms.length > 0) {
        let chips = "";
        meaning.antonyms.slice(0, 5).forEach(ant => {
          chips += `<span class="chip search-chip" data-search="${ant}">${ant}</span>`;
        });
        antonymsHTML = `
          <div class="meta-group">
            <span class="meta-lbl">Antonyms</span>
            <div class="suggestions-chips">${chips}</div>
          </div>
        `;
      }

      const hasMeta = synonymsHTML || antonymsHTML;

      block.innerHTML = `
        <div class="meaning-header">
          <span class="pos-tag">${meaning.partOfSpeech}</span>
          <div class="pos-line"></div>
        </div>
        <ul class="definition-list">
          ${definitionsHTML}
        </ul>
        ${hasMeta ? `
          <div class="meaning-meta-row">
            ${synonymsHTML}
            ${antonymsHTML}
          </div>
        ` : ""}
      `;

      // Add click listener on synonym/antonym chips for deep diving lookups
      block.querySelectorAll(".search-chip").forEach(chip => {
        chip.onclick = () => {
          const targetWord = chip.getAttribute("data-search");
          triggerDirectSearch(targetWord);
        };
      });

      els.resultsMeaningsContainer.appendChild(block);
    });

    lucide.createIcons();
  }

  // Render results from local words.js file
  function renderLocalResults(localObj, toastNoticeText) {
    els.dictResults.style.display = "block";
    els.resultsWordText.innerText = localObj.word;
    
    showToast(toastNoticeText, true);

    const isSaved = state.favorites.some(f => f.word.toLowerCase() === localObj.word.toLowerCase());
    syncHeartUI(isSaved);

    els.resultsFavBtn.onclick = () => {
      const toggledState = toggleFavorite(localObj);
      syncHeartUI(toggledState);
    };

    els.resultsPhonetic.innerText = "Offline transcription";
    els.resultsPronounceBtn.style.display = "none";

    els.resultsCopyBtn.onclick = () => {
      const copyText = `"${localObj.word}" (${localObj.type}): ${localObj.definition}`;
      navigator.clipboard.writeText(copyText).then(() => {
        showToast("Definition copied to clipboard!");
      });
    };

    els.resultsMeaningsContainer.innerHTML = "";
    const block = document.createElement("div");
    block.className = "meaning-block";

    let synonymsHTML = "";
    if (localObj.synonyms && localObj.synonyms.length > 0) {
      let chips = "";
      localObj.synonyms.slice(0, 5).forEach(syn => {
        chips += `<span class="chip search-chip" data-search="${syn}">${syn}</span>`;
      });
      synonymsHTML = `
        <div class="meta-group">
          <span class="meta-lbl">Synonyms</span>
          <div class="suggestions-chips">${chips}</div>
        </div>
      `;
    }

    let antonymsHTML = "";
    if (localObj.antonyms && localObj.antonyms.length > 0) {
      let chips = "";
      localObj.antonyms.slice(0, 5).forEach(ant => {
        chips += `<span class="chip search-chip" data-search="${ant}">${ant}</span>`;
      });
      antonymsHTML = `
        <div class="meta-group">
          <span class="meta-lbl">Antonyms</span>
          <div class="suggestions-chips">${chips}</div>
        </div>
      `;
    }

    block.innerHTML = `
      <div class="meaning-header">
        <span class="pos-tag">${localObj.type}</span>
        <div class="pos-line"></div>
      </div>
      <ul class="definition-list">
        <li class="definition-item">
          <p class="def-text">${localObj.definition}</p>
          <div class="def-example-box">
            <span>"${localObj.example}"</span>
          </div>
        </li>
      </ul>
      <div class="meaning-meta-row">
        ${synonymsHTML}
        ${antonymsHTML}
      </div>
    `;

    block.querySelectorAll(".search-chip").forEach(chip => {
      chip.onclick = () => {
        triggerDirectSearch(chip.getAttribute("data-search"));
      };
    });

    els.resultsMeaningsContainer.appendChild(block);
    lucide.createIcons();
  }

  // Friendly Spell checker error block population
  function showSearchError(wordClean, customMessage) {
    els.dictError.style.display = "flex";
    if (customMessage) {
      els.dictErrorMsg.innerText = customMessage;
    } else {
      els.dictErrorMsg.innerText = `We couldn't retrieve definitions for "${wordClean}". Please double-check spelling or explore our recommended vocabulary terms below.`;
    }

    els.errorSuggestChips.innerHTML = "";
    // Suggest 3 similar sounding or nearby index words
    const matches = VOCAB_DATABASE.filter(v => v.word.startsWith(wordClean.slice(0, 3)))
                                  .slice(0, 3);
    const fallbacks = matches.length > 0 ? matches : VOCAB_DATABASE.slice(0, 3);
    
    fallbacks.forEach(obj => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerText = obj.word;
      chip.onclick = () => {
        triggerDirectSearch(obj.word);
      };
      els.errorSuggestChips.appendChild(chip);
    });

    lucide.createIcons();
  }


  // ==========================================
  // 6. Practice Arena Routing & Switcher
  // ==========================================

  function switchPracticeMode(mode) {
    if (mode === "quiz") {
      els.modeQuizBtn.classList.add("active");
      els.modeFlashcardsBtn.classList.remove("active");
      els.quizPanel.classList.add("active");
      els.flashcardsPanel.classList.remove("active");
      
      initQuizStart();
    } else if (mode === "flashcards") {
      els.modeQuizBtn.classList.remove("active");
      els.modeFlashcardsBtn.classList.add("active");
      els.quizPanel.classList.remove("active");
      els.flashcardsPanel.classList.add("active");
      
      initFlashcardDeck();
    }
  }

  els.modeQuizBtn.onclick = () => switchPracticeMode("quiz");
  els.modeFlashcardsBtn.onclick = () => switchPracticeMode("flashcards");


  // ==========================================
  // 7. Dynamic Multiple Choice Quiz Engine
  // ==========================================

  function initQuizStart() {
    els.quizStateStart.style.display = "block";
    els.quizStatePlay.style.display = "none";
    els.quizStateEnd.style.display = "none";
  }

  els.quizStartActionBtn.addEventListener("click", startNewQuizRound);

  function startNewQuizRound() {
    state.quiz.questions = generateQuizQuestions();
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    state.quiz.selectedOptionIndex = null;
    state.quiz.isAnswered = false;

    els.quizStateStart.style.display = "none";
    els.quizStatePlay.style.display = "block";
    els.quizStateEnd.style.display = "none";

    renderQuizQuestion();
  }

  // Question Generator algorithm
  function generateQuizQuestions() {
    // Shuffler helper
    const shuffledWords = [...VOCAB_DATABASE].sort(() => 0.5 - Math.random());
    const roundWords = shuffledWords.slice(0, 5);
    
    return roundWords.map((wordObj, index) => {
      // 50-50 choice between Definition Matching vs Context fill-in-the-blank
      const type = Math.random() > 0.5 ? "Definition Match" : "Sentence Context";
      
      let questionText = "";
      if (type === "Definition Match") {
        questionText = `What is the correct definition of the word: <strong>${wordObj.word}</strong>?`;
      } else {
        // Blank out the word inside the example sentence
        const regex = new RegExp(wordObj.word, "gi");
        const blankedSentence = wordObj.example.replace(regex, "________");
        questionText = `Which word correctly completes the sentence: <br><br><em>"${blankedSentence}"</em>`;
      }

      // Generate distractors
      const distractors = [];
      const eligibleDistractors = VOCAB_DATABASE.filter(v => v.word !== wordObj.word);
      
      // Shuffle distractors
      eligibleDistractors.sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < 3; i++) {
        distractors.push(eligibleDistractors[i]);
      }

      // Construct option blocks
      let options = [];
      if (type === "Definition Match") {
        options = [
          { text: wordObj.definition, isCorrect: true, wordRef: wordObj },
          { text: distractors[0].definition, isCorrect: false, wordRef: distractors[0] },
          { text: distractors[1].definition, isCorrect: false, wordRef: distractors[1] },
          { text: distractors[2].definition, isCorrect: false, wordRef: distractors[2] }
        ];
      } else {
        options = [
          { text: wordObj.word, isCorrect: true, wordRef: wordObj },
          { text: distractors[0].word, isCorrect: false, wordRef: distractors[0] },
          { text: distractors[1].word, isCorrect: false, wordRef: distractors[1] },
          { text: distractors[2].word, isCorrect: false, wordRef: distractors[2] }
        ];
      }

      // Shuffle options lists using sort
      options.sort(() => 0.5 - Math.random());

      return {
        word: wordObj,
        type: type,
        questionText: questionText,
        options: options
      };
    });
  }

  function renderQuizQuestion() {
    const qIndex = state.quiz.currentIndex;
    const qTotal = state.quiz.questions.length;
    const qObj = state.quiz.questions[qIndex];

    state.quiz.selectedOptionIndex = null;
    state.quiz.isAnswered = false;

    // Reset UI
    els.quizNextBtn.disabled = true;
    els.quizExplanation.style.display = "none";

    // Progress
    els.quizQCurrent.innerText = qIndex + 1;
    els.quizQTotal.innerText = qTotal;
    els.quizScoreVal.innerText = state.quiz.score;
    els.quizProgressFill.style.width = ((qIndex + 1) / qTotal) * 100 + "%";

    // Texts
    els.quizQuestionType.innerText = qObj.type;
    els.quizQuestionTextVal.innerHTML = qObj.questionText;

    // Generate options in grid
    els.quizOptionsContainer.innerHTML = "";
    
    qObj.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn animate-fadeIn";
      
      const charCode = String.fromCharCode(65 + idx); // A, B, C, D
      btn.innerHTML = `
        <div class="option-marker">${charCode}</div>
        <span class="option-text">${opt.text}</span>
      `;

      btn.addEventListener("click", () => {
        if (!state.quiz.isAnswered) {
          handleOptionSelected(idx);
        }
      });

      els.quizOptionsContainer.appendChild(btn);
    });

    lucide.createIcons();
  }

  // On click option, show highlights immediately
  function handleOptionSelected(idx) {
    state.quiz.isAnswered = true;
    state.quiz.selectedOptionIndex = idx;
    
    const qObj = state.quiz.questions[state.quiz.currentIndex];
    const isCorrect = qObj.options[idx].isCorrect;

    if (isCorrect) {
      state.quiz.score += 1;
    }

    // Add classes on buttons
    const buttons = els.quizOptionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((btn, buttonIdx) => {
      btn.disabled = true; // prevent clicks
      
      const opt = qObj.options[buttonIdx];
      if (opt.isCorrect) {
        btn.classList.add("correct");
      } else if (buttonIdx === idx) {
        btn.classList.add("incorrect");
      }
    });

    // Populate and show explanation box
    els.quizExplanation.style.display = "block";
    els.explWordText.innerText = qObj.word.word;
    els.explWordPos.innerText = qObj.word.type;
    els.explWordDef.innerText = qObj.word.definition;
    els.explWordExample.innerText = `"${qObj.word.example}"`;

    const iconCorrect = els.quizExplanationHeader.querySelector(".expl-icon-correct");
    const iconIncorrect = els.quizExplanationHeader.querySelector(".expl-icon-incorrect");

    if (isCorrect) {
      els.quizExplanationTitle.innerText = "Correct answer!";
      els.quizExplanationTitle.style.color = "var(--success)";
      iconCorrect.style.display = "block";
      iconIncorrect.style.display = "none";
    } else {
      els.quizExplanationTitle.innerText = "Incorrect choice";
      els.quizExplanationTitle.style.color = "var(--danger)";
      iconCorrect.style.display = "none";
      iconIncorrect.style.display = "block";
    }

    els.quizNextBtn.disabled = false;
    els.quizNextBtn.focus();
    
    // Smooth scroll down to explanations
    setTimeout(() => {
      els.quizExplanation.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  // Next / Continue button trigger
  els.quizNextBtn.addEventListener("click", () => {
    state.quiz.currentIndex += 1;
    
    if (state.quiz.currentIndex < state.quiz.questions.length) {
      renderQuizQuestion();
    } else {
      completeQuizRound();
    }
  });

  // Quit challenge early
  els.quizQuitBtn.onclick = () => {
    if (confirm("Are you sure you want to quit the quiz? Your current progress in this round won't be saved.")) {
      initQuizStart();
    }
  };

  // Quiz completed, compile statistics and display reviews
  function completeQuizRound() {
    els.quizStatePlay.style.display = "none";
    els.quizStateEnd.style.display = "block";

    // Update state stats
    state.stats.quizzesPlayed += 1;
    state.stats.correctAnswers += state.quiz.score;
    state.stats.totalQuestionsPlayed += 5;
    saveStateToLocalStorage();

    const percent = Math.round((state.quiz.score / 5) * 100);
    els.quizFinalPercent.innerText = percent + "%";
    els.quizFinalFraction.innerText = `${state.quiz.score} / 5 Correct`;

    // Circular progress animation
    const circle = els.quizScoreCircle;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference; // start empty
    
    setTimeout(() => {
      circle.style.strokeDashoffset = offset; // animate fill
    }, 300);

    // End Title heading setting
    if (state.quiz.score === 5) {
      els.quizEndTitle.innerText = "Perfect Lexical Victory!";
      els.quizEndSubtitle.innerText = "Outstanding! You got every single question right. Your vocabulary level is expanding incredibly fast!";
      triggerConfettiShower();
    } else if (state.quiz.score >= 4) {
      els.quizEndTitle.innerText = "Excellent Job, Scholar!";
      els.quizEndSubtitle.innerText = "Very high performance! You've mastered these terms. Keep up the high effort!";
      triggerConfettiShower();
    } else if (state.quiz.score >= 2) {
      els.quizEndTitle.innerText = "Solid Effort!";
      els.quizEndSubtitle.innerText = "A respectable score. Review the details below to master these definitions.";
    } else {
      els.quizEndTitle.innerText = "Keep Practicing!";
      els.quizEndSubtitle.innerText = "Every error is an opportunity to learn. Study the details below and try again!";
    }

    // Populate Detailed Quiz Review Panel
    els.quizReviewList.innerHTML = "";
    
    state.quiz.questions.forEach((q, index) => {
      const isCorrect = q.options[state.quiz.questions[index].options.findIndex((o, i) => o.isCorrect)].wordRef.word === q.word.word; 
      // safer: search our chosen option correct field
      const userSelectedIndex = state.quiz.questions[index].options.findIndex((o, i) => i === state.quiz.questions[index].options.map((_, oi) => oi === state.quiz.questions[index].selectedOptionIndex)[oi] ); // wait, simplifies:
      
      const chosenOpt = q.options[state.quiz.questions[index].selectedOptionIndex];
      const isUserCorrect = chosenOpt.isCorrect;

      const card = document.createElement("div");
      card.className = `review-card ${isUserCorrect ? "review-card-correct" : "review-card-incorrect"}`;

      card.innerHTML = `
        <div class="review-icon-box ${isUserCorrect ? "icon-green" : "icon-red"}">
          <i data-lucide="${isUserCorrect ? "check" : "x"}"></i>
        </div>
        <div class="review-card-content">
          <h4 class="review-card-word">${q.word.word} <span class="list-item-pos">(${q.word.type})</span></h4>
          <p class="review-card-answer-line">Definition: <strong>${q.word.definition}</strong></p>
          <p class="review-card-example">"${q.word.example}"</p>
        </div>
      `;

      els.quizReviewList.appendChild(card);
    });

    lucide.createIcons();
  }

  els.quizEndDashboardBtn.onclick = () => {
    switchTab("dashboard-tab");
  };

  els.quizRetryBtn.onclick = () => {
    startNewQuizRound();
  };


  // ==========================================
  // 8. 3D Flashcard Recall Deck Engine
  // ==========================================

  function initFlashcardDeck() {
    els.flashcardCompleteState.style.display = "none";
    els.flashcardElement.style.display = "block";
    els.flashcardTriggerArea.style.pointerEvents = "auto";
    
    // Choose 10 random words from database
    const shuffled = [...VOCAB_DATABASE].sort(() => 0.5 - Math.random());
    state.flashcards.deck = shuffled.slice(0, 10);
    state.flashcards.currentIndex = 0;
    state.flashcards.masteredCount = 0;
    state.flashcards.totalCount = state.flashcards.deck.length;

    els.fcMasteredCount.innerText = "0";
    
    renderFlashcard();
  }

  function renderFlashcard() {
    const fcState = state.flashcards;
    
    if (fcState.currentIndex >= fcState.deck.length) {
      completeFlashcardDeck();
      return;
    }

    const wordObj = fcState.deck[fcState.currentIndex];

    // Reset card flip class state
    els.flashcardElement.classList.remove("flipped");

    // Meta Progress
    els.flashcardDeckIndicator.innerText = `Card ${fcState.currentIndex + 1} of ${fcState.totalCount}`;
    els.flashcardProgressFill.style.width = ((fcState.currentIndex) / fcState.totalCount) * 100 + "%";

    // Set Front face fields
    els.fcFrontWord.innerText = wordObj.word;
    els.fcFrontPos.innerText = wordObj.type;
    els.fcFrontPhonetic.innerText = "academic vocabulary";

    // Set Back face fields
    els.fcBackWord.innerText = wordObj.word;
    els.fcBackPos.innerText = wordObj.type;
    els.fcBackDefinition.innerText = wordObj.definition;
    els.fcBackExample.innerText = `"${wordObj.example}"`;

    els.fcBackSyns.innerText = wordObj.synonyms?.join(", ") || "none";
    els.fcBackAnts.innerText = wordObj.antonyms?.join(", ") || "none";

    lucide.createIcons();
  }

  // Trigger Rotate flip click event
  els.flashcardTriggerArea.addEventListener("click", () => {
    els.flashcardElement.classList.toggle("flipped");
  });

  // Action Success (Mastered) click
  els.fcActionSuccess.addEventListener("click", (e) => {
    e.stopPropagation(); // stop card from flipping on button click

    // Mastered removes word from current active deck
    state.flashcards.masteredCount += 1;
    els.fcMasteredCount.innerText = state.flashcards.masteredCount;

    els.flashcardElement.classList.remove("flipped"); // flip back
    
    // brief delay for transition flip, then next
    setTimeout(() => {
      state.flashcards.currentIndex += 1;
      renderFlashcard();
    }, 250);
  });

  // Action Fail (Need Practice) click
  els.fcActionFail.addEventListener("click", (e) => {
    e.stopPropagation(); // stop card from flipping on button click

    // Need Practice pushes word to end of current flashcards deck queue
    const currentWord = state.flashcards.deck[state.flashcards.currentIndex];
    state.flashcards.deck.push(currentWord);
    state.flashcards.totalCount = state.flashcards.deck.length;

    els.flashcardElement.classList.remove("flipped"); // flip back

    setTimeout(() => {
      state.flashcards.currentIndex += 1;
      renderFlashcard();
    }, 250);
  });

  els.flashcardResetDeck.onclick = () => {
    if (confirm("Are you sure you want to re-shuffle the deck? This resets the current round.")) {
      initFlashcardDeck();
    }
  };

  function completeFlashcardDeck() {
    els.flashcardElement.style.display = "none";
    els.flashcardTriggerArea.style.pointerEvents = "none";
    els.flashcardCompleteState.style.display = "flex";

    els.fcFinalMastered.innerText = state.flashcards.masteredCount;
    // Total count represents total terms processed in order
    els.fcFinalTotal.innerText = VOCAB_DATABASE.slice(0, 10).length; // initial deck size

    els.flashcardProgressFill.style.width = "100%";
    
    triggerConfettiShower();
  }

  els.fcRestartDeckBtn.addEventListener("click", initFlashcardDeck);


  // ==========================================
  // 9. Custom Fluid Confetti Canvas Overlay
  // ==========================================
  
  let animationFrameId = null;
  
  function triggerConfettiShower() {
    const canvas = els.confettiCanvas;
    const ctx = canvas.getContext("2d");
    
    // Set viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let colors = ["#8b5cf6", "#a78bfa", "#3b82f6", "#60a5fa", "#10b981", "#34d399", "#f59e0b"];
    if (document.body.classList.contains("theme-rutgers-scarlet")) {
      colors = ["#cc0033", "#ff4d6a", "#111111", "#ffffff", "#868f98"];
    } else if (document.body.classList.contains("theme-cosmic-dark")) {
      colors = ["#ef4444", "#f97316", "#dc2626", "#fda4af", "#ff7300"];
    } else if (document.body.classList.contains("theme-sunset-glow")) {
      colors = ["#f43f5e", "#fb923c", "#e11d48", "#fda4af", "#ff9966"];
    } else if (document.body.classList.contains("theme-aurora-wave")) {
      colors = ["#0d9488", "#10b981", "#2dd4bf", "#99f6e4", "#059669"];
    } else if (document.body.classList.contains("theme-cyberpunk-neon")) {
      colors = ["#ff007f", "#00f0ff", "#ff00ff", "#00ffff", "#ff66b2"];
    } else if (document.body.classList.contains("theme-solar-light")) {
      colors = ["#ff5e62", "#ff9966", "#f43f5e", "#ffeedd", "#ff3b40"];
    }
    const particles = [];
    
    // Create 120 confetti pieces
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20, // start above viewport
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 5 + 4,
        rotation: Math.random() * 360,
        spinSpeed: Math.random() * 6 - 3
      });
    }

    cancelAnimationFrame(animationFrameId);
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let liveParticles = false;
      
      particles.forEach(p => {
        if (p.y < canvas.height + 20) {
          liveParticles = true;
        }
        
        // Update physics
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.spinSpeed;
        
        // Render particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        // Draw standard rectangular confetti piece
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      
      if (liveParticles) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    animate();
  }


  // ==========================================
  // 10. Initialization Startup
  // ==========================================
  
  loadStateFromLocalStorage();
  updateDashboardUI();
  
  // Show active database notification briefly on startup
  setTimeout(() => {
    els.toastMessage.classList.add("active");
    setTimeout(() => {
      els.toastMessage.classList.remove("active");
    }, 3500);
  }, 800);

});
