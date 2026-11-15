# 🎂 Happy 33rd Birthday Website

A soft, playful lavender birthday site (rounded cards, pill buttons, script accents) with four pages (Home, Wishes, Gifts and Gallery). It's plain HTML, CSS and JavaScript, so there's nothing to install or build, and you can host it for free on GitHub Pages.

```
index.html          ← Home: countdown to 16 Nov, ID-card age scanner, chart
wishes.html         ← Fold-open birthday card (it sings), flip-card wishes + a heartfelt letter
gifts.html          ← One locked, secret gift (password or countdown)
gallery.html        ← Photo wall with a lightbox
css/style.css       ← All the styling (colours are at the top)
js/main.js          ← ✏️ Name, birthday date, wishes, letter, scanner text, chart
js/gifts.js         ← ✏️ Unlock mode, password, hint, jokes, surprise text
js/card.js          ← ✏️ Birthday card: cover text, bunting letters, message, optional song file
js/gallery.js       ← ✏️ Photo list and captions
assets/photos/      ← Put photo1.jpg, photo2.jpg ... here
assets/music/       ← song.mp3 (background music) and happy-birthday.mp3 (card) go here, both optional
```

---

## 1. Customize it (before publishing)

All your text is at the **top** of the three JS files, in clearly marked config blocks. You can change those without touching anything else.

| What | Where |
|---|---|
| His name, your name | `js/main.js` → `SITE.name`, `SITE.fromName` |
| Birthday date (countdown) | `js/main.js` → `SITE.birthday` (currently `2026-11-16`, midnight London time via `SITE.timeZone`) |
| Photo on the scanner's ID card | `js/main.js` → `SITE.scanPhoto` (uses `photo1.jpg` by default) |
| The 8 wishes | `js/main.js` → `SITE.wishes` |
| The long letter | `js/main.js` → `SITE.letter` |
| Scanner jokes and chart numbers | `js/main.js` → `scanSteps`, `scanResult`, `ageChart` |
| How the secret gift unlocks | `js/gifts.js` → `GIFT_CONFIG.surprise.unlockMode` |
| Secret password, hint, surprise text | `js/gifts.js` → `GIFT_CONFIG.surprise` |
| The birthday card (cover text, banner letters, message) | `js/card.js` → `CARD_CONFIG` |
| Photos and captions | `js/gallery.js` → `GALLERY_PHOTOS` |
| Colours and fonts | `css/style.css` → the `:root` block at the top (Quicksand + Dancing Script, loaded from Google Fonts in each HTML file) |

Anywhere you type `{name}` in a config, it's replaced with his name.

**The secret gift** has two modes:
- `unlockMode: "password"` (default) — he types the secret password. Wrong guesses get roasted; after 3 misses a hint appears.
- `unlockMode: "countdown"` — it unlocks itself at `unlockAt` (set to midnight on 16 Nov). Until then it shows a live countdown.

In password mode, after `giveUpAfter` wrong guesses (5 by default) the box stays shut and he's told the gift will be revealed at your first meetup. Change the wording in `giveUpTitle` / `giveUpText`.

**The birthday card** on the Wishes page folds open, shows a “HAPPY BIRTHDAY” bunting (one letter per flag), a calendar of the birthday month with a heart on the day, and plays Happy Birthday. If you put a recording at `assets/music/happy-birthday.mp3` it plays that; otherwise the site plays its own little tune, so no file is required.

**Photos:** name them `photo1.jpg`, `photo2.jpg` and so on, and put them in `assets/photos/`. To add another one, drop the file in and add a line to `GALLERY_PHOTOS`:

```js
{ src: "assets/photos/photo7.jpg", alt: "Alex at the beach", caption: "Still getting the kids' menu." },
```

Tips: phone photos can be huge, so resize them to about 1200 px wide first (any free tool like squoosh.app works). File names are **case-sensitive** on GitHub, so `Photo1.JPG` is not the same as `photo1.jpg`. If a photo is missing, the site shows a cute "Add photo3.jpg" placeholder instead of breaking.

**Music (optional):** put an mp3 at `assets/music/song.mp3`. Music is off until he taps the ♪ button. If there's no file, the button just shows a friendly message.

**Preview locally:** double-click `index.html` to open it in your browser. Everything works from your computer.

---

## 2. Create a GitHub repository

1. Go to [github.com](https://github.com) and sign up or log in (it's free).
2. Click the **+** in the top-right corner, then **New repository**.
3. Give it a name, e.g. `happy-birthday-alex`. That name becomes part of the link.
4. Set it to **Public**. Free GitHub Pages needs a public repo.
5. Click **Create repository**.

## 3. Upload the files

1. On the new repository page, click **uploading an existing file** (or **Add file → Upload files**).
2. Open the website folder on your computer, select **everything inside it** (`index.html`, `wishes.html`, `gifts.html`, `gallery.html`, `README.md` and the `css`, `js` and `assets` folders), and drag it all into the browser window.
   - Drag the folders themselves, not just the files, so the folder structure is kept.
   - `index.html` must end up at the **top level** of the repo, not inside another folder.
3. Wait for the uploads to finish, then click **Commit changes** at the bottom.

> Adding more photos later? Open the `assets/photos` folder on GitHub, click **Add file → Upload files**, drop them in, and commit. Then edit `js/gallery.js` on GitHub (pencil icon) to add the new lines.

## 4. Turn on GitHub Pages

1. In your repository, click **Settings** (top tab).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.

## 5. Find and share the live link

1. Wait 1–2 minutes, then refresh the **Settings → Pages** screen.
2. A box will say **"Your site is live at …"** with a link like
   `https://your-username.github.io/happy-birthday-alex/`
3. Click **Visit site** to check it, preferably on your phone too.
4. Send him the link. 🎉

If you change something later, commit the change and wait about a minute. If the old version still shows, do a hard refresh (or open the link in a private tab).

---

## Troubleshooting

- **404 page:** wait another minute. Check that `index.html` is at the top level of the repo and that Pages is set to `main` and `/ (root)`.
- **Photos not showing:** check the file names match `GALLERY_PHOTOS` exactly, including upper and lower case and `.jpg` vs `.jpeg`.
- **No styling:** the `css` folder probably didn't upload. Re-upload it as a folder.
- **Music won't play:** phones only allow sound after a tap, which is why there's a button. Check the file is exactly `assets/music/song.mp3`.
- **Countdown looks wrong:** it counts down to midnight **London time** (`SITE.timeZone` in `js/main.js`), so it's the same moment for everyone. Dates must be written `YYYY-MM-DD`.

## A note on the password

This is a static site, so anyone curious enough to read `js/gifts.js` can find the password. That's fine for a birthday surprise, but don't use it to hide anything actually secret.
