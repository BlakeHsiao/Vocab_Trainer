/* -------------------------------------------------------------
 * Game Engine: Scarlet Arena - SAT Battle
 * Author: Antigravity AI
 * Mechanics: HTML5 Canvas particles, procedural Web Audio SFX synth,
 *            SAT-style question grids, responsive character states.
 * ------------------------------------------------------------- */

// ==========================================
// 1. Dynamic Question State
// ==========================================
// Pre-made SAT Question Bank removed. Questions are now generated dynamically 100% in real-time by Gemini AI!


// ==========================================
// 2. Procedural Web Audio API Sound Synth
// ==========================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSlashSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Slashing sweep frequency
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.35);
    
    // Quick gain decay
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);
  } catch (e) {
    console.warn("Synth blocked by autoplay restriction or not supported", e);
  }
}

function playBlockSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Metallic bell ring
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.26);
  } catch (e) {
    console.warn("Synth failed", e);
  }
}

function playVictorySound() {
  try {
    initAudio();
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.15 + 0.4);
      
      osc.start(audioCtx.currentTime + idx * 0.15);
      osc.stop(audioCtx.currentTime + idx * 0.15 + 0.45);
    });
  } catch (e) {
    console.warn(e);
  }
}

function playDefeatSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.61);
  } catch (e) {
    console.warn(e);
  }
}

// ==========================================
// 3. Canvas 2D Particle FX System
// ==========================================
let canvas, ctx;
let particlesList = [];

