# TaskBoard 📋

Day-wise task manager with persistent storage. Works as a PWA — add it to your phone's home screen.

---

## Run Locally (Windows + VS Code)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start
# Opens at http://localhost:3000

# 3. From your phone (same WiFi):
#    Open http://YOUR_PC_IP:3000
#    e.g. http://192.168.1.5:3000
```

To find your PC IP: open CMD → type `ipconfig` → look for "IPv4 Address"

---

## Deploy to Vercel (Free — get a real URL for your phone)

### Option A: Via GitHub (recommended)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "init taskboard"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/taskboard.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub (free)

3. Click **"Add New Project"** → Import your `taskboard` repo

4. Click **Deploy** — Vercel auto-detects React. Done in ~1 minute.

5. You'll get a URL like `https://taskboard-xyz.vercel.app`

### Option B: Vercel CLI (no GitHub needed)

```bash
npm install -g vercel
vercel login
vercel --prod
# Follow prompts — done in 30 seconds
```

---

## Add to Phone Home Screen

### Android (Chrome)
1. Open your Vercel URL in Chrome
2. Tap the **⋮ menu** → "Add to Home screen"
3. Tap Add → icon appears on home screen

### iPhone (Safari)
1. Open your Vercel URL in **Safari** (must be Safari)
2. Tap the **Share button** (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap Add → icon appears on home screen

---

## Features

- ✅ **Persistent storage** — tasks saved in localStorage, survive refresh/close
- 📅 **Week navigation** — browse any week with ‹ › arrows
- 🎯 **Priority levels** — High / Med / Low with color coding
- ✏️ **Inline editing** — double-tap any task text to edit it
- 🗑️ **Clear done** — bulk remove completed tasks for the day
- 📱 **PWA ready** — works offline, installable on phone
- 🔴🟡🟢 **Smart sorting** — incomplete high-priority tasks always on top

---

## Project Structure

```
taskboard/
├── public/
│   ├── index.html       # PWA-ready HTML shell
│   └── manifest.json    # PWA manifest (home screen icon config)
├── src/
│   ├── index.js         # React entry point
│   ├── App.js           # Main UI component
│   ├── useTasks.js      # Custom hook with localStorage persistence
│   └── constants.js     # Shared constants & helpers
├── package.json
├── vercel.json          # Vercel deploy config
└── README.md
```
