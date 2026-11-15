/* ==========================================================================
   main.js — shared on every page (nav, music, confetti, countdown,
   home page, wishes page). The fold-open card lives in card.js.

   ✏️  EDIT THE "SITE" CONFIG BELOW. You shouldn't need to touch anything
       under the "Logic" line.

   Tip: anywhere you write {name} it is replaced with the birthday boy's name.
   ========================================================================== */

const SITE = {
  // The birthday legend
  name: "Sweetu",
  scannerName: "Nuwantha",
  age: 33,
  looksAge: 22,

  // The big day (YYYY-MM-DD). Used for the countdown on the home page.
  birthday: "2026-11-16",
  // Midnight in THIS time zone is when the birthday starts, wherever he opens the site
  timeZone: "Europe/London",

  // You! Shown in the footer and at the end of the letter
  fromName: "Your Name",

  // Photo shown on the ID card in the age scanner. If the file is missing,
  // a stylish silhouette is shown instead.
  scanPhoto: "assets/photos/scan.JPG",

  // Background music (optional). Drop an mp3 at this path. If it's missing,
  // the music button just shows a friendly message instead of breaking.
  musicFile: "assets/music/song.mp3",

  // ---- HOME: countdown messages -----------------------------------------
  countdown: {
    before: "The birthday has officially started. Please ignore the dramatic pause and proceed directly to cake.",
    today: "The birthday has officially started. Please ignore the dramatic pause and proceed directly to cake.",
    after: "The birthday has officially started. Please ignore the dramatic pause and proceed directly to cake.",
  },

  // ---- HOME: the fake age-verification scanner ---------------------------
  scanSteps: [
    "Locating face…",
    "Scanning for wrinkles… 0 found. Recalibrating…",
    "Checking ID… it says 33?!",
    "Comparing face to ID… does not compute",
    "Consulting the elders…",
  ],
  scanError: "ERROR: face does not match records.",
  scanResult: "Result: 33. Appearance: 22. System confused.",
  scanStamp: "Mismatch",

  // ---- HOME: the very scientific chart ----------------------------------
  ageChart: [
    { label: "Actual age (according to paperwork)", value: 33 },
    { label: "Age he looks", value: 22 },
    { label: "Age he acts when dessert arrives", value: 9 },
    { label: "Age his knees report", value: 58 },
  ],

  // ---- WISHES: tap-to-flip notes -----------------------------------------
  // tag = word on the front of the card (e.g. "Sweet", "Roast")
  // Add or remove as many as you like.
  wishes: [
    { tag: "Sweet", text: "Happy birthday! 😄 May this year be as kind to you as time has clearly been to your face." },
    { tag: "Roast", text: "Congrats on 33 years of practice. You're almost a professional adult now. 😌" },
    { tag: "Roast", text: "I hope you get asked for ID at least three times this year. You've earned the confusion. 😆" },
    { tag: "Sweet", text: "Thank you for being the person who makes every room louder, warmer and funnier. 😊" },
    { tag: "Roast", text: "May your back never crack louder than your laugh. 😵‍💫" },
    { tag: "Sweet", text: "Wishing you a year of great food, long naps, and zero group-chat drama. 😍" },
    { tag: "Roast", text: "33 is just 23 with better taste and very strong opinions about lumbar support. 🤭" },
    { tag: "Sweet", text: "Wishing you a year full of peace, laughter, and a love story that feels right when it arrives. 🥳" },
  ],

  // ---- WISHES: the long heartfelt letter at the bottom -------------------
  letter: {
    greeting: "Dear {name},",
    paragraphs: [
      "Thirty-three. I've checked the maths three times and I still don't believe it, because somehow you look younger than your age and somehow even more charming. Whatever deal you made with time, I hope the fine print is reasonable.",
      "But beneath all the jokes, what stands out most is who you are. Your innocence, your decency, your quiet consistency, and the way you communicate with such comfort and honesty are rare qualities. You make conversations feel easy, you listen without judging, and you remember small things that make people feel seen.",
      "That kind of presence is a gift. I admire the way you carry yourself, the way you make people feel at ease, and the calm sincerity that makes you easy to trust. I hope this year brings you the kind of happiness that matches your heart and the kind of love that feels natural, gentle, and truly right for you.",
      "Happy birthday. May this year be full of peace, laughter, meaningful moments, and the beautiful kind of love that finds you when it should.",
    ],
    signoff: "With warm wishes and heartfelt admiration,",
  },
};