function initCanvas() {
  canvas = document.getElementById("canvas-particles");
  if (canvas) {
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(updateParticlesLoop);
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 6 + 3;
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * 8 - 4;
    this.life = 1.0;
    this.decay = Math.random() * 0.05 + 0.03;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnSparks(x, y, color) {
  for (let i = 0; i < 25; i++) {
    particlesList.push(new Particle(x, y, color));
  }
}

function updateParticlesLoop() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particlesList = particlesList.filter(p => {
    p.update();
    p.draw();
    return p.life > 0;
  });
  
  requestAnimationFrame(updateParticlesLoop);
}

// Pre-made static knight dialogue pools removed. All dialogue is now dynamically constructed by Gemini AI in real-time!

// ==========================================
// 5. Game Core State Engine
// ==========================================
let playerHp = 100;
let knightHp = 100;
let currentQuestionIdx = 0;
let activeQuestions = [];
let gameScore = 0;
let isTurnEvaluating = false;

// DOM Cache
const els = {
  playerHpBar: null,
  knightHpBar: null,
  playerHpText: null,
  knightHpText: null,
  playerWrapper: null,
  knightWrapper: null,
  dialogueText: null,
  dialogueBubble: null,
  screenOverlay: null,
  passageText: null,
  promptText: null,
  choicesWrapper: null,
  categoryBadge: null,
  progressText: null,
  explanationBox: null,
  explanTitle: null,
  explanDesc: null,
  nextBtn: null,
  endOverlay: null,
  endTitle: null,
  endDesc: null,
  endEmoji: null,
  statAccuracy: null,
  statScore: null,
  restartBtn: null
};

function cacheDOM() {
  els.playerHpBar = document.getElementById("player-hp-fill");
  els.knightHpBar = document.getElementById("knight-hp-fill");
  els.playerHpText = document.getElementById("player-hp-text");
  els.knightHpText = document.getElementById("knight-hp-text");
  
  els.playerWrapper = document.getElementById("player-fighter-card");
  els.knightWrapper = document.getElementById("knight-fighter-card");
  
  els.dialogueText = document.getElementById("knight-dialogue-text");
  els.dialogueBubble = document.getElementById("knight-dialogue-bubble");
  els.screenOverlay = document.getElementById("fx-overlay");
  
  els.passageText = document.getElementById("sat-passage-box");
  els.promptText = document.getElementById("sat-prompt-box");
  els.choicesWrapper = document.getElementById("choices-buttons-box");
  
  els.categoryBadge = document.getElementById("quest-category-label");
  els.progressText = document.getElementById("quest-progress-label");
  
  els.explanationBox = document.getElementById("explanation-card");
  els.explanTitle = document.getElementById("explanation-title-txt");
  els.explanDesc = document.getElementById("explanation-desc-txt");
  els.nextBtn = document.getElementById("next-question-btn");
  
  els.endOverlay = document.getElementById("end-game-overlay");
  els.endTitle = document.getElementById("end-title");
  els.endDesc = document.getElementById("end-desc");
  els.endEmoji = document.getElementById("end-emoji");
  els.statAccuracy = document.getElementById("stat-accuracy");
  els.statScore = document.getElementById("stat-score");
  els.restartBtn = document.getElementById("restart-game-btn");
}

function initializeGame() {
  cacheDOM();
  initCanvas();
  
  // Apply visual theme modes saved from other tabs
  const savedMode = localStorage.getItem("vocab_mode") || "dark";
  if (savedMode === "light") {
    document.body.classList.add("mode-light");
  } else {
    document.body.classList.remove("mode-light");
  }

  // Clear questions - questions are generated purely on-the-fly in real-time by the AI agent
  activeQuestions = [];
  
  playerHp = 100;
  knightHp = 100;
  currentQuestionIdx = 0;
  gameScore = 0;
  isTurnEvaluating = false;
  
  els.endOverlay.classList.remove("active");
  els.explanationBox.style.display = "none";
  
  updateHpUI();
  renderCurrentQuestion();
  
  // Knight greeting
  const isAiActive = localStorage.getItem("gemini_api_key") && localStorage.getItem("gemini_enabled") === "true";
  if (isAiActive) {
    showKnightBubble("⚔️ Speak, noble scholar! Enter the Lists of Raritan! The Gemini Oracle has initialized our combat. Ready thy weapon!");
  } else {
    showKnightBubble("🛡️ Halt, traveler! This arena is locked. Configure thy Gemini API Key in the settings panel above to draw thy sword!");
  }
}

function updateHpUI() {
  // HP Fills
  els.playerHpBar.style.width = playerHp + "%";
  els.knightHpBar.style.width = knightHp + "%";
  
  // HP Counts
  els.playerHpText.innerText = `${playerHp} / 100 HP`;
  els.knightHpText.innerText = `${knightHp} / 100 HP`;
  
  // Color Shifts
  updateHpColorClass(els.playerHpBar, playerHp);
  updateHpColorClass(els.knightHpBar, knightHp);
}

function updateHpColorClass(fillElement, hp) {
  fillElement.classList.remove("warning", "danger");
  if (hp <= 30) {
    fillElement.classList.add("danger");
  } else if (hp <= 60) {
    fillElement.classList.add("warning");
  }
}

function showKnightBubble(text) {
  els.dialogueText.innerHTML = text;
  els.dialogueBubble.classList.add("visible");
}

async function renderCurrentQuestion() {
  const isAiActive = localStorage.getItem("gemini_api_key") && localStorage.getItem("gemini_enabled") === "true";

  if (!isAiActive) {
    // Render a premium, styled instruction board asking to input key
    els.passageText.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 15px; padding: 25px; align-items: center; justify-content: center; text-align: center; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.03); border: 1px dashed rgba(204, 0, 51, 0.25);">
        <i data-lucide="key" style="width: 42px; height: 42px; color: var(--arena-secondary); margin-bottom: 5px;"></i>
        <h3 style="font-family: var(--font-header); font-size: 18px; font-weight: 800; color: var(--arena-secondary); margin: 0;">Gemini AI Core Required</h3>
        <p style="font-family: var(--font-body); font-size: 13.5px; line-height: 1.6; color: var(--text-secondary); max-width: 440px; margin: 0;">
          The Scarlet Arena's dynamic joust is powered by your personal Gemini AI engine. Click the <strong>Bot Key Icon</strong> <i data-lucide="bot" style="width: 14px; height: 14px; vertical-align: middle; color: var(--arena-secondary);"></i> in the top-right header to configure your Gemini API Key and draw your blade!
        </p>
        <button class="next-action-button" onclick="document.getElementById('api-key-btn').click()" style="align-self: center; font-size: 13px; padding: 10px 20px; background: var(--gradient-primary); border: none; color: white; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="key" style="width: 14px; height: 14px;"></i> Configure AI Key
        </button>
      </div>
    `;
    els.promptText.innerText = "Waiting for AI authorization...";
    els.choicesWrapper.innerHTML = "";
    els.categoryBadge.innerHTML = `<i data-lucide="shield" style="width: 14px; height: 14px;"></i> <span>System Locked</span>`;
    els.progressText.innerText = "Verification Required";
    showKnightBubble("🛡️ Halt, scholar! This arena's combat trials are entirely powered by the celestial Gemini Oracle. Set thy API key to unlock the gate and draw thy blade!");
    
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    return;
  }
  
  let q;

  // Show loading skeleton in the passage area
  els.passageText.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px; padding: 20px; align-items: center; justify-content: center; text-align: center; min-height: 120px;">
      <i data-lucide="sparkles" class="animate-spin" style="width: 32px; height: 32px; color: var(--arena-secondary);"></i>
      <p style="font-family: var(--font-header); font-size: 15px; margin-top: 8px; font-weight: 800; color: var(--arena-secondary);">Gemini AI is crafting a custom SAT question...</p>
      <p style="font-size: 12px; color: var(--text-muted);">Formulating passage, option distractors, and voice reactions on the fly.</p>
    </div>
  `;
  els.promptText.innerText = "Please stand by, scholar...";
  els.choicesWrapper.innerHTML = "";
  showKnightBubble("🧙‍♂️ Stand back, scholar! I am calling upon the celestial Gemini Oracle to shape a brand-new trial of Evidence and Rhetoric for thee!");
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  try {
    q = await generateAIQuestion();
    activeQuestions[currentQuestionIdx] = q;
  } catch (e) {
    console.warn("Gemini AI failed:", e);
    els.passageText.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px; padding: 20px; align-items: center; justify-content: center; text-align: center; min-height: 120px; color: var(--arena-primary);">
        <i data-lucide="alert-octagon" style="width: 36px; height: 32px;"></i>
        <p style="font-family: var(--font-header); font-weight: 800; font-size: 15px; margin: 0;">Gemini Oracle Connection Error</p>
        <p style="font-size: 12px; color: var(--text-muted); max-width: 400px; margin: 0;">${e.message || "Please check your network and ensure your API key is correct."}</p>
        <button class="next-action-button" onclick="renderCurrentQuestion()" style="align-self: center; font-size: 12px; padding: 8px 16px; background: rgba(255,255,255,0.08); border: 1px solid var(--arena-border-glass); color: var(--text-primary); box-shadow: none;">
          <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i> Retry Connection
        </button>
      </div>
    `;
    showKnightBubble("⚠️ Alas! The Gemini Oracle has parried our connection request! Press the 'Retry' crest above to try charging again!");
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    return;
  }
  
  // Render Meta
  els.categoryBadge.innerHTML = `<i data-lucide="sword" style="width: 14px; height: 14px;"></i> <span>${q.category}</span>`;
  els.progressText.innerText = `Question ${currentQuestionIdx + 1}`;
  
  // Render Passage & prompt
  els.passageText.innerHTML = q.passage.replace("______", "<strong style='color: var(--arena-secondary); text-decoration: underline;'>______</strong>");
  els.promptText.innerText = q.question;
  
  // Render Choices
  els.choicesWrapper.innerHTML = "";
  els.explanationBox.style.display = "none";
  isTurnEvaluating = false;
  
  q.options.forEach((opt, idx) => {
    const letter = ["A", "B", "C", "D"][idx];
    const btn = document.createElement("button");
    btn.className = "choice-action-button";
    btn.innerHTML = `
      <span class="choice-letter-badge">${letter}</span>
      <span>${opt.text}</span>
    `;
    btn.onclick = () => handleChoiceSelection(btn, opt);
    els.choicesWrapper.appendChild(btn);
  });
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function handleChoiceSelection(selectedBtn, chosenOption) {
  if (isTurnEvaluating) return;
  isTurnEvaluating = true;
  initAudio(); // Initialize audio context on first interactive gesture
  
  const q = activeQuestions[currentQuestionIdx];
  const allButtons = els.choicesWrapper.querySelectorAll(".choice-action-button");
  
  // Disable all inputs immediately
  allButtons.forEach(btn => btn.disabled = true);
  
  const isCorrect = chosenOption.isCorrect;
  
  // Calculate randomized strike damage (20 - 25 HP)
  const dmg = Math.floor(Math.random() * 6) + 20;
  
  if (isCorrect) {
    gameScore++;
    knightHp = Math.max(0, knightHp - dmg);
    
    // Player Attacks!
    playSlashSound();
    els.playerWrapper.classList.add("animate-player-lunge");
    setTimeout(() => els.playerWrapper.classList.remove("animate-player-lunge"), 500);
    
    // Slash Flash
    els.screenOverlay.className = "screen-fx-overlay fx-slash";
    setTimeout(() => els.screenOverlay.className = "screen-fx-overlay", 400);
    
    // Shake & Hurt Knight
    setTimeout(() => {
      els.knightWrapper.classList.add("animate-shake-hurt");
      // Sparks burst
      const targetRect = els.knightWrapper.getBoundingClientRect();
      const parentRect = canvas.getBoundingClientRect();
      const sparkX = targetRect.left - parentRect.left + (targetRect.width / 2);
      const sparkY = targetRect.top - parentRect.top + (targetRect.height / 2);
      spawnSparks(sparkX, sparkY, "#fbbf24"); // Glowing gold sparks
      
      setTimeout(() => els.knightWrapper.classList.remove("animate-shake-hurt"), 450);
      updateHpUI();
    }, 150);
    
    // Style Correct choice
    selectedBtn.classList.add("correct");
    
    // Dialogue Shouts
    const quote = q.knightCorrectQuote || KNIGHT_CORRECT_QUOTES[Math.floor(Math.random() * KNIGHT_CORRECT_QUOTES.length)];
    showKnightBubble(quote);
    
    // Setup Explanation Card
    els.explanTitle.innerHTML = `<i data-lucide="check-circle" style="color: var(--success); width: 18px; height: 18px;"></i> <span>Glory! Striking blow for +${dmg} DMG!</span>`;
    
  } else {
    playerHp = Math.max(0, playerHp - dmg);
    
    // Knight Counters!
    playBlockSound();
    els.knightWrapper.classList.add("animate-knight-lunge");
    setTimeout(() => els.knightWrapper.classList.remove("animate-knight-lunge"), 500);
    
    // Shield flash
    els.screenOverlay.className = "screen-fx-overlay fx-shield";
    setTimeout(() => els.screenOverlay.className = "screen-fx-overlay", 400);
    
    // Shield Block & Hurt Player
    setTimeout(() => {
      els.playerWrapper.classList.add("animate-block-shield");
      const targetRect = els.playerWrapper.getBoundingClientRect();
      const parentRect = canvas.getBoundingClientRect();
      const sparkX = targetRect.left - parentRect.left + (targetRect.width / 2);
      const sparkY = targetRect.top - parentRect.top + (targetRect.height / 2);
      spawnSparks(sparkX, sparkY, "#60a5fa"); // Protective shield blue sparks
      
      setTimeout(() => els.playerWrapper.classList.remove("animate-block-shield"), 450);
      updateHpUI();
    }, 150);
    
    // Style Correct / Incorrect choices
    selectedBtn.classList.add("incorrect");
    
    // Highlight correct option in green
    const correctIdx = q.options.findIndex(o => o.isCorrect);
    allButtons[correctIdx].classList.add("correct");
    
    // Dialogue
    const quote = q.knightIncorrectQuote || "🛡️ Shield blocked, scholar! Learn from this mistake and keep thy guard high!";
    showKnightBubble(quote);
    
    // Setup Explanation Card
    els.explanTitle.innerHTML = `<i data-lucide="alert-triangle" style="color: var(--danger); width: 18px; height: 18px;"></i> <span>Shield Blocked! Take ${dmg} DMG!</span>`;
  }
  
  // Show Explanation Card
  els.explanDesc.innerHTML = q.explanation;
  els.explanationBox.style.display = "block";
  
  // Focus next button
  els.nextBtn.onclick = () => {
    // Check game termination boundaries
    if (knightHp <= 0) {
      triggerEndGame(true); // Player won!
    } else if (playerHp <= 0) {
      triggerEndGame(false); // Knight won!
    } else {
      currentQuestionIdx++;
      renderCurrentQuestion();
    }
  };
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function triggerEndGame(isPlayerVictorious) {
  els.endOverlay.classList.add("active");
  
  const accuracy = Math.round((gameScore / (currentQuestionIdx + 1 || 1)) * 100);
  els.statAccuracy.innerText = `${accuracy}%`;
  els.statScore.innerText = `${gameScore} pts`;
  
  if (isPlayerVictorious) {
    playVictorySound();
    els.endEmoji.innerText = "👑";
    els.endTitle.innerText = "VICTORY OF RARITAN!";
    els.endDesc.innerText = `Chivalry! Sir Henry bows to thy intellectual prowess. Thou hast parried every grammar trap and conquered the SAT Reading field! Truly, a Crimson Grandmaster!`;
  } else {
    playDefeatSound();
    els.endEmoji.innerText = "🛡️";
    els.endTitle.innerText = "DEFEATED IN THE LISTS";
    els.endDesc.innerText = `Thy shield was shattered, scholar! But fear not, the grease trucks of Rutgers are ready to restore thy spirits. Rest thy muscles, review thy errors, and return to battle!`;
  }
}

async function generateAIQuestion() {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) throw new Error("No API key configured");

  const categories = [
    "Vocabulary in Context",
    "Command of Evidence",
    "Standard English Conventions",
    "Transitions & Rhetorical Synthesis"
  ];
  const chosenCategory = categories[Math.floor(Math.random() * categories.length)];

  const systemPrompt = `You are Sir Henry, the Scarlet Knight (the historic mascot of Rutgers University), an elite, high-energy academic tutor designed to prepare high schoolers for the digital SAT Reading & Writing section.
Your task is to generate a realistic, high-fidelity SAT Reading & Writing multiple-choice question inside the chosen category: "${chosenCategory}".

Generate a JSON object matching this schema:
{
  "category": "The SAT category (must be exactly: ${chosenCategory})",
  "passage": "A realistic digital SAT Reading and Writing short passage (50 to 90 words) containing appropriate syntactic complexity, grammar puzzles, or rhetorical blanks.",
  "question": "A standard SAT question prompt asking for the most logical precise word, weaken/strengthen evidence argument, standard English grammar completion, or transitions.",
  "options": [
    { "text": "Option A text", "isCorrect": false },
    { "text": "Option B text", "isCorrect": false },
    { "text": "Option C text", "isCorrect": false },
    { "text": "Option D text", "isCorrect": false }
  ],
  "explanation": "A complete, helpful academic explanation of why the correct option is right and others are wrong.",
  "knightCorrectQuote": "A custom Rutgers-themed, medieval knightly dialogue response (max 22 words) celebrating the student's correct answer (e.g., calling them 'scholar', 'valiant student', praising with Rutgers landmarks like 'Brower Commons' or 'Old Raritan').",
  "knightIncorrectQuote": "A custom Rutgers-themed, medieval knightly dialogue response (max 22 words) coaching the student on their mistake (e.g., 'Retreat is no option, scholar! Keep thy shield high!')."
}

CRITICAL RULES:
1. Exactly ONE of the options must have isCorrect set to true.
2. If the category is "Vocabulary in Context", include a blank '______' inside the passage.
3. Keep the output strictly conforming to valid JSON. Do not wrap in markdown code blocks like \\\`json ... \\\`. Return only the raw JSON string.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Gemini API error");
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  return JSON.parse(rawText);
}

// Global Hooks
window.onload = () => {
  initializeGame();
  
  if (els.restartBtn) {
    els.restartBtn.onclick = initializeGame;
  }
};
