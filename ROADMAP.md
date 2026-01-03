# Typing Trainer Development Roadmap 🗺️

This document outlines the strategic development plan for **Teclado Mágico**. It is grounded in motor learning theory, engagement mechanics, and adaptive error correction.

## Core Principles
1.  **Motor Learning**: Muscle memory develops through spaced repetition of correct movements.
2.  **Engagement**: Immediate feedback and visible progress are required to sustain motivation.
3.  **Diagnosis**: Individual error patterns must be identified and corrected.

---

## ✅ Phase 1: Core Functionality (Current State)
*Status: Complete*

*   [x] **Sequential Lessons**: Progression from home row to full keyboard.
*   [x] **Visual Keyboard**: Color-coded finger placement guidance.
*   [x] **Immediate Feedback**: Green/Red visual cues for keystrokes.
*   [x] **Gamification Layer**: Stars, celebration screens, and basic stats.
*   [x] **Dual Language**: Support for Portuguese (pt-PT) and English.
*   [x] **Modes**: Campaign, Timed Challenge, and Error Drill.

## 🔜 Phase 2: Data Persistence & Analytics
*Goal: Enable long-term progress tracking via `window.localStorage`.*

*   [ ] **User Profile**: Store name, age, and preferred language.
*   [ ] **Lesson History**: Track completion counts and high scores per lesson.
*   [ ] **Session Timeline**: Store date, duration, words typed, and WPM for every session.
*   [ ] **Aggregated Error Tracking**: Track error counts (e.g., 's' vs 'a' confusion) across *all* sessions, not just the current one.
*   [ ] **Visual Dashboard**:
    *   Line graph of WPM improvement.
    *   Keyboard heatmap showing error hotspots.
    *   Calendar streak view.

## 🧠 Phase 3: Adaptive Learning Engine
*Goal: Transform the tool into an intelligent tutor.*

*   [ ] **Adaptive Sequencing**: Suggest repeating lessons if accuracy < 85%.
*   [ ] **Micro-Drills**: Inject mini-lessons for specific weak key combinations.
*   [ ] **Dynamic Difficulty**:
    *   Increase word length as accuracy improves.
    *   Increase time pressure in challenges.
*   [ ] **Stubborn Error Detection**: Identify errors that persist over weeks and modify lesson pace/visual cues to assist.
*   [ ] **Fatigue Management**: Suggest breaks if performance degrades after 10+ minutes.

## 🏆 Phase 4: Enhanced Gamification
*Goal: Sustain motivation over weeks of practice.*

*   [ ] **Achievement System**:
    *   **Speed**: "Reached 20 WPM".
    *   **Accuracy**: "10 perfect words in a row".
    *   **Consistency**: "Practiced 5 days in a row".
*   [ ] **Leveling**: XP system based on characters typed (e.g., Rank: "Keyboard Explorer").
*   [ ] **Unlockables**: Themes, keyboard colors, or avatar decorations.
*   [ ] **Narrative Wrapper**: A simple story mode where completing lessons advances a plot (e.g., writing a letter to a friend).

## 🎓 Phase 5: Advanced Pedagogy
*Goal: Sophisticated skill development tools.*

*   [ ] **Timing Analysis**: Measure delay between keystrokes to identify hesitation.
*   [ ] **Rhythm Analysis**: Detect irregular patterns suggesting "hunting and pecking".
*   [ ] **Finger Isolation**: Single-finger and same-finger sequence drills.
*   [ ] **Blind Typing**: Progressive obscuration of the visual keyboard to force memory recall.
*   [ ] **Fluency**: Transition from random words to full sentences, punctuation, and capitalization.

## 🏗️ Phase 6: Technical Infrastructure
*Goal: Architecture to support complexity.*

*   [ ] **State Management**: Migrate to `useReducer` or Context for complex state (Session vs. Persistent).
*   [ ] **Performance**: Memoize keyboard rendering and debounce analytics calculations.
*   [ ] **Resilience**:
    *   Graceful degradation if storage fails.
    *   Auto-save progress mid-lesson.
    *   Key repeat detection.
*   [ ] **Codebase**: Separate content (word lists) from logic (scoring engines).

## 📚 Phase 7: Content Expansion
*Goal: Comprehensive educational content.*

*   [ ] **Vocabulary Sets**:
    *   High-frequency common words.
    *   Academic/School vocabulary.
    *   Themed sets (Animals, Hobbies).
*   [ ] **Cultural Localization**: Distinct word lists for pt-PT vs English.
*   [ ] **Practice Variety**:
    *   "Whack-a-mole" letter reaction games.
    *   Creative writing prompts.

## 📊 Phase 8: Assessment & Reporting
*Goal: Visibility for parents and teachers.*

*   [ ] **Benchmark Tests**: Standardized WPM/Accuracy tests at regular intervals.
*   [ ] **Diagnostic Reports**: PDF export of progress and trouble spots.
*   [ ] **Parent Dashboard**: Weekly summaries and "stuck" alerts.
*   [ ] **Certification**: Generate a certificate upon mastering specific levels.

## 📱 Phase 9: Mobile & Accessibility
*Goal: Inclusive access.*

*   [ ] **Tablet Optimization**: UI scaling for smaller screens (physical keyboard required).
*   [ ] **Screen Reader Support**: ARIA labels for keys and feedback.
*   [ ] **Visual Aids**: High contrast modes and adjustable font sizes.
*   [ ] **Motor Accommodations**: Adjustable timing windows for key presses.

## 🔬 Phase 10: Research & Iteration
*Goal: Validated effectiveness.*

*   [ ] **Effectiveness Tracking**: Pre-test vs. Post-test analysis.
*   [ ] **User Research**: Observe children using the app to find friction points.
*   [ ] **Feedback Loops**: Channels for bug reporting and feature requests.

---

## Implementation Timeline Estimate

| Phase | Est. Time | Priority |
| :--- | :--- | :--- |
| **Phase 2 (Persistence)** | 2-3 Weeks | 🔴 High |
| **Phase 3 (Adaptive)** | 1-2 Months | 🟡 Medium |
| **Phase 4 (Gamification)** | 3-4 Weeks | 🟢 Low |
| **Phase 7 (Content)** | Ongoing | 🔴 High |

*Note: Timeline estimates assume part-time development effort.*
