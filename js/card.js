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
  const coverTitle = card.querySelector(".bcard-cover-title");
  const coverSub = card.querySelector(".bcard-cover-sub");
  if (coverTitle) coverTitle.textContent = B.fill(C.coverTitle);
  if (coverSub) coverSub.textContent = B.fill(C.coverSub);
  card.querySelector(".bcard-title").textContent = B.fill(C.title);
  card.querySelector(".bcard-msg").textContent = B.fill(C.message);

  /* ---------- Banner: purple paper flags on a soft string ---------- */
  function renderBanner() {
    const host = card.querySelector(".banner");
    if (!host) return;
    const letters = Array.from(B.fill(C.banner));
    const stringText = "";
    const purpleFlags = ["#A678D8", "#B88AE3", "#8F67C8", "#C598E9", "#9D78D7", "#B27AE1"];
    const items = [];
    let offset = 0;

    letters.forEach(function (ch, index) {
      if (ch === " ") {
        offset += 20;
        return;
      }

      const flag = '<span class="banner-flag" style="--flag-color:' + purpleFlags[index % purpleFlags.length] + '; --flag-shift:' + offset + 'px; --flag-tilt:' + ((index % 2 === 0 ? -1 : 1) * (6 + (index % 4) * 1.5)) + 'deg; --flag-delay:' + (index * 0.08) + 's;">' + B.esc(ch) + '</span>';
      items.push(flag);
      offset += 18;
    });

    host.innerHTML = '<div class="banner-string" aria-hidden="true"></div><div class="banner-flags">' + items.join("") + '</div>';
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

  renderBanner();
  renderCalendar();
  inside.setAttribute("aria-hidden", "true");
  inside.inert = true;
})();
