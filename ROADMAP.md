
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

## 🚧 Phase 7: Local Multiplayer - "O Recreio" (v1.6.0)
**Status:** In Design
**Focus:** Social play without internet/servers (Privacy-First Multiplayer).
- [ ] **WebRTC P2P Engine**: Allow two computers on the same Wi-Fi to connect directly (Host/Join).
- [ ] **Corrida de Palavras**: Real-time typing race where WPM moves a character across the screen.
- [ ] **Tag Team**: Cooperative mode where Player 1 types the noun, Player 2 types the verb.
- [ ] **Ghost Mode**: Race against your own "Ghost" (previous best run).

## 🔮 Phase 8: Digital Literacy - "O Hacker" (v1.7.0)
**Status:** Planned
**Focus:** Beyond the alphabet - Real world computer skills.
- [ ] **Shortcuts Dojo**: Training for `Ctrl+C`, `Ctrl+V`, `Alt+Tab`, `Ctrl+Z`.
- [ ] **Code Syntax**: Levels specifically for `{ } [ ] < > ;` used in programming.
- [ ] **Numpad Ninja**: Dedicated training for the numeric keypad (Data Entry skills).
- [ ] **Form Navigation**: Training the usage of `Tab` and `Shift+Tab` to move between fields.

## 🔮 Phase 9: Classroom Tools - "Sala de Aula" (v2.0.0)
**Status:** Planned
**Focus:** Solving the "No Database" problem for Teachers.
- [ ] **Magic QR Reporting**: At the end of a session, the app generates a QR code on the student's screen containing their WPM/Accuracy. The teacher scans it with their phone to instantly log the grade (Air-gapped data transfer).
- [ ] **Homework Codes**: Teachers generate a code (e.g., "TPC-34") that loads a specific locked lesson configuration.
- [ ] **Bulk CSV Import**: Import a class list of 30 names to generate profiles automatically.
- [ ] **Kiosk Mode**: Setting to lock the UI so students cannot change settings or exit the exercise.
