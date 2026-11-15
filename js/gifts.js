/* ==========================================================================
   gifts.js — the Gifts page (one locked, secret gift)

   ✏️  EDIT THE GIFT CONFIG BELOW.
   Tip: {name} is replaced with the birthday boy's name (set in main.js).
   ========================================================================== */

const GIFT_CONFIG = {
  surprise: {
    // How it unlocks:
    //   "password"  → he types the secret password below
    //   "countdown" → it unlocks itself at unlockAt (e.g. midnight on his birthday)
    unlockMode: "password",

    // Used in "countdown" mode. 24h clock, in the time zone set in main.js (London): "YYYY-MM-DDTHH:MM"
    unlockAt: "2026-11-16T00:00",
    countdownText: "This one opens by itself on the big day. No peeking, grandpa.",

    // Used in "password" mode (not case-sensitive, spaces ignored)
    password: "forever23",
    hint: "What age does everyone think you are? Write it like a motto: \"forever\" + that number, no spaces.",
    // Shown in order (then repeats) on each wrong guess
    wrongMessages: [
      "Nope. Even your knees know that's wrong.",
      "Incorrect. Have you tried turning your age off and on again?",
      "Wrong! Maybe have a little nap and try again.",
      "Access denied. Please show ID. Oh wait, you look 12.",
      "Not quite. Hint: it's what everyone keeps guessing your age is.",
      "Still no. Should we call your mum for help?",
    ],

    // After this many wrong guesses the box stays shut and he gets teased instead
    giveUpAfter: 5,
    giveUpTitle: "Okay, okay…",
    giveUpText: "Five tries? Adorable. The box stays shut. The gift will be revealed at our first meetup, so you'll just have to show up and find out in person. No spoilers, old man. 😉",

    // Shown once the box opens
    revealTitle: "Surprise!",
    revealText: "The gift is a secret. You'll have to come and find out in person, old man. No spoilers.",
  },
};

/* ==========================================================================
   Logic — no need to edit below this line
   ========================================================================== */
