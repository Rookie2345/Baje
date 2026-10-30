# 🏔️ BAJE AI — बाजेसँग गफ गरौँ!

> **Your Digital Nepali Hajurbuwa** — Chat with a funny, wise, caring grandfather AI in Nepali, Romanized Nepali, or English!

[![Made in Nepal](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F-in%20Nepal-red)](https://github.com/Rookie2345/Baje)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## ✨ Features

- 🎭 **3D Nepali Grandfather** — Procedurally rendered with Three.js (idle, thinking, laughing, advice animations)
- 🗣️ **Multilingual** — Understands Nepali (नेपाली), Romanized Nepali, and English
- 😂 **Humor Engine** — 46 original Nepali jokes with smart cooldown (no forced humor)
- 🧠 **Hybrid AI** — Local conversation engine + optional AI fallback (OpenAI / Gemini)
- 💬 **Rich Chat UI** — Smooth bubbles, typing indicator, auto-scroll
- 📱 **Responsive** — Desktop, tablet, and mobile-friendly
- 🔒 **Secure** — API keys never exposed to frontend
- ⚡ **Rate Limited** — Protection against abuse
- 🎨 **Premium Design** — Glassmorphism, gradients, micro-animations

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/Rookie2345/Baje.git
cd Baje
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` — the app works without any AI key (local engine only):

```env
PORT=3000
NODE_ENV=development

# Optional: Enable AI fallback
# AI_PROVIDER=gemini
# AI_API_KEY=your-key-here
# AI_MODEL=gemini-1.5-flash
```

### 3. Run

```bash
npm start
```

Open **http://localhost:3000** in your browser. बाजेसँग गफ गर्नुस्! 😄

---

## 🤖 AI Provider Configuration

BAJE AI works out-of-the-box using its local conversation engine. For smarter responses on complex questions, configure an optional AI fallback:

### Option A: Google Gemini (Recommended — Free tier available)

```env
AI_PROVIDER=gemini
AI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-1.5-flash
```

Get your key at: https://aistudio.google.com/app/apikey

### Option B: OpenAI

```env
AI_PROVIDER=openai
AI_API_KEY=sk-your-openai-key
AI_MODEL=gpt-3.5-turbo
```

> **Security Note:** Never commit your `.env` file. It is already in `.gitignore`.

---

## 📁 Project Structure

```
baje-ai/
├── frontend/                  # Static frontend (served by Express)
│   ├── index.html             # Single-page application
│   ├── css/style.css          # Premium stylesheet
│   ├── js/
│   │   ├── main.js            # Entry point
│   │   ├── chat.js            # Chat module
│   │   ├── character.js       # Three.js 3D character
│   │   └── effects.js         # Animations & UI effects
│   └── assets/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/chat.js         # Chat API route
│   ├── middleware/rateLimit.js
│   └── services/
│       ├── conversation.js    # Core Baje conversation engine
│       ├── humor.js           # 46-joke Nepali humor library
│       ├── ai.js              # AI fallback (OpenAI/Gemini)
│       └── context.js         # Session memory management
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🌐 Deploying to Render

### Step 1: Push to GitHub

```bash
git init  # if not already
git add .
git commit -m "🇳🇵 Initial BAJE AI deployment"
git remote add origin https://github.com/Rookie2345/Baje.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **New → Web Service**
3. Connect your GitHub account and select `Rookie2345/Baje`
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `baje-ai` |
| **Environment** | `Node` |
| **Region** | Any (Oregon recommended) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 3: Configure Environment Variables on Render

In your Render service dashboard → **Environment** tab:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `AI_PROVIDER` | `gemini` (optional) |
| `AI_API_KEY` | your-key (optional) |
| `AI_MODEL` | `gemini-1.5-flash` (optional) |

> Do NOT set `PORT` — Render sets this automatically.

### Step 4: Deploy

Click **Deploy** and wait ~2 minutes. Your BAJE AI will be live at:
`https://baje-ai.onrender.com` (or your custom name)

---

## 📡 API Documentation

### `POST /api/chat`

Send a message to Baje.

**Request:**
```json
{
  "message": "बाजे, एउटा जोक सुनाउनुस्!",
  "sessionId": "sess_1234567890_abc",
  "history": []
}
```

**Response:**
```json
{
  "reply": "हाहा! सुन बाबु... [joke]",
  "emotion": "laughing",
  "source": "local",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Emotions:** `idle` | `thinking` | `happy` | `laughing` | `advice`

**Sources:** `local` (custom engine) | `ai` (AI fallback)

---

### `GET /api/health`

Check server status.

**Response:**
```json
{
  "status": "ok",
  "app": "BAJE AI",
  "tagline": "बाजेसँग गफ गरौँ!",
  "aiConfigured": false,
  "aiProvider": "none (local engine active)",
  "timestamp": "...",
  "uptime": "42s"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| 3D Graphics | Three.js r128 |
| Icons | Font Awesome 6 |
| Fonts | Poppins + Noto Sans Devanagari |
| Backend | Node.js + Express.js |
| AI (optional) | OpenAI / Google Gemini |
| Deployment | GitHub + Render |

---

## 🧪 Testing Checklist

- [x] Website loads at localhost:3000
- [x] 3D character renders (or graceful fallback)
- [x] Mobile layout works
- [x] Nepali input (नेपाली) works
- [x] Romanized Nepali (k cha baje?) works
- [x] English input works
- [x] Jokes are varied (no instant repeats)
- [x] Humor cooldown works (no consecutive jokes)
- [x] Clear chat button works
- [x] Rate limiting active (20/min)
- [x] No API keys exposed in frontend
- [x] Health endpoint returns correct data
- [x] Server handles errors gracefully

---

## 📜 License

MIT License © 2024 Rookie2345

---

## ❤️ Made with Love in Nepal

```
🏔️ BAJE AI
बाजेसँग गफ गरौँ!
Made with ❤️ in Nepal 🇳🇵
```

*"यो त साँच्चिकै रमाइलो नेपाली बाजेसँग गफ गरेजस्तो रहेछ!"* 😄
