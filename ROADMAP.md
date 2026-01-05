
# Roteiro do Projeto | Project Roadmap

This document tracks the development milestones of **Teclado Mágico**.
Project Start Date: **January 3, 2026**.

## ✅ Phase 1: Core Foundation (Completed)
**Status:** Completed Jan 2026 (v1.0.0)
- [x] **React 19 Engine**: High-performance rendering with Framer Motion animations.
- [x] **Virtual Keyboard**: 3D perspective keyboard with real-time finger guidance.
- [x] **Basic Pedagogy**: Levels 1-3 (Home Row) implementation.
- [x] **Data Persistence**: LocalStorage architecture (No database required).

## ✅ Phase 2: Intelligence & Adaptation (Completed)
**Status:** Completed Jan 2026 (v1.1.0)
- [x] **Gemini AI Integration**: Dynamic text generation based on active keys.
- [x] **Smart Error Drill**: "Treino de Dificuldades" mode targeting weak keys.
- [x] **Analytics**: WPM, Accuracy, and Rhythm consistency tracking.
- [x] **Gamification**: XP System, Player Levels, and Avatar unlocking.

## ✅ Phase 3: Cultural & Regional Engine (Completed)
**Status:** Completed Feb 2026 (v1.3.0)
- [x] **Bicultural Prompts**: Strict prompt engineering to enforce European Portuguese and Angolan vocabulary.
- [x] **Regional Content**: Integration of cultural terms (e.g., Kwanza, Tejo, Imbondeiro).
- [x] **Language Hygiene**: System instructions to reject Brazilian Portuguese variants (e.g., gerunds).

## ✅ Phase 4: The "My Words" Update (Completed)
**Status:** Completed Mar 2026 (v1.4.0)
**Focus:** Empowering Parents & Teachers.
- [x] **Custom Lessons Engine**: UI for parents to create custom word lists or homework drills.
- [x] **Digital Diplomas**: Client-side PDF generation (`jspdf`) for printable level completion certificates.
- [x] **Data Sovereignty Tools**:
    - [x] JSON Export (Backup).
    - [x] JSON Import (Restore/Transfer).
- [x] **Parent Dashboard**: Centralized hub for managing multiple child profiles.

## ✅ Phase 5: Accessibility & Audio (Completed)
**Status:** Completed Mar 2026 (v1.4.0)
**Focus:** Inclusive learning.
- [x] **Magical Dictation**: New game mode using Text-to-Speech (TTS) to dictate words without visual cues.
- [x] **Visual Goals**: Replaced complex percentages with visual runners/progress bars for younger children.
- [x] **Generative Audio**: Web Audio API synth for "Thocky" keyboard sounds and success chimes.
- [x] **Hand Guide**: Interactive modal showing proper finger placement.

## ✅ Phase 6: Internationalization & Layouts (Completed)
**Status:** Completed Mar 2026 (v1.5.0)
**Focus:** Supporting Portuguese communities abroad & UX Polish.
- [x] **Multi-Layout Support**: Engine support for switching between QWERTY and AZERTY layouts.
- [x] **AZERTY Integration**: Full AZERTY visual keyboard mapping.
- [x] **Physical Layout Detection**: Heuristics to detect physical keyboard type via `navigator.keyboard` API.
- [x] **User Onboarding Redesign**: Overhauled "New Player" flow with avatar selection and visual layout picker.
- [x] **Documentation Visuals**: Added visual guides and screenshots to the Parents & Teachers Manual.

## ⏸️ Phase 7: Local Multiplayer - "O Recreio" (Paused)
**Status:** Paused for Security Review (v1.6.0)
**Reason:** Strict privacy audit requires "Serverless Signaling" to prevent IP leaks. Ghost Mode (Phase 7.1) implemented as a safe alternative.
- [x] **Ghost Mode**: Race against your own "Ghost" (previous best run).
- [ ] **WebRTC P2P Engine**: Allow two computers on the same Wi-Fi to connect directly.
- [ ] **Corrida de Palavras**: Real-time typing race.

## 🚀 Phase 8: Digital Literacy - "O Hacker" (v1.7.0)
**Status:** In Progress
**Focus:** Beyond the alphabet - Real world computer skills.
- [x] **AltGr Support**: Visual support for third-level keys (`@`, `[`, `]`, `{`, `}`).
- [x] **Code Syntax**: Levels specifically for `{ } [ ] < > ;` used in programming.
- [x] **Naming Conventions**: Training `camelCase` and `snake_case`.
- [ ] **Shortcuts Dojo**: Training for `Ctrl+C`, `Ctrl+V`.

## 🔮 Phase 9: Classroom Tools - "Sala de Aula" (v2.0.0)
**Status:** Planned
**Focus:** Solving the "No Database" problem for Teachers.
- [ ] **Magic QR Reporting**: Teachers scan student screen to log grades.
- [ ] **Homework Codes**: Codes (e.g., "TPC-34") that load specific configurations.
- [ ] **Kiosk Mode**: Setting to lock the UI.
