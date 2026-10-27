# OUT OF THE BOX

> **"The answer is not always where you are looking."**  
> *30 challenges. 45 minutes. One extraordinary mind.*

A premium, responsive, 30-level logical-thinking browser adventure built with **React 18**, **Vite**, **Framer Motion**, **Lucide Icons**, and the **Web Audio API**.

---

## 1. Concept & Premise

Players enter a mysterious cognitive testing facility designed to assess cognitive agility, lateral thinking, pattern discovery, spatial deduction, and unconventional problem-solving. Across three distinct zones and three multi-stage guardian encounters, assumptions are systematically dismantled.

---

## 2. Campaign Structure & Zone Distribution

The campaign is calibrated for approximately **45 minutes** of gameplay, tracked by a persistent campaign timer, per-level timers, and an optional untimed Practice Mode.

| Zone | Levels | Difficulty | Target Time | Key Cognitive Skills | Boss Encounter |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Zone 1: Discovery** | 1–9 | Easy | ~10 mins | Sequences, matrix observation, cube nets, outside-the-box dot strokes, logic switches, burning fuses, working memory | **Level 10: The Pattern Keeper** *(3 Phases)* |
| **Zone 2: The Thinking Lab** | 11–19 | Medium | ~14 mins | Symbol balances, constellation webs, constrained labyrinths, roundtable deduction, lateral elevators, harmonic resonators, magic rosette | **Level 20: The Reality Breaker** *(3 Phases)* |
| **Zone 3: The Impossible Room** | 21–29 | Hard | ~16 mins | Cryptarithm ciphers, non-Euclidean stars, truth/liar paradoxes, 4D hypercube projections, quantum spin states, Rule 90 cellular automata, Archimedes torque balance | **Level 30: The Architect of Thought** *(3 Phases)* |

---

## 3. The Three Boss Encounters

Boss fights are not simple multiple-choice questions; each consists of a three-phase sequence testing distinct facets of cognitive synthesis:

### **Boss 10 — The Pattern Keeper**
1. **Phase 1 (Mathematical):** Uncover the exponential doubling leap sequence ($3, 5, 9, 17, 33 \rightarrow 65$).
2. **Phase 2 (Visual Invariant):** Complete a 4×4 rotational matrix invariant ($270^\circ$, 3 rays).
3. **Phase 3 (Synthesis Equation):** Synthesize both discoveries into the vault lock: $(65 \times 3) - 27 = 168$.

### **Boss 20 — The Reality Breaker**
1. **Phase 1 (Spatial Extension):** Calculate the theoretical minimum strokes to connect 16 dots in a 4×4 grid extending outside the box ($6$ lines).
2. **Phase 2 (Ambigram Mirror):** Identify the natural $180^\circ$ rotational ambigram (`NOON`).
3. **Phase 3 (Subverted Command):** Break interface framing—the required target is embedded directly inside the instructions text.

### **Boss 30 — The Architect of Thought**
1. **Phase 1 (Master Decryption):** Compute the facility constant equation: $(42 \times 4) - (16 + 8) = 144$.
2. **Phase 2 (Harmonic Alignment):** Determine the Greatest Common Divisor ($\gcd(144, 168, 45) = 3$).
3. **Phase 3 (Meta-Paradox):** Resolve the existential query on cognitive framing and transcendent intelligence.

---

## 4. Mandatory Puzzle Variety Engine

The game engine natively supports 8 distinct interaction patterns without repeating mechanics consecutively:

1. **Mathematical Reasoning:** Prime progressions, symbol balancing scales, matchstick transformations, cryptarithms (`SEND + MORE = MONEY`), magic rosettes.
2. **Connect-the-Dots:** Interactive SVG/Canvas supporting continuous strokes, outside-the-boundary overshoots, undo, reset, and line constraints.
3. **Spatial Intelligence:** 3D cube net unfolding, alternating grid labyrinths, 4D hypercube projections, and topological Möbius loops.
4. **Logic & Deduction:** Truth-and-lie monitors, circular roundtable seating arrangements, quantum particle spin states.
5. **Lateral Thinking:** Burning fuse measurements, the elevator height paradox, two-guard perception paradoxes.
6. **Observation & Pattern:** 3×3 Latin square symbol matrices, structural chord rules in geometric frames, Wolfram Rule 90 cellular automata.
7. **Memory & Attention:** Forward sequence resonance recall and reverse working memory digit spans.
8. **Interactive Experiments:** Binary logic gate switchboards, harmonic frequency resonator dials, dual-tier Archimedes torque balance scales.

---

## 5. Scoring & Cognitive Ranks

Scores are awarded based on:
- Base points per chamber (Easy: 250, Medium: 500, Hard: 850, Boss: 1200).
- Speed efficiency bonuses for completing chambers under target duration.
- Moderate penalties for requesting hints (Hint 1: -35 pts, Hint 2: -65 pts).
- Zero-hint bonuses and multi-chamber solve streaks.

### Cognitive Ranks
- **20,000+ pts:** 👑 **OUT OF THE BOX LEGEND**
- **15,000–19,999 pts:** 🔮 **Mind Architect**
- **10,000–14,999 pts:** ⚡ **Logic Strategist**
- **5,000–9,999 pts:** 🔍 **Pattern Seeker**
- **0–4,999 pts:** 🌱 **Curious Beginner**

---

## 6. Procedural Sound & Visual Aesthetics

- **Procedural Audio:** Built entirely with the Web Audio API (zero external `.mp3`/`.wav` assets required, instant zero-latency feedback). Includes harmonic selection tones, victory arpeggios, boss fanfare, ambient pulse, and error buzzes.
- **Palette:** Deep charcoal/near-black backgrounds (`#07080e`), electric violet (`#8b5cf6`), cyan highlights (`#06b6d4`), warm amber (`#f59e0b`), and emerald green (`#10b981`).
- **Accessibility:** High-contrast mode, reduced-motion preferences, keyboard shortcuts (`Esc` for Pause, `Enter` to submit, `R` to reset, `H` for hints), and mobile touch responsiveness.

---

## 7. Installation & Local Development

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (outputs to dist/)
npm run build

# 4. Preview production build
npm run preview

# 5. Run automated test suite (all 30 levels + game state)
npm test
```

---

## 8. Deployment

The project is pre-configured for instant zero-configuration deployment to **Vercel** or **Netlify**:

```bash
# Build command
npm run build

# Publish directory
dist
```

---

## 9. Client-Side Answer Security Disclosure

*Security Note:* As an entirely offline, client-side browser application with zero external server dependencies, puzzle solutions and validation logic reside within the client bundle. While obfuscated during production minification, technically skilled users can inspect local memory or client files. This architecture guarantees 100% offline reliability, instant responsiveness, and zero privacy exposure.

