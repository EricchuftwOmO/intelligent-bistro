# 🎬 Video Walkthrough Script

> **The Intelligent Bistro** — 5-Minute App Demo  
> A brief walkthrough covering UI experience, AI-driven cart interactions, and code structure.

---

## 📋 Overview

| Section | Timestamp | Focus |
|---------|-----------|-------|
| Introduction | 0:00 – 0:30 | App overview |
| UI & Usability | 0:30 – 2:00 | Menu browsing, visual feedback, cart |
| AI Chat Ordering | 2:00 – 3:30 | Natural language cart management |
| Code & AI Tools | 3:30 – 5:00 | Architecture, NLP parser, Kiro CLI |

---

## 🎙️ Script

### Part 1 — Introduction (0:00 – 0:30)

> **On screen:** App's Menu page in the browser

"Hi, welcome to my demo of The Intelligent Bistro — an AI-powered restaurant ordering app. This app lets users browse a menu, add items to a cart, and most importantly, manage their orders through a conversational AI interface using natural language. Let me walk you through it."

---

### Part 2 — UI Experience & Usability (0:30 – 2:00)

> **On screen:** Click through category filters: All → Mains → Starters → Drinks → Desserts

"Here's our menu screen. We have a clean, dark-themed UI with category filters at the top. I can filter by Mains, Starters, Drinks, or Desserts — or view everything with All."

> **On screen:** Click the `+` button on a few items, show the green ✓ feedback

"When I add an item to the cart, the button briefly turns green with a checkmark — giving clear visual feedback that the item was added successfully."

> **On screen:** Point out the cart badge in the bottom tab bar

"Down here in the tab bar, the cart icon updates its badge count in real-time as I add items."

> **On screen:** Switch to the Cart tab

"Switching to the Cart tab, I can see all my items with quantities and prices. The total is calculated automatically. I can adjust quantities or remove items directly from here."

---

### Part 3 — AI-Driven Cart Interactions (2:00 – 3:30)

> **On screen:** Switch to the Chat tab

"Now here's the highlight — the AI Chat interface. Instead of tapping buttons, I can order using natural language."

> **On screen:** Type: `Add two spicy chicken sandwiches and a lemonade`

"Let me type: 'Add two spicy chicken sandwiches and a lemonade'... The AI confirms it's been added with the prices. The cart badge is already updated."

> **On screen:** Type: `Remove the lemonade`

"I can also remove items: 'Remove the lemonade'... Done."

> **On screen:** Type: `What do you have?`

"I can ask about the menu: 'What do you have?' — and it gives me a helpful overview."

> **On screen:** Type: `Clear my cart`

"And I can clear everything: 'Clear my cart'... The cart is now empty."

> **On screen:** Type: `I'd like a truffle burger and fries`

"Let me add some more: 'I'd like a truffle burger and fries'... Both items added. The NLP parser handles various phrasings naturally."

---

### Part 4 — Code Structure & AI Tools (3:30 – 5:00)

> **On screen:** Show project folder structure in code editor

"Let me quickly show the code structure. The project has two main parts: a backend and a frontend."

> **On screen:** Open `backend/index.js`, scroll to `parseOrder()` function

"The backend is a Node.js Express server. It serves menu data via a REST API and has a parse-order endpoint. The key function is `parseOrder` — a rule-based NLP parser that detects intent (add, remove, clear), matches item names, extracts quantities, and returns structured actions."

> **On screen:** Open frontend folder: `App.js`, `src/screens/`, `src/store/`

"The frontend is built with React Native and Expo, styled with NativeWind (Tailwind CSS). Three screens — Menu, Chat, and Cart — connected with React Navigation bottom tabs. State management uses Zustand, keeping the cart synchronized across all screens."

> **On screen:** Open `ChatScreen.js`, show `sendMessage` function

"In the Chat screen, when a user sends a message, it calls the backend's parse-order API, gets back structured actions, and applies them directly to the Zustand store. The AI response and cart update happen simultaneously."

> **On screen:** Switch back to the app in browser

"Finally, this entire app was built using **Kiro CLI** — an AI coding assistant. It helped generate the project structure, implement the NLP parser, create UI components, and iterate on bug fixes like cart badge reactivity and layout issues — all through conversational prompts in the terminal."

"That's The Intelligent Bistro. Thanks for watching!"

---

## 🛠️ Tech Stack Mentioned

- **Frontend:** React Native, Expo, NativeWind (Tailwind CSS), Zustand, React Navigation
- **Backend:** Node.js, Express, Custom NLP Parser
- **AI Tool:** Kiro CLI
