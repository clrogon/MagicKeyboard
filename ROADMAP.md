
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
**Focus:** Supporting Portuguese communities abroad (France, Luxembourg).
- [x] **Multi-Layout Support**: Engine support for switching between QWERTY and AZERTY layouts.
- [x] **AZERTY Integration**: Full AZERTY visual keyboard mapping.
- [x] **Physical Layout Detection**: Heuristics to detect physical keyboard type via `navigator.keyboard` API.

## 🚧 Phase 7: Future Horizons (v2.0+)
**Status:** Planned for Late 2026
**Focus:** Classroom Dynamics, Social Play & Advanced Gamification.

### 👻 Advanced Gamification
- [ ] **Ghost Mode**: Race against your previous best performance (Time Trial).
- [ ] **Boss Battles**: Type against a "monster" where WPM deals damage.

### 🏫 Classroom Mode (Sala de Aula)
- [ ] **Teacher Dashboard**: A dedicated interface for teachers to manage 30+ students.
- [ ] **Bulk Import**: Ability to import a class list via CSV.
- [ ] **Homework Codes**: Teachers generate a code (e.g., "TPC-SEMANA-1") that students enter to load specific custom lessons.
- [ ] **Class Stats**: Aggregated analytics (e.g., "The class struggles with 'X' and 'Z'").

### ⚔️ Local Multiplayer (Corrida Mágica)
- [ ] **P2P Racing**: Using WebRTC for local-network typing races between students.
- [ ] **Team Challenges**: Cooperative typing where two students type different parts of the same story.

### ⌨️ Advanced Configurations
- [ ] **Voice Navigation**: Full menu navigation using voice commands for users with motor impairments.
