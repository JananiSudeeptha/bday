/* ==========================================================================
   card.js — the fold-open birthday card on the Wishes page

   ✏️  EDIT THE CARD CONFIG BELOW.
   Tip: {name} is replaced with the birthday boy's name (set in main.js).
   ========================================================================== */

const CARD_CONFIG = {
  coverTitle: "For {name}",
  coverSub: "Tap to open",

  // The bunting inside the card: one letter per flag (spaces make a gap)
  banner: "HAPPY BIRTHDAY",

  title: "Happy Birthday, {name}!",
  message: "Thirty-three laps around the sun and not a single wrinkle to show for it. Save the date below. It's a big one.",

  // Optional recording. If this file is missing, the site plays its own
  // little "Happy Birthday" tune instead, so nothing breaks.
  song: "assets/music/happy-birthday.mp3",
};

/* ==========================================================================
   Logic — no need to edit below this line
   ========================================================================== */
(function () {
  "use strict";

  const B = window.Bday;
  const card = document.getElementById("bcard");
  if (!B || !card) return;

  const C = CARD_CONFIG;
  const cover = card.querySelector(".bcard-cover");
  const inside = card.querySelector(".bcard-inside");
  const closeBtn = card.querySelector("[data-card-close]");
  const replayBtn = card.querySelector("[data-song-replay]");

  /* ---------- Text ---------- */
  card.querySelector(".bcard-cover-title").textContent = B.fill(C.coverTitle);
  card.querySelector(".bcard-cover-sub").textContent = B.fill(C.coverSub);
  card.querySelector(".bcard-title").textContent = B.fill(C.title);
  card.querySelector(".bcard-msg").textContent = B.fill(C.message);

  /* ---------- Bunting: one letter per flag on a sagging rope ---------- */
  function renderBanner() {
    const host = card.querySelector(".banner");
    if (!host) return;
    const letters = Array.from(B.fill(C.banner));
    const W = 600, H = 120;
    const p0 = { x: 0, y: 14 }, p1 = { x: W / 2, y: 70 }, p2 = { x: W, y: 14 }; // quadratic rope
    function pt(t) {
      const u = 1 - t;
      return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
      };
    }
    function angle(t) {
      const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
      return (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    const fills = ["#A855F7", "#7C3AED", "#C084FC", "#8B5CF6", "#D946EF"];
    const n = letters.length;
    let flags = "";
    let k = 0;
    letters.forEach(function (ch, i) {
      if (ch === " ") return;
      const t = (i + 0.5) / n;
      const p = pt(t);
      const a = angle(t) * 0.6;
      const w = Math.min(44, (W / n) * 0.92);
      const h = w * 1.25;
      flags +=
        '<g transform="translate(' + p.x.toFixed(1) + " " + p.y.toFixed(1) + ") rotate(" + a.toFixed(1) + ')">' +
          '<g class="flag" style="--d:' + (k * 0.18).toFixed(2) + 's">' +
            '<path d="M' + (-w / 2) + " 0 L" + (w / 2) + " 0 L0 " + h.toFixed(1) + ' Z" fill="' + fills[k % fills.length] + '"/>' +
            '<text x="0" y="' + (h * 0.44).toFixed(1) + '" text-anchor="middle" font-size="' + (w * 0.6).toFixed(1) + '">' + B.esc(ch) + "</text>" +
          "</g>" +
        "</g>";
      k++;
    });
    host.innerHTML =
      '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true" focusable="false">' +
        '<path d="M' + p0.x + " " + p0.y + " Q" + p1.x + " " + p1.y + " " + p2.x + " " + p2.y + '" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/>' +
        flags +
      "</svg>";
  }

  /* ---------- Calendar for the birthday month, with a heart on the day ---------- */
  function renderCalendar() {
    const host = card.querySelector(".calendar");
    if (!host) return;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(B.SITE.birthday || "");
    if (!m) { host.hidden = true; return; }
    const year = +m[1], month = +m[2] - 1, day = +m[3];
    const monthName = new Date(year, month, 1).toLocaleDateString(undefined, { month: "long" });
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const days = new Date(year, month + 1, 0).getDate();
    const dows = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    let cells = dows.map(function (d) { return '<span class="cal-dow">' + d + "</span>"; }).join("");
    for (let i = 0; i < firstDow; i++) cells += '<span class="cal-day is-empty"></span>';
    for (let d = 1; d <= days; d++) {
      if (d === day) {
        cells += '<span class="cal-day is-bday" aria-label="' + d + ' ' + monthName + ', the birthday"><span class="cal-heart" aria-hidden="true">💜</span></span>';
      } else {
        cells += '<span class="cal-day">' + d + "</span>";
      }
    }
    host.innerHTML =
      '<p class="cal-head">' + B.esc(monthName) + " " + year + "</p>" +
      '<div class="cal-grid">' + cells + "</div>";
  }

  /* ---------- Cover illustration ----------
     Simple flat graphics: a two-tier cake with number candles for his age,
     three balloons, confetti and a little laptop. All SVG, no image files. */
  function flame(x, y, delay) {
    return '<g class="art-flame" style="--d:' + delay + 's">' +
      '<path d="M' + x + " " + (y - 26) + " C" + (x + 12) + " " + (y - 12) + " " + (x + 9) + " " + y + " " + x + " " + y + " C" + (x - 9) + " " + y + " " + (x - 12) + " " + (y - 12) + " " + x + " " + (y - 26) + ' Z" fill="#FDE68A"/>' +
      '<path d="M' + x + " " + (y - 14) + " C" + (x + 5) + " " + (y - 7) + " " + (x + 4) + " " + y + " " + x + " " + y + " C" + (x - 4) + " " + y + " " + (x - 5) + " " + (y - 7) + " " + x + " " + (y - 14) + ' Z" fill="#F59E0B"/>' +
      "</g>";
  }
  function balloon(cx, cy, fill, delay, sx, sy) {
    return '<g class="art-balloon" style="--d:' + delay + 's">' +
      '<path d="M' + cx + " " + (cy + 36) + " Q" + (cx - 18) + " " + ((cy + 36 + sy) / 2) + " " + sx + " " + sy + '" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="27" ry="33" fill="' + fill + '"/>' +
      '<path d="M' + (cx - 6) + " " + (cy + 31) + " L" + (cx + 6) + " " + (cy + 31) + " L" + cx + " " + (cy + 39) + ' Z" fill="' + fill + '"/>' +
      '<ellipse cx="' + (cx - 10) + '" cy="' + (cy - 13) + '" rx="5" ry="10" fill="#FFFFFF" opacity="0.5" transform="rotate(22 ' + (cx - 10) + " " + (cy - 13) + ')"/>' +
      "</g>";
  }
  function confetti(x, y, w, h, rot, fill, delay) {
    return '<rect class="art-confetti" style="--d:' + delay + 's" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (Math.min(w, h) / 2) + '" fill="' + fill + '" transform="rotate(' + rot + " " + x + " " + y + ')"/>';
  }
  function dot(x, y, r, fill, delay) {
    return '<circle class="art-confetti" style="--d:' + (delay || 0) + 's" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"/>';
  }
  function spark(cx, cy, r, fill) {
    return '<path d="M' + cx + " " + (cy - r) + " Q" + cx + " " + cy + " " + (cx + r) + " " + cy + " Q" + cx + " " + cy + " " + cx + " " + (cy + r) + " Q" + cx + " " + cy + " " + (cx - r) + " " + cy + " Q" + cx + " " + cy + " " + cx + " " + (cy - r) + ' Z" fill="' + fill + '"/>';
  }

  function renderCoverArt() {
    const host = card.querySelector(".bcard-cover-art");
    if (!host) return;
    const white = "#FFFFFF", cream = "#F5F3FF", pink = "#F0ABFC", lilac = "#C4B5FD", gold = "#FDE68A", plum = "#4C1D95";
    const age = String(B.SITE.age);

    const art =
      // soft disc behind everything
      '<circle cx="200" cy="200" r="150" fill="#FFFFFF" opacity="0.1"/>' +
      // balloons
      balloon(72, 86, pink, 0, 118, 230) + balloon(330, 64, lilac, -1.4, 290, 220) + balloon(352, 134, white, -2.3, 300, 236) +
      // plate
      '<ellipse cx="200" cy="318" rx="128" ry="12" fill="' + plum + '" opacity="0.25"/>' +
      '<ellipse cx="200" cy="312" rx="120" ry="12" fill="' + white + '"/>' +
      // bottom tier with drips
      '<rect x="100" y="246" width="200" height="68" rx="16" fill="' + cream + '"/>' +
      '<path d="M100 262 Q100 246 116 246 L284 246 Q300 246 300 262 L300 270 Q290 270 290 284 Q280 284 280 270 Q270 270 270 282 Q262 282 262 270 L238 270 Q238 288 226 288 Q214 288 214 270 L186 270 Q186 284 174 284 Q162 284 162 270 L138 270 Q138 286 126 286 Q114 286 114 270 L112 270 Q112 280 106 280 Q100 280 100 270 Z" fill="' + pink + '"/>' +
      '<g fill="' + lilac + '"><circle cx="126" cy="300" r="4"/><circle cx="156" cy="300" r="4"/><circle cx="186" cy="300" r="4"/><circle cx="216" cy="300" r="4"/><circle cx="246" cy="300" r="4"/><circle cx="276" cy="300" r="4"/></g>' +
      // top tier with drips
      '<rect x="132" y="194" width="136" height="56" rx="14" fill="' + white + '"/>' +
      '<path d="M132 208 Q132 194 146 194 L254 194 Q268 194 268 208 L268 214 Q260 214 260 226 Q252 226 252 214 L232 214 Q232 230 222 230 Q212 230 212 214 L188 214 Q188 228 178 228 Q168 228 168 214 L148 214 Q148 226 140 226 Q132 226 132 214 Z" fill="' + lilac + '"/>' +
      // number candles
      '<text x="200" y="186" text-anchor="middle" font-family="Quicksand, Nunito, sans-serif" font-weight="700" font-size="64" fill="' + gold + '" letter-spacing="2">' + B.esc(age) + "</text>" +
      flame(176, 128, 0) + flame(224, 128, -0.6) +
      // little laptop beside the plate
      '<rect x="24" y="268" width="58" height="38" rx="5" fill="' + white + '"/>' +
      '<rect x="30" y="274" width="46" height="26" rx="2" fill="' + lilac + '"/>' +
      '<path d="M44 283 l -6 4 6 4 M62 283 l 6 4 -6 4 M56 280 l -6 14" fill="none" stroke="' + plum + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="16" y="306" width="74" height="7" rx="3.5" fill="' + white + '"/>' +
      // confetti + sparks
      confetti(150, 60, 14, 6, 25, gold, 0) + confetti(250, 40, 12, 6, -30, pink, -1) + confetti(118, 150, 12, 6, 60, white, -2) +
      confetti(300, 180, 13, 6, -15, gold, -0.5) + confetti(60, 200, 12, 6, 40, lilac, -1.6) + confetti(370, 230, 12, 6, 70, pink, -2.4) +
      confetti(200, 20, 12, 6, 10, lilac, -1.2) + confetti(330, 290, 12, 6, -45, gold, -0.3) + confetti(44, 330, 12, 6, 20, pink, -1.9) +
      dot(130, 100, 4, white, -0.4) + dot(290, 110, 4, gold, -1.1) + dot(340, 330, 4, lilac, -0.8) + dot(100, 40, 3.5, pink, -1.7) +
      dot(246, 140, 3.5, white, -2.1) + dot(378, 40, 4, gold, -0.2) + dot(26, 120, 3.5, white, -1.3) + dot(166, 330, 3.5, gold, -0.9) +
      spark(104, 118, 7, white) + spark(286, 166, 6, white) + spark(366, 300, 7, white) + spark(228, 70, 5, gold);

    host.innerHTML = '<svg viewBox="0 0 400 350" aria-hidden="true" focusable="false">' + art + "</svg>";
  }

  /* ---------- Happy Birthday: recording if present, otherwise a little synth tune ---------- */
  let fileAudio = null;
  let fileMissing = false;
  let synth = null;
  let songTimer = null;

  function noteHz(name) {
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const midi = 12 * (parseInt(name.slice(-1), 10) + 1) + base[name[0]];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function playSynth() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return 0;
    stopSynth();
    const ctx = new AC();
    if (ctx.resume) ctx.resume(); // iOS needs a nudge inside the tap
    const beat = 0.4;
    const tune = [
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
      ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
      ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2.5],
    ];
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    let t = ctx.currentTime + 0.08;
    tune.forEach(function (n) {
      const dur = n[1] * beat;
      const hz = noteHz(n[0]);
      [["triangle", 1, hz], ["sine", 0.35, hz * 2]].forEach(function (v) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = v[0];
        osc.frequency.value = v[2];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(v[1], t + 0.03);
        g.gain.setValueAtTime(v[1], t + dur * 0.75);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.02);
        osc.connect(g).connect(master);
        osc.start(t);
        osc.stop(t + dur);
      });
      t += dur;
    });
    synth = ctx;
    return (t - ctx.currentTime) * 1000;
  }

  function stopSynth() {
    if (synth) {
      try { synth.close(); } catch (e) { /* already closed */ }
      synth = null;
    }
  }

  function onSongEnd() {
    clearTimeout(songTimer);
    card.classList.remove("is-singing");
    if (B.resumeMusic) B.resumeMusic();
  }

  // Start the built-in tune, but only once per play and only while the card is open
  function fallbackToSynth() {
    if (synth || !card.classList.contains("is-singing")) return;
    songTimer = setTimeout(onSongEnd, playSynth() || 0);
  }

  function playSong() {
    stopSong();
    if (B.pauseMusic) B.pauseMusic();
    card.classList.add("is-singing");

    if (fileMissing || !C.song) {
      songTimer = setTimeout(onSongEnd, playSynth() || 0);
      return;
    }
    if (!fileAudio) {
      fileAudio = new Audio(C.song);
      fileAudio.preload = "auto";
      fileAudio.volume = 0.7;
      fileAudio.addEventListener("ended", onSongEnd);
      fileAudio.addEventListener("error", function () {
        fileMissing = true;
        fileAudio = null;
        fallbackToSynth();
      });
    }
    try { fileAudio.currentTime = 0; } catch (e) { /* not loaded yet */ }
    const p = fileAudio.play();
    if (p && p.catch) {
      p.catch(function () {
        // File unusable or blocked: fall back to the tune
        fallbackToSynth();
      });
    }
  }

  function stopSong() {
    clearTimeout(songTimer);
    if (fileAudio) fileAudio.pause();
    stopSynth();
    card.classList.remove("is-singing");
  }

  /* ---------- Open / close ---------- */
  function setOpen(open) {
    card.classList.toggle("is-open", open);
    cover.setAttribute("aria-expanded", open ? "true" : "false");
    inside.setAttribute("aria-hidden", open ? "false" : "true");
    inside.inert = !open; // keep the buttons inside unreachable while the card is shut
    if (open) {
      playSong();
      B.confettiFrom(card, 90);
      setTimeout(function () {
        card.querySelector(".bcard-title").focus();
      }, B.reduceMotion ? 0 : 700);
    } else {
      stopSong();
      if (B.resumeMusic) B.resumeMusic();
      cover.focus();
    }
  }

  cover.addEventListener("click", function () { setOpen(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
  if (replayBtn) replayBtn.addEventListener("click", function () { playSong(); });
  window.addEventListener("pagehide", stopSong);

  renderCoverArt();
  renderBanner();
  renderCalendar();
  inside.setAttribute("aria-hidden", "true");
  inside.inert = true;
})();
