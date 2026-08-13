# Memory Matching Game

A React memory matching game — 20 cards, numbers 1–10 (2 of each), match all before your 10 lives run out.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. In `vite.config.js`, set `base: '/YOUR_REPO_NAME/'` to match your actual repo name.
2. Push this project to your GitHub repo (new or existing):

```bash
git init
git add .
git commit -m "Add memory matching game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

3. Install the deploy dependency and publish:

```bash
npm install
npm run deploy
```

This builds the app and pushes the `dist` folder to a `gh-pages` branch.

4. In your GitHub repo settings → **Pages**, set the source to the `gh-pages` branch (root).
5. Your game will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```