(function () {
  "use strict";

  const B = window.Bday;
  const stage = document.getElementById("secret-stage");
  if (!B || !stage) return;

  const sb = GIFT_CONFIG.surprise;

  // The locked box: a white box with a violet ribbon and a small violet padlock.
  // Colours match css/style.css.
  function boxSVG() {
    const ivory = "#FFFFFF", ivoryDeep = "#F3E8FF", line = "#C9B1F2", gold = "#8B5CF6", ink = "#4C1D7A";
    return '<svg class="gift-svg" viewBox="0 0 240 250" aria-hidden="true" focusable="false">' +
      '<ellipse cx="120" cy="240" rx="80" ry="5" fill="' + ink + '" opacity="0.08"/>' +
      '<g class="gift-body">' +
        '<rect x="40" y="112" width="160" height="118" rx="12" fill="' + ivory + '" stroke="' + line + '"/>' +
        '<rect x="40" y="112" width="160" height="10" fill="' + ivoryDeep + '"/>' +
        '<rect x="110" y="112" width="20" height="118" fill="' + gold + '"/>' +
        '<rect x="110" y="112" width="20" height="10" fill="' + gold + '" opacity="0.85"/>' +
      "</g>" +
      '<g class="gift-lid">' +
        '<rect x="30" y="84" width="180" height="30" rx="10" fill="' + ivory + '" stroke="' + line + '"/>' +
        '<rect x="110" y="84" width="20" height="30" fill="' + gold + '"/>' +
        '<path fill="none" stroke="' + gold + '" stroke-width="7" stroke-linejoin="round" d="M120 84 C100 60 70 62 84 80 C94 90 110 88 120 84 Z"/>' +
        '<path fill="none" stroke="' + gold + '" stroke-width="7" stroke-linejoin="round" d="M120 84 C140 60 170 62 156 80 C146 90 130 88 120 84 Z"/>' +
        '<circle cx="120" cy="84" r="6" fill="' + gold + '"/>' +
      "</g>" +
      '<g class="gift-lock">' +
        '<path fill="none" stroke="' + gold + '" stroke-width="5" stroke-linecap="round" d="M106 160 L106 148 C106 128 134 128 134 148 L134 160"/>' +
        '<rect x="96" y="158" width="48" height="40" rx="10" fill="' + gold + '"/>' +
        '<circle cx="120" cy="174" r="5" fill="' + ivory + '"/><rect x="118" y="176" width="4" height="11" rx="2" fill="' + ivory + '"/>' +
      "</g>" +
      "</svg>";
  }

  /* ---------- Render ---------- */
  stage.innerHTML =
    '<div class="gift reveal">' +
      '<button class="gift-box is-locked" type="button" id="surprise-box" aria-describedby="unlock-title">' +
        boxSVG() +
        '<span class="gift-label">A secret</span>' +
        '<span class="gift-sub">Locked</span>' +
      "</button>" +
    "</div>";
  B.observeReveal(stage);

  /* ---------- Surprise gift ---------- */
  const surpriseBox = document.getElementById("surprise-box");
  const form = document.getElementById("unlock-form");
  const input = document.getElementById("secret");
  const msg = document.getElementById("unlock-msg");
  const hintBtn = document.getElementById("hint-btn");
  const hint = document.getElementById("hint");
  const reveal = document.getElementById("surprise-reveal");
  const cdPanel = document.getElementById("unlock-countdown");
  if (!surpriseBox || !form) return;

  const countdownMode = sb.unlockMode === "countdown";
  let attempts = 0;
  let unlocked = false;
  let gaveUp = false;

  reveal.querySelector(".surprise-title").textContent = B.fill(sb.revealTitle);
  reveal.querySelector(".surprise-text").textContent = B.fill(sb.revealText);

  function shake(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, 600);
  }

  const panelTitle = document.getElementById("unlock-title");
  const panelKicker = document.querySelector("#unlock-panel .card-kicker");

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    form.hidden = true;
    if (panelTitle) panelTitle.hidden = true;
    if (panelKicker) panelKicker.textContent = "Unlocked";
    if (cdPanel) cdPanel.hidden = true;
    stage.classList.add("is-unlocked");
    surpriseBox.classList.remove("is-locked");
    surpriseBox.classList.add("is-unlocked");
    surpriseBox.querySelector(".gift-label").textContent = "Opened";
    surpriseBox.querySelector(".gift-sub").textContent = "Unlocked";
    surpriseBox.setAttribute("aria-label", "Surprise gift, unlocked");
    setTimeout(function () {
      surpriseBox.classList.add("is-open");
    }, B.reduceMotion ? 0 : 600);

    reveal.hidden = false;
    reveal.querySelector(".surprise-title").focus();

    B.confettiFrom(surpriseBox, 110);
  }

  /* ----- Countdown mode ----- */
  if (countdownMode) {
    form.hidden = true;
    const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(sb.unlockAt || "");
    const target = m ? B.zonedFromString(m[1], m[2]) : null;
    if (!target || isNaN(target.getTime())) {
      // Misconfigured date: fail open so the surprise is never lost
      unlock();
      return;
    }
    cdPanel.hidden = false;
    cdPanel.querySelector(".unlock-countdown-text").textContent = B.fill(sb.countdownText);
    surpriseBox.setAttribute("aria-label", "Surprise gift, locked until " + target.toLocaleString());
    B.runCountdown(cdPanel.querySelector(".countdown"), target, null, unlock);

    surpriseBox.addEventListener("click", function () {
      if (unlocked) {
        reveal.querySelector(".surprise-title").focus();
        return;
      }
      shake(surpriseBox, "is-shaking");
      B.toast("Patience! It opens on the big day.");
      cdPanel.scrollIntoView({ behavior: B.reduceMotion ? "auto" : "smooth", block: "center" });
    });
    return;
  }

  /* ----- Password mode ----- */
  surpriseBox.setAttribute("aria-label", "Surprise gift, locked. Enter the secret password to unlock it.");
  hint.textContent = B.fill(sb.hint);

  function giveUp() {
    gaveUp = true;
    form.hidden = true;
    if (panelTitle) panelTitle.hidden = true;
    if (panelKicker) panelKicker.textContent = "Still locked";
    surpriseBox.querySelector(".gift-label").textContent = "Still a secret";
    surpriseBox.querySelector(".gift-sub").textContent = "See you soon";
    surpriseBox.setAttribute("aria-label", "Surprise gift, still locked. It will be revealed in person.");
    reveal.querySelector(".surprise-title").textContent = B.fill(sb.giveUpTitle);
    reveal.querySelector(".surprise-text").textContent = B.fill(sb.giveUpText);
    reveal.hidden = false;
    reveal.querySelector(".surprise-title").focus();
    shake(surpriseBox, "is-shaking");
  }

  function showHint() {
    hint.hidden = false;
    hintBtn.setAttribute("aria-expanded", "true");
  }

  function normalise(s) {
    return String(s).toLowerCase().replace(/\s+/g, "");
  }

  surpriseBox.addEventListener("click", function () {
    if (unlocked || gaveUp) {
      reveal.querySelector(".surprise-title").focus();
      if (gaveUp) {
        shake(surpriseBox, "is-shaking");
        B.toast("Nice try. First meetup. 😏");
      }
      return;
    }
    shake(surpriseBox, "is-shaking");
    msg.textContent = "It's locked! Type the secret password below.";
    input.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: B.reduceMotion ? "auto" : "smooth", block: "center" });
  });

  hintBtn.addEventListener("click", function () {
    if (hint.hidden) showHint();
    else {
      hint.hidden = true;
      hintBtn.setAttribute("aria-expanded", "false");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const guess = normalise(input.value);
    if (!guess) {
      msg.textContent = "You have to actually type something, old timer.";
      shake(msg, "is-wrong");
      input.focus();
      return;
    }
    if (guess === normalise(sb.password)) {
      unlock();
      return;
    }
    msg.textContent = B.fill(sb.wrongMessages[attempts % sb.wrongMessages.length]);
    attempts++;
    shake(msg, "is-wrong");
    shake(surpriseBox, "is-shaking");
    if (sb.giveUpAfter && attempts >= sb.giveUpAfter) {
      giveUp();
      return;
    }
    if (attempts === 3 && hint.hidden) {
      showHint();
      msg.textContent += " Fine, here's a hint.";
    }
    input.select();
  });
})();
