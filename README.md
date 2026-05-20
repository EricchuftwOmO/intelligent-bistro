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

### Frontend
```bash
cd frontend
npm install
npx expo start
```

Press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Features

- **Visual Menu Browsing** — Category filters, polished dark UI with NativeWind/Tailwind
- **AI Chat Interface** — Natural language ordering ("Add two spicy chicken sandwiches and a lemonade")
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
| NLP | Custom rule-based parser |
