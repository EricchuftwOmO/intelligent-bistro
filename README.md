# 🍽️ The Intelligent Bistro

An AI-powered restaurant ordering app built with **React Native (Expo)** and **Node.js**. Users can browse a menu, manage a shopping cart, and order through a conversational AI interface.

## Architecture

```
intelligent-bistro/
├── backend/            # Node.js + Express API
│   ├── index.js        # Menu API + NLP order parser
│   └── index.test.js   # Jest + Supertest API tests
├── frontend/           # Expo React Native app
│   ├── App.js          # Tab navigation (Menu, Chat, Cart)
│   ├── src/
│   │   ├── screens/    # MenuScreen, CartScreen, ChatScreen
│   │   ├── store/      # Zustand cart state management
│   │   └── config.js   # API URL configuration
│   ├── tailwind.config.js
│   └── metro.config.js
├── video-script.md     # 5-minute demo walkthrough script
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:4000`

#### AI-Powered NLP (Optional)

To enable Google Gemini AI for natural language parsing:

1. Get a free API key at https://aistudio.google.com/app/apikey
2. Set the environment variable before starting:
```bash
export GEMINI_API_KEY=your_api_key_here
npm start
```

Without the API key, the app falls back to a built-in rule-based parser — still fully functional.

### Frontend
```bash
cd frontend
npm install
npx expo start
```

Press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Features

- **Visual Menu Browsing** — Category filters, polished dark UI with NativeWind/Tailwind
- **AI Chat Interface** — Natural language ordering with dual mode:
  - 🤖 **AI Mode** — Powered by Google Gemini, understands conversational language
  - ⚡ **Basic Mode** — Rule-based parser, no API key needed, unlimited usage
- **Smart Cart** — Add/remove/modify items via UI buttons or AI conversation, with real-time badge updates
- **Add-to-Cart Feedback** — Visual confirmation (green ✓ animation) when items are added
- **NLP Backend** — Parses natural language into structured JSON cart actions

## AI Tools Used

Built with **Kiro CLI** (AI coding assistant) for rapid development.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo, NativeWind (Tailwind CSS) |
| Navigation | React Navigation (Bottom Tabs) |
| State | Zustand |
| Backend | Node.js, Express |
| NLP | Google Gemini AI (with rule-based fallback) |