/* ==========================================================================
   Logic — no need to edit below this line
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Small helpers ---------- */
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function fill(str, extra) {
    let out = String(str == null ? "" : str)
      .replace(/\{name\}/g, SITE.name)
      .replace(/\{age\}/g, SITE.age)
      .replace(/\{from\}/g, SITE.fromName);
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        out = out.replace(new RegExp("\\{" + k + "\\}", "g"), extra[k]);
      });
    }
    return out;
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function store(key, value) {
    try {
      if (value === undefined) return window.sessionStorage.getItem(key);
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, value);
    } catch (e) { /* storage blocked: ignore */ }
    return null;
  }

  /* ---------- Colours (kept in step with css/style.css) ---------- */
  const COLORS = {
    violet: "#8B5CF6", lilac: "#C4B5FD", orchid: "#D946EF", plum: "#4C1D7A", white: "#FFFFFF", pink: "#F0ABFC",
  };

  /* ---------- Fill in names / ages ---------- */
  function bindText() {
    document.querySelectorAll("[data-name]").forEach(function (el) { el.textContent = SITE.name; });
    document.querySelectorAll("[data-scanner-name]").forEach(function (el) { el.textContent = SITE.scannerName; });
    document.querySelectorAll("[data-from]").forEach(function (el) { el.textContent = SITE.fromName; });
    document.querySelectorAll("[data-age]").forEach(function (el) { el.textContent = SITE.age; });
    document.querySelectorAll("[data-ordinal]").forEach(function (el) { el.textContent = ordinal(SITE.age); });
    const bd = localDate(SITE.birthday);
    document.querySelectorAll("[data-dob]").forEach(function (el) {
      el.textContent = bd ? bd.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " · year classified" : "classified";
    });
    document.title = document.title.replace("Happy 33rd Birthday!", "Happy " + ordinal(SITE.age) + " Birthday, " + SITE.name + "!");
  }

  /* ---------- Scroll reveal ---------- */
  let io = null;
  function observeReveal(root) {
    const els = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    }
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Nav ---------- */
  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      links.classList.toggle("is-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Toast ---------- */
  let toastEl = null;
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3800);
  }

  /* ---------- Music ---------- */
  function setupMusic() {
    const btn = document.querySelector("[data-music-toggle]");
    if (!btn) return;
    const label = btn.querySelector(".music-label");
    let audio = null;
    let playing = false;
    let missing = false;

    function render() {
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      if (label) label.textContent = playing ? "Music on" : "Music off";
    }

    function getAudio() {
      if (audio) return audio;
      audio = new Audio(SITE.musicFile);
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = "auto";
      audio.addEventListener("error", function () {
        missing = true;
        playing = false;
        render();
        store("bday-music", null);
        toast("No song found yet. Add one at " + SITE.musicFile + " 🎵");
      });
      return audio;
    }

    function play(silentFail) {
      if (missing) {
        toast("No song found yet. Add one at " + SITE.musicFile + " 🎵");
        return;
      }
      const a = getAudio();
      const t = parseFloat(store("bday-music-time"));
      if (t && !a.currentTime) {
        try { a.currentTime = t; } catch (e) { /* not seekable yet */ }
      }
      const p = a.play();
      if (p && p.then) {
        p.then(function () {
          playing = true;
          render();
          store("bday-music", "1");
        }).catch(function (err) {
          playing = false;
          render();
          if (!silentFail && !missing && err && err.name === "NotAllowedError") {
            toast("Your browser blocked the music. Tap the button again!");
          }
        });
      } else {
        playing = true;
        render();
      }
    }

    btn.addEventListener("click", function () {
      if (playing) {
        audio.pause();
        playing = false;
        render();
        store("bday-music", null);
      } else {
        play(false);
      }
    });

    // The birthday card can pause the background music while it sings
    let pausedByCard = false;
    window.Bday.pauseMusic = function () {
      if (playing && audio) {
        audio.pause();
        playing = false;
        pausedByCard = true;
        render();
      }
    };
    window.Bday.resumeMusic = function () {
      if (!pausedByCard) return;
      pausedByCard = false;
      play(true);
    };

    // Keep the song going (roughly) when moving between pages
    window.addEventListener("pagehide", function () {
      if (audio && playing) store("bday-music-time", String(audio.currentTime));
    });
    if (store("bday-music") === "1") play(true);
    render();
  }

  /* ---------- Confetti (purples and a little pink) ---------- */
  const CONFETTI_COLORS = [COLORS.violet, COLORS.lilac, COLORS.orchid, COLORS.plum, COLORS.white, COLORS.pink];
  let cCanvas = null;
  let cCtx = null;
  let cW = 0;
  let cH = 0;
  let cParticles = [];
  let cRunning = false;

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cW = window.innerWidth;
    cH = window.innerHeight;
    cCanvas.width = Math.round(cW * dpr);
    cCanvas.height = Math.round(cH * dpr);
    cCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // opts: { count, x, y } — x/y are 0–1 fractions of the viewport
  function confetti(opts) {
    if (reduceMotion) return;
    opts = opts || {};
    if (!cCanvas) {
      cCanvas = document.createElement("canvas");
      cCanvas.className = "confetti-canvas";
      cCanvas.setAttribute("aria-hidden", "true");
      cCtx = cCanvas.getContext("2d");
      if (!cCtx) { cCanvas = null; return; }
      document.body.appendChild(cCanvas);
      sizeCanvas();
      window.addEventListener("resize", sizeCanvas);
    }
    const count = opts.count || 120;
    const ox = (opts.x != null ? opts.x : 0.5) * cW;
    const oy = (opts.y != null ? opts.y : 0.45) * cH;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const speed = 5 + Math.random() * 10;
      const r = Math.random();
      cParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * 10,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        shape: r < 0.33 ? "circle" : r < 0.66 ? "strip" : "square",
        life: 0,
      });
    }
    if (!cRunning) {
      cRunning = true;
      requestAnimationFrame(tick);
    }
  }

  function confettiFrom(el, count) {
    if (!el) return confetti({ count: count });
    const rect = el.getBoundingClientRect();
    confetti({
      count: count,
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
  }

  function tick() {
    cCtx.clearRect(0, 0, cW, cH);
    for (let i = cParticles.length - 1; i >= 0; i--) {
      const p = cParticles[i];
      p.life++;
      p.vx *= 0.98;
      p.vy = Math.min(p.vy + 0.25, 4.5);
      p.wobble += 0.12;
      p.x += p.vx + Math.sin(p.wobble) * 0.8;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > cH + 30 || p.life > 420) {
        cParticles.splice(i, 1);
        continue;
      }
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rot);
      cCtx.globalAlpha = p.life > 300 ? 1 - (p.life - 300) / 120 : 1;
      cCtx.fillStyle = p.color;
      if (p.shape === "circle") {
        cCtx.beginPath();
        cCtx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        cCtx.fill();
      } else if (p.shape === "strip") {
        cCtx.fillRect(-p.size / 2, -1.5, p.size, 3);
      } else {
        cCtx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.5);
      }
      cCtx.restore();
    }
    if (cParticles.length) {
      requestAnimationFrame(tick);
    } else {
      cRunning = false;
      cCtx.clearRect(0, 0, cW, cH);
    }
  }

  /* ---------- Countdown (shared by home + gifts) ---------- */
  // Renders live tiles into `tilesEl` counting down to `target` (a Date).
  // Calls onDone() once when the moment arrives. Returns a stop() function.
  function runCountdown(tilesEl, target, onTick, onDone) {
    const labels = ["Days", "Hours", "Mins", "Secs"];
    tilesEl.innerHTML = labels.map(function (l) {
      return '<div class="count-tile"><span class="count-num">00</span><span class="count-label">' + l + "</span></div>";
    }).join("");
    const nums = tilesEl.querySelectorAll(".count-num");
    let done = false;
    let timer = null;

    function update() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        nums.forEach(function (n) { n.textContent = "00"; });
        if (!done) { done = true; if (onDone) onDone(); }
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
      parts.forEach(function (v, i) { nums[i].textContent = pad(v); });
      if (onTick) onTick(parts);
    }
    update();
    timer = setInterval(update, 1000);
    return function () { clearInterval(timer); };
  }

  // "YYYY-MM-DD" → local midnight Date (used only for displaying the date)
  function localDate(ymd) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd || "");
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], 0, 0, 0, 0);
  }

  // Offset (ms) between UTC and the given IANA time zone at instant `ts`
  function tzOffsetMs(ts, tz) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const p = {};
    dtf.formatToParts(new Date(ts)).forEach(function (part) { p[part.type] = part.value; });
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return asUtc - Math.floor(ts / 1000) * 1000;
  }

  // Wall-clock time (y, m, d, h, mi) in SITE.timeZone → the real instant as a Date.
  // Falls back to the viewer's local time if the browser can't do time zones.
  function zonedDate(y, mo, d, h, mi) {
    const tz = SITE.timeZone;
    if (tz) {
      try {
        let utc = Date.UTC(y, mo - 1, d, h, mi, 0);
        utc -= tzOffsetMs(utc, tz);
        utc = Date.UTC(y, mo - 1, d, h, mi, 0) - tzOffsetMs(utc, tz); // settle across a DST switch
        return new Date(utc);
      } catch (e) { /* unsupported zone: fall through */ }
    }
    return new Date(y, mo - 1, d, h, mi, 0, 0);
  }

  // "YYYY-MM-DD" (+ optional "HH:MM") → Date in SITE.timeZone
  function zonedFromString(ymd, hm) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd || "");
    if (!m) return null;
    const t = /^(\d{2}):(\d{2})$/.exec(hm || "00:00") || ["", "0", "0"];
    return zonedDate(+m[1], +m[2], +m[3], +t[1], +t[2]);
  }

  function setupHomeCountdown() {
    const card = document.getElementById("countdown-card");
    if (!card) return;
    const tiles = card.querySelector(".countdown");
    const msg = card.querySelector(".countdown-msg");
    if (!msg) return;

    card.classList.add("is-today");
    if (tiles) tiles.innerHTML = "";
    msg.textContent = fill(SITE.countdown.before);
  }

  /* ---------- HOME: ID-card age scanner ---------- */
  function setupScanner() {
    const root = document.getElementById("age-scanner");
    if (!root) return;
    const btn = root.querySelector(".scan-btn");
    const bar = root.querySelector(".progress");
    const fillEl = root.querySelector(".progress-fill");
    const status = root.querySelector(".scan-status");
    const result = root.querySelector(".scan-result");
    const detected = root.querySelector(".detected");
    const stamp = root.querySelector(".stamp");
    const photoWrap = root.querySelector(".idcard-photo");
    const photo = root.querySelector("[data-scan-photo]");
    let running = false;
    let flicker = null;

    if (stamp) stamp.textContent = fill(SITE.scanStamp);

    // Load his real photo onto the ID card; keep the silhouette if it's missing
    if (photo && SITE.scanPhoto) {
      photo.addEventListener("load", function () { photoWrap.classList.add("has-photo"); });
      photo.addEventListener("error", function () { photoWrap.classList.remove("has-photo"); });
      photo.src = SITE.scanPhoto;
    }

    function setProgress(p) {
      fillEl.style.width = p + "%";
      bar.setAttribute("aria-valuenow", String(p));
    }

    btn.addEventListener("click", function () {
      if (running) return;
      running = true;
      btn.disabled = true;
      root.classList.remove("is-error");
      root.classList.add("is-scanning");
      result.hidden = true;
      setProgress(0);

      // Flicker the detected age while "thinking"
      if (detected && !reduceMotion) {
        flicker = setInterval(function () {
          detected.textContent = String(18 + Math.floor(Math.random() * 60));
        }, 110);
      }

      const steps = SITE.scanSteps.map(function (s) { return fill(s); });
      const stepMs = reduceMotion ? 600 : 1100;
      let i = 0;

      (function next() {
        if (i < steps.length) {
          status.textContent = steps[i];
          setProgress(Math.round(((i + 1) / (steps.length + 1)) * 100));
          i++;
          setTimeout(next, stepMs);
          return;
        }
        clearInterval(flicker);
        if (detected) detected.textContent = String(SITE.looksAge);
        setProgress(100);
        root.classList.remove("is-scanning");
        root.classList.add("is-error");
        status.textContent = fill(SITE.scanError);
        result.textContent = fill(SITE.scanResult);
        result.hidden = false;
        btn.disabled = false;
        btn.textContent = "Scan again (it won't help)";
        running = false;
      })();
    });
  }

  /* ---------- HOME: age chart ---------- */
  function renderChart() {
    const chart = document.getElementById("age-chart");
    if (!chart) return;
    const max = Math.max.apply(null, SITE.ageChart.map(function (r) { return r.value; })) * 1.1;
    chart.innerHTML = SITE.ageChart.map(function (row) {
      return '<li class="bar-row">' +
        '<span class="bar-label">' + esc(fill(row.label)) + "</span>" +
        '<span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--w:' + ((row.value / max) * 100).toFixed(1) + '%"></span></span>' +
        '<span class="bar-value">' + esc(row.value) + "</span>" +
        "</li>";
    }).join("");
  }

  /* ---------- WISHES: flip cards + letter ---------- */
  function roman(n) {
    const map = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    map.forEach(function (pair) {
      while (n >= pair[0]) { out += pair[1]; n -= pair[0]; }
    });
    return out;
  }

  function renderWishes() {
    const grid = document.getElementById("wish-grid");
    if (!grid) return;
    grid.innerHTML = SITE.wishes.map(function (w, i) {
      return '<li class="wish reveal" style="--stagger:' + (i % 4) + '">' +
        '<button class="wish-card" type="button" aria-expanded="false">' +
          '<span class="wish-inner">' +
            '<span class="wish-face wish-front">' +
              '<span class="wish-num">No. ' + roman(i + 1) + "</span>" +
              '<span class="wish-tag">' + esc(fill(w.tag)) + "</span>" +
              '<span class="wish-hint">Tap to open</span>' +
            "</span>" +
            '<span class="wish-face wish-back" aria-hidden="true">' +
              '<span class="wish-text">' + esc(fill(w.text)) + "</span>" +
            "</span>" +
          "</span>" +
        "</button></li>";
    }).join("");

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".wish-card");
      if (!card) return;
      const open = !card.classList.contains("is-flipped");
      card.classList.toggle("is-flipped", open);
      card.setAttribute("aria-expanded", open ? "true" : "false");
      card.querySelector(".wish-front").setAttribute("aria-hidden", open ? "true" : "false");
      card.querySelector(".wish-back").setAttribute("aria-hidden", open ? "false" : "true");
    });
  }

  function renderLetter() {
    const letter = document.getElementById("letter");
    if (!letter) return;
    const L = SITE.letter;
    letter.querySelector(".letter-greeting").textContent = fill(L.greeting);
    letter.querySelector(".letter-body").innerHTML = L.paragraphs.map(function (p) {
      return "<p>" + esc(fill(p)) + "</p>";
    }).join("");
    letter.querySelector(".letter-signoff").textContent = fill(L.signoff);
  }

  /* ---------- Boot ---------- */
  function init() {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);

    bindText();
    renderChart();
    renderWishes();
    renderLetter();
    setupNav();
    setupMusic();
    setupHomeCountdown();
    setupScanner();
    observeReveal();
  }

  // Shared API for gifts.js and gallery.js
  window.Bday = {
    SITE: SITE,
    COLORS: COLORS,
    reduceMotion: reduceMotion,
    fill: fill,
    esc: esc,
    confetti: confetti,
    confettiFrom: confettiFrom,
    toast: toast,
    observeReveal: observeReveal,
    runCountdown: runCountdown,
    zonedFromString: zonedFromString,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
