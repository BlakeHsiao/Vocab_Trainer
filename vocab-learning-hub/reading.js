/**
 * Reading Comprehension Module Controller for VocabVibe
 * Handles dynamic content population, user theme preferences, interactive hover annotations,
 * and standard multi-option reading comprehension testing.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements Selector Hooks
  const els = {
    // Theme triggers
    themeToggle: document.getElementById("theme-toggle"),
    themeDropdown: document.getElementById("theme-dropdown"),
    themeOptions: document.querySelectorAll(".theme-option"),
    activeThemeName: document.querySelector(".active-theme-name"),

    // Core views
    passageSelect: document.getElementById("passage-select"),
    passageTopicBadge: document.getElementById("passage-topic-badge"),
    passageWordCount: document.getElementById("passage-word-count"),
    passageDisplayTitle: document.getElementById("passage-display-title"),
    passageDisplayText: document.getElementById("passage-display-text"),
    passageQuizContainer: document.getElementById("passage-quiz-container"),
    rcQuizCard: document.getElementById("rc-quiz-card"),
    rcQuestionProgress: document.getElementById("rc-question-progress"),
    rcProgressFill: document.getElementById("rc-progress-fill"),
    rcQuestionText: document.getElementById("rc-question-text"),
    rcOptionsContainer: document.getElementById("rc-options-container"),
    rcExplanationBox: document.getElementById("rc-explanation-box"),
    rcExplainTitle: document.getElementById("rc-explain-title"),
    rcExplanationText: document.getElementById("rc-explanation-text"),
    rcNextBtn: document.getElementById("rc-next-btn"),
    rcCompleteState: document.getElementById("rc-complete-state"),
    rcFinalScore: document.getElementById("rc-final-score"),
    rcFinalAccuracy: document.getElementById("rc-final-accuracy"),
    rcRestartBtn: document.getElementById("rc-restart-btn"),
    rcNextPassageBtn: document.getElementById("rc-next-passage-btn"),

    // Light/Dark Mode Elements
    modeToggleBtn: document.getElementById("mode-toggle-btn"),
    modeSunIcon: document.querySelector(".mode-sun-icon"),
    modeMoonIcon: document.querySelector(".mode-moon-icon"),

    // Overlays & Utilities
    confettiCanvas: document.getElementById("confetti-canvas"),
    toastMessage: document.getElementById("toast-message")
  };

  // Dedicated Module State
  const state = {
    reading: {
      currentPassageIndex: 0,
      currentQuestionIndex: 0,
      score: 0,
      isAnswered: false
    },
    stats: {
      lookups: 0,
      quizzesPlayed: 0,
      correctAnswers: 0,
      totalQuestionsPlayed: 0,
      streak: 1,
      lastActiveDate: null
    }
  };

  // Initialize Lucide Icons
  lucide.createIcons();

  // ==========================================
  // 1. Theme Selector Controller System
  // ==========================================

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
    if (els.activeThemeName) {
      const themeLabels = {
        "theme-rutgers-scarlet": "Rutgers Scarlet",
        "theme-cosmic-dark": "Crimson Dark",
        "theme-sunset-glow": "Sunset Glow",
        "theme-aurora-wave": "Aurora Mint",
        "theme-cyberpunk-neon": "Cyberpunk",
        "theme-solar-light": "Solar Light"
      };
      els.activeThemeName.textContent = themeLabels[themeName] || "Rutgers Scarlet";
    }

    els.themeOptions.forEach(opt => {
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

  function updateModeUI(mode) {
    if (els.modeSunIcon && els.modeMoonIcon) {
      if (mode === "light") {
        els.modeSunIcon.style.display = "none";
        els.modeMoonIcon.style.display = "block";
      } else {
        els.modeSunIcon.style.display = "block";
        els.modeMoonIcon.style.display = "none";
      }
    }
  }

  // Load and apply theme on startup
  const savedTheme = localStorage.getItem("vocab_theme") || "theme-rutgers-scarlet";
  setTheme(savedTheme);

  // Load and apply Mode on startup
  const savedMode = localStorage.getItem("vocab_mode") || "dark";
  if (savedMode === "light") {
    document.body.classList.add("mode-light");
    updateModeUI("light");
  } else {
    document.body.classList.remove("mode-light");
    updateModeUI("dark");
  }

  // Bind click event for mode toggling
  if (els.modeToggleBtn) {
    els.modeToggleBtn.addEventListener("click", () => {
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

  // Toggle theme selector panel
  if (els.themeToggle) {
    els.themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      els.themeDropdown.classList.toggle("active");
    });
  }

  // Option select click handlers
  els.themeOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const theme = opt.getAttribute("data-theme");
      setTheme(theme);
      els.themeDropdown.classList.remove("active");
    });
  });

  // Close theme panel on clicking outside
  document.addEventListener("click", () => {
    if (els.themeDropdown) {
      els.themeDropdown.classList.remove("active");
    }
  });

  // ==========================================
  // 2. Reading Comprehension Module Engine
  // ==========================================

  function initReadingComprehension() {
    // Load overall user stats from local storage so we can increment correctly on win
    const savedStats = localStorage.getItem("vocab_stats");
    if (savedStats) {
      try {
        state.stats = JSON.parse(savedStats);
      } catch (err) {
        console.error("Failed to load local stats:", err);
      }
    }

    // 1. Populate Passage Dropdown if empty
    els.passageSelect.innerHTML = PASSAGES_DATABASE.map((p, index) => 
      `<option value="${index}">${p.title}</option>`
    ).join("");

    // Bind dropdown change event
    els.passageSelect.onchange = (e) => {
      state.reading.currentPassageIndex = parseInt(e.target.value);
      loadPassage(state.reading.currentPassageIndex);
    };

    // 2. Load the active passage
    loadPassage(state.reading.currentPassageIndex);

    // 3. Bind navigation & completing actions
    els.rcNextBtn.onclick = handleRcNextQuestion;
    els.rcRestartBtn.onclick = () => loadPassage(state.reading.currentPassageIndex);
    els.rcNextPassageBtn.onclick = handleRcNextPassage;
  }

  function loadPassage(passageIndex) {
    const passage = PASSAGES_DATABASE[passageIndex];
    if (!passage) return;

    // Reset state values
    state.reading.currentQuestionIndex = 0;
    state.reading.score = 0;
    state.reading.isAnswered = false;

    // Toggle layouts visibility
    els.passageQuizContainer.style.display = "grid";
    els.rcCompleteState.style.display = "none";
    els.rcQuizCard.style.display = "block";

    // Set topic and word counts
    els.passageTopicBadge.innerText = passageIndex === 0 ? "Sciences & Astronomy" : "History & Innovation";
    els.passageWordCount.innerText = `~${passage.text.split(" ").length} words`;
    els.passageDisplayTitle.innerText = passage.title;
    els.passageDisplayText.innerHTML = passage.text;

    // Align select element
    els.passageSelect.value = passageIndex;

    // Bind popup definition hover/click handlers on vocabulary highlight terms
    setupPassageVocabTriggers();

    // Load first question
    loadRcQuestion();
  }

  function setupPassageVocabTriggers() {
    const vocabElements = els.passageDisplayText.querySelectorAll(".passage-vocab-word");
    vocabElements.forEach(el => {
      const targetWordStr = el.getAttribute("data-word");
      const wordObj = VOCAB_DATABASE.find(w => w.word.toLowerCase() === targetWordStr.toLowerCase());

      if (wordObj) {
        // Set standard browser hover tooltip
        el.setAttribute("title", `[${wordObj.type}] ${wordObj.definition}`);

        // Set click listener to pop up full definition or search
        el.onclick = (e) => {
          e.stopPropagation();
          // Pop toast with description
          showRcWordToast(wordObj);
        };
      }
    });
  }

  function showRcWordToast(wordObj) {
    const toast = els.toastMessage;
    const toastText = toast.querySelector(".toast-text");
    const toastIcon = toast.querySelector(".toast-icon");
    
    // Customize toast
    toastIcon.setAttribute("data-lucide", "book-open");
    toastIcon.style.color = "var(--primary)";
    toastText.innerHTML = `<strong style="color: var(--primary);">${wordObj.word}</strong> (${wordObj.type}): ${wordObj.definition}`;
    
    lucide.createIcons();
    toast.classList.add("active");

    // Auto-dismiss toast
    const dismissTimer = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000);

    // Click on toast to dismiss early
    toast.onclick = () => {
      toast.classList.remove("active");
      clearTimeout(dismissTimer);
    };
  }

  function loadRcQuestion() {
    const passage = PASSAGES_DATABASE[state.reading.currentPassageIndex];
    const qIndex = state.reading.currentQuestionIndex;
    const question = passage.questions[qIndex];

    state.reading.isAnswered = false;
    els.rcExplanationBox.style.display = "none";
    els.rcNextBtn.style.display = "none";

    // Set progress info
    const totalQCount = passage.questions.length;
    els.rcQuestionProgress.innerText = `Question ${qIndex + 1} of ${totalQCount}`;
    els.rcProgressFill.style.width = `${((qIndex + 1) / totalQCount) * 100}%`;

    // Render text
    els.rcQuestionText.innerText = question.q;

    // Render options list
    els.rcOptionsContainer.innerHTML = question.options.map((opt, oIndex) => 
      `<button class="option-btn" data-index="${oIndex}">${opt}</button>`
    ).join("");

    // Bind option click events
    const optionButtons = els.rcOptionsContainer.querySelectorAll(".option-btn");
    optionButtons.forEach(btn => {
      btn.onclick = () => handleRcAnswerSelection(btn, parseInt(btn.getAttribute("data-index")));
    });
  }

  function handleRcAnswerSelection(selectedBtn, chosenIndex) {
    if (state.reading.isAnswered) return;
    state.reading.isAnswered = true;

    const passage = PASSAGES_DATABASE[state.reading.currentPassageIndex];
    const question = passage.questions[state.reading.currentQuestionIndex];
    const isCorrect = chosenIndex === question.correct;

    // Disable all option buttons
    const optionButtons = els.rcOptionsContainer.querySelectorAll(".option-btn");
    optionButtons.forEach(btn => {
      btn.disabled = true;
    });

    if (isCorrect) {
      state.reading.score++;
      selectedBtn.classList.add("selected-correct");
      
      // Configure explanation box
      els.rcExplanationBox.className = "explanation-box correct mt-4";
      els.rcExplainTitle.innerText = "Correct! Great Analysis.";
    } else {
      selectedBtn.classList.add("selected-incorrect");
      
      // Highlight the correct button so they learn
      const correctBtn = els.rcOptionsContainer.querySelector(`.option-btn[data-index="${question.correct}"]`);
      if (correctBtn) correctBtn.classList.add("selected-correct");

      els.rcExplanationBox.className = "explanation-box incorrect mt-4";
      els.rcExplainTitle.innerText = "Incorrect. Let's learn!";
    }

    // Populate and show explanation text
    els.rcExplanationText.innerText = question.explanation;
    els.rcExplanationBox.style.display = "block";

    // Reveal Next Question button
    els.rcNextBtn.style.display = "flex";
  }

  function handleRcNextQuestion() {
    const passage = PASSAGES_DATABASE[state.reading.currentPassageIndex];
    state.reading.currentQuestionIndex++;

    if (state.reading.currentQuestionIndex < passage.questions.length) {
      loadRcQuestion();
    } else {
      completeRcPassage();
    }
  }

  function completeRcPassage() {
    els.passageQuizContainer.style.display = "none";
    els.rcCompleteState.style.display = "block";

    const passage = PASSAGES_DATABASE[state.reading.currentPassageIndex];
    const totalQCount = passage.questions.length;
    const finalScoreStr = `${state.reading.score} / ${totalQCount}`;
    const accuracyVal = Math.round((state.reading.score / totalQCount) * 100);

    els.rcFinalScore.innerText = finalScoreStr;
    els.rcFinalAccuracy.innerText = `${accuracyVal}%`;

    // Increment overall statistics under global lookup tracker and save
    state.stats.quizzesPlayed++;
    state.stats.totalQuestionsPlayed += totalQCount;
    state.stats.correctAnswers += state.reading.score;
    localStorage.setItem("vocab_stats", JSON.stringify(state.stats));

    triggerConfettiShower();
  }

  function handleRcNextPassage() {
    const nextIndex = (state.reading.currentPassageIndex + 1) % PASSAGES_DATABASE.length;
    state.reading.currentPassageIndex = nextIndex;
    loadPassage(nextIndex);
  }

  // ==========================================
  // 3. Fluid Confetti Canvas Overlay
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
    const activeClass = document.body.className;
    
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

  // Run the initialization
  initReadingComprehension();
});
