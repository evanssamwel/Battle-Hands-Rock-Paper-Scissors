# ⚔️ Battle Hands – Rock Paper Scissors

> An arcade battle Rock Paper Scissors game featuring animated clashing hands, multiple intelligent AI difficulties, live fight commentary, a complete scoreboard, cosmetic gauntlet armory, and in-depth player statistics.

![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12.x-FF0055?logo=framer&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Audio-Synthesized_Web_Audio-FFA000)
![License](https://img.shields.io/badge/License-Apache_2.0-blue)

---

## 🌟 Overview

**Battle Hands** transforms the timeless game of Rock Paper Scissors into a fighting-game style arena. Face off against distinct computer opponents ranging from a friendly casual brawler to a psychological Markov-chain predictor. Experience dynamic animated clashes, unlock cosmetic battle gauntlets, review deep gameplay telemetry, and climb the ranks across multiple tournament formats.

---

## 🚀 Key Features

### 🤖 Intelligent AI Opponents & Game Theory Heuristics
Each computer opponent has a unique personality, dialogue system, and strategy engine based on real-world behavioral psychology:

1. **Rookie Ralph (Novice)**
   - *Casual Brawler* — Plays mostly spontaneously with a human beginner bias toward Rock and repeating past hands.
2. **Sergeant Stone (Tactician)**
   - *Discipline Master* — Exploits the psychological **Win-Stay, Lose-Shift (WSLS)** human reflex:
     - Winners tend to repeat their winning move; Stone counters it.
     - Losers tend to shift to the move that would have beaten the previous outcome; Stone anticipates and counters the shift.
3. **Cipher Master (Strategic)**
   - *Pattern Algorist* — Implements a **Markov Chain transition matrix** ($N$-gram frequency model) tracking your last 2–3 sequences to calculate exact follow-up probabilities.
4. **The Oracle (Master / Psychic)**
   - *Psychic Mind* — High-IQ psychological predictor that anticipates second-order counter-play, bluff inversions, and streak disruption patterns.
5. **Dynamic Dialogue System**: Opponents react in real time with unique taunts, compliments, and strategic observations after every clash.

---

### 📡 AI Mind-Reader Radar & Game Theory Telemetry
- **Live Psychological Modeling**: Toggle the real-time AI radar to view what hand the bot predicts you will play and its statistical confidence percentage.
- **Tactical Breakdown**: Explains the underlying game theory behind the prediction.
- **Reverse-Psychology Advice**: Provides recommended counter-strategies to outsmart each AI level.

---

### 💥 High-Impact Hand Animations & Arena Visuals
- **Scalable SVG Gauntlets**: Custom vector hand illustrations with knuckle armor plates, wrist straps, and metallic highlights.
- **Battle Motion Sequences**:
  - **Countdown Pump**: Hands bob rhythmically to the *"3... 2... 1..."* audio ticks.
  - **Clash Impact**: Explosive forward thrust meeting in the arena center with dynamic impact shockwaves.
  - **Verdict Poses**: Victorious high-pulse aura for the winner, knock-back recoil for the loser, and deadlocked parry for draws.
  - **Celebration**: Particle sparks, floating action stamps (*CRUSHED!*, *SLICED!*, *SMOTHERED!*), and victory confetti bursts.
- **Dynamic Themed Arenas**: The arena background lighting dynamically shifts depending on the opponent:
  - 🟢 *Emerald Gym* for Rookie Ralph
  - 🟡 *Military Amber* for Sergeant Stone
  - 🔵 *Cyber Grid Cyan* for Cipher Master
  - 🟣 *Mystic Nebula* for The Oracle

---

### 🛡️ Gauntlet Armory (Cosmetic Skins)
Unlock and equip custom visual hand gauntlets as you achieve battle milestones:

| Gauntlet Skin | Appearance | Unlock Requirement |
| :--- | :--- | :--- |
| **Champion Amber** | Gilded bronze & amber armor | *Default unlocked* |
| **Synthwave Neon** | Electric cyan & sky neon circuits | Reach a 3-win streak or 5 wins |
| **Molten Inferno** | Volcanic magma & ember glow | Win 12 total rounds |
| **Jade Dragon** | Imperial emerald carved dragon crests | Win any Best of 3 or Best of 5 tournament |
| **Celestial Void** | Astral obsidian infused with starlight | Defeat The Oracle on Master difficulty |

---

### 🏆 Win, Lose & Draw Scoreboard & Tournament Modes
- **Live Scoreboard**: Challenger vs AI wins, clash draws, total rounds, and live win-rate percentage.
- **Streak Tracker**: Tracks your active win streak with an animated flame badge and records your all-time best streak.
- **4 Game Modes**:
  - ♾️ **Endless Freeplay**: Unhurried casual practice and long-term stat building.
  - 🥇 **Best of 3**: First to 2 wins takes the tournament trophy.
  - 🏆 **Best of 5**: First to 3 wins claims the championship.
  - ❤️ **Survival Gauntlet**: 3 Lives — see how many consecutive rounds you can survive!

---

### 📊 Player Statistics, Match History & Hall of Trophies
- **Performance Analytics**:
  - Overall win-rate, total rounds, best streak, and draw frequency.
  - Hand usage distribution (Rock %, Paper %, Scissors %) and win percentage per hand gesture.
  - Win/Loss record vs each AI opponent.
- **Hall of Trophies (9 Achievements)**:
  - *First Blood*, *Triple Threat*, *Unstoppable Force*, *Rock Solid*, *Paper Origami*, *Razor Edge*, *Mind Breaker*, *Grand Champion*, and *Survivor Elite*.
  - Toast alerts notify you the moment an achievement is claimed.
- **Match History Log**: Chronological scrollable log with filter tabs (*All*, *Wins*, *Losses*, *Draws*).
- **Data Export & Reset**: Export your full statistics as a JSON file or perform a clean reset with confirmation.

---

### 🔊 Synthesized Web Audio Effects (Zero Asset Dependencies)
Built entirely on the browser's native **Web Audio API** with zero external audio files:
- Ascending pitch woodblock countdown ticks (`3`, `2`, `1`).
- Wind resistance whoosh on shoot release.
- Heavy rock sub-bass smash with gravel crunch.
- High-frequency metallic scissor snips.
- Resonant paper smother flutter.
- Harmonic victory fanfare arpeggio and minor descending defeat chords.
- Persistent audio mute toggle.

---

### ⌨️ Keyboard Shortcuts & Fast Play
Play seamlessly with keyboard shortcuts:
- `1` or `R` — **Rock**
- `2` or `P` — **Paper**
- `3` or `S` — **Scissors**
- `4` or `L` — **Lizard** *(Expanded Mode)*
- `5` or `K` — **Spock** *(Expanded Mode)*
- `Space` or `Enter` — **Fight Next Round**
- **Fast Mode Toggle**: Skip the 3-second countdown for instantaneous rapid-fire rounds.

---

## 📜 Game Rules & Matchup Matrix

### Classic Mode
```
Rock     ──(crushes)──►   Scissors
Scissors ──(cuts)─────►   Paper
Paper    ──(covers)───►   Rock
```

### Expanded Mode (RPS-LS)
Toggle **+ Lizard Spock** in the top bar to enable the 5-way tactical variant:
- **Rock**: Crushes Scissors & crushes Lizard.
- **Paper**: Covers Rock & disproves Spock.
- **Scissors**: Cuts Paper & decapitates Lizard.
- **Lizard**: Eats Paper & poisons Spock.
- **Spock**: Smashes Scissors & vaporizes Rock.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion & Physics**: [Motion](https://motion.dev/) (Framer Motion 12)
- **Audio**: Native [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Confetti**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)

### Project File Structure

```
├── src/
│   ├── components/
│   │   ├── AiRadar.tsx                # Real-time game theory telemetry HUD
│   │   ├── ArenaEffects.tsx           # Countdown, clash shockwaves, action banners & confetti
│   │   ├── ArmoryModal.tsx            # Gauntlet skin customization & unlock modal
│   │   ├── BattleHand.tsx             # Animated motion hand container with victory/defeat poses
│   │   ├── HandSelector.tsx           # Interactive hand cards with keyboard hints
│   │   ├── HandSvg.tsx                # Scalable vector graphics for all hands & skins
│   │   ├── MatchModeSelector.tsx      # Tournament modes, fast play & audio controls
│   │   ├── MatchOverModal.tsx         # Tournament victory/defeat modal
│   │   ├── OpponentSelect.tsx         # AI difficulty selector & speech bubbles
│   │   ├── Scoreboard.tsx             # Match scores, streak badges & win rate gauge
│   │   ├── StatsModal.tsx             # Performance charts, match history & trophy hall
│   │   └── UnlockToast.tsx            # Toast notification for newly unlocked skins/achievements
│   ├── types/
│   │   └── game.ts                    # Game state, statistics, skins & achievement definitions
│   ├── utils/
│   │   ├── aiStrategy.ts              # 4 AI algorithms (Random, WSLS, Markov, Oracle) + Telemetry
│   │   ├── audio.ts                   # Synthesized Web Audio API sound effects engine
│   │   ├── cosmeticsAndAchievements.ts# Skins definitions & unlock evaluation logic
│   │   └── storage.ts                 # LocalStorage persistence for stats, streaks & skins
│   ├── App.tsx                        # Master battle arena orchestration
│   ├── index.css                      # Tailwind v4 configuration, font scales & keyframes
│   └── main.tsx                       # React application root
├── index.html                         # Entry HTML with typography & SEO metadata
├── metadata.json                      # AI Studio application metadata
├── package.json                       # Dependencies & build scripts
└── tsconfig.json                      # TypeScript configuration
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd battle-hands
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the **Apache-2.0 License**. See the source headers for details.
