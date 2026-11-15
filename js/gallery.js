/* ==========================================================================
   gallery.js — the Gallery page

   ✏️  ADD YOUR PHOTOS HERE.
   1. Put the image in the assets/photos/ folder (e.g. photo7.jpg)
   2. Add one line to this list:
        { src: "assets/photos/photo7.jpg", alt: "What's in the photo", caption: "Your joke" },

   - alt     = a short description of the photo, for screen readers
   - caption = the teasing caption under the photo
   Tip: {name} is replaced with the birthday boy's name (set in main.js).
   ========================================================================== */

const GALLERY_PHOTOS = [
  { src: "assets/photos/photo1.jpg", alt: "{name} smiling at the camera", caption: "Exhibit A: allegedly 33." },
  { src: "assets/photos/photo2.jpg", alt: "{name} on a night out", caption: "Bouncer: One Screw at a time" },
  { src: "assets/photos/photo3.jpg", alt: "{name} on holiday", caption: "Peak youth. Or a Tuesday. Hard to tell." },
  { src: "assets/photos/photo4.jpg", alt: "{name} looking relaxed", caption: "Moisturised. Unbothered. Thriving." },
  { src: "assets/photos/photo5.jpg", alt: "An old photo of {name}", caption: "Same face since forever. Scientists baffled." },
  { src: "assets/photos/photo6.jpeg", alt: "{name} with friends", caption: "Looks like the intern at his own party." },
];

/* ==========================================================================
   Logic — no need to edit below this line
   ========================================================================== */
(function () {
  "use strict";

  const B = window.Bday;
  const grid = document.getElementById("gallery");
  const lb = document.getElementById("lightbox");
  if (!B || !grid || !lb) return;

  const photos = GALLERY_PHOTOS.map(function (p) {
    return {
      src: p.src,
      alt: B.fill(p.alt || p.caption || "Birthday photo"),
      caption: B.fill(p.caption || ""),
    };
  });

  function fileName(src) {
    return src.split("/").pop();
  }

  function missingHTML(src) {
    return '<span class="photo-missing"><span>Add ' + B.esc(fileName(src)) + "</span></span>";
  }

  /* ---------- Grid ---------- */
  grid.innerHTML = photos.map(function (p, i) {
    return '<li class="polaroid reveal" style="--stagger:' + (i % 3) + '">' +
      '<button class="polaroid-btn" type="button" data-index="' + i + '">' +
        '<span class="photo-frame">' +
          '<img src="' + B.esc(p.src) + '" alt="' + B.esc(p.alt) + '" loading="lazy" decoding="async" width="600" height="600">' +
        "</span>" +
        '<span class="polaroid-caption">' + B.esc(p.caption) + "</span>" +
      "</button></li>";
  }).join("");

  grid.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      const frame = img.parentNode;
      if (!frame) return;
      frame.innerHTML = missingHTML(img.getAttribute("src"));
    });
  });

  B.observeReveal(grid);

  grid.addEventListener("click", function (e) {
    const btn = e.target.closest(".polaroid-btn");
    if (btn) open(parseInt(btn.getAttribute("data-index"), 10), btn);
  });

  /* ---------- Lightbox ---------- */
  const figure = lb.querySelector(".lightbox-figure");
  const lbImg = lb.querySelector(".lightbox-img");
  const lbMissing = lb.querySelector(".lightbox-missing");
  const lbCaption = lb.querySelector(".lightbox-caption");
  const lbCount = lb.querySelector(".lightbox-count");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");
  let current = 0;
  let lastFocus = null;

  lbImg.addEventListener("error", function () {
    figure.classList.add("is-missing");
    lbMissing.querySelector(".lightbox-missing-text").textContent =
      "Photo not found: " + fileName(photos[current].src);
  });

  function show(i) {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    figure.classList.remove("is-missing");
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbCaption.textContent = p.caption;
    lbCount.textContent = (current + 1) + " / " + photos.length;
    // preload neighbours so swiping feels instant
    [current + 1, current - 1].forEach(function (n) {
      const pre = new Image();
      pre.src = photos[(n + photos.length) % photos.length].src;
    });
  }

  function open(i, trigger) {
    // Safari doesn't focus buttons on click, so remember the tapped photo explicitly
    lastFocus = trigger || document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    lb.hidden = true;
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowRight") {
      show(current + 1);
    } else if (e.key === "ArrowLeft") {
      show(current - 1);
    } else if (e.key === "Tab") {
      // keep focus inside the lightbox
      const focusables = [btnClose, btnPrev, btnNext];
      const idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? idx - 1 : idx + 1;
      focusables[(next + focusables.length) % focusables.length].focus();
    }
  }

  lb.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) close();
  });
  btnPrev.addEventListener("click", function () { show(current - 1); });
  btnNext.addEventListener("click", function () { show(current + 1); });

  // Swipe on touch screens
  let touchX = null;
  let touchY = null;
  lb.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      show(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
})();
