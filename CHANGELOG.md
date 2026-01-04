
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-29 (The Family & Accessibility Update)

### Added
-   **Multi-User Support**: Create multiple profiles on the same device, each with independent progression.
-   **Parent Dashboard**: New protected area for managing users and viewing global statistics (Total Play Time, Sessions).
-   **Theme System**: Users can now choose between **Rose** (Default), **Blue**, and **Amber** themes.
-   **Story Mode**: New game mode using AI to generate creative short stories (requires Level 11 logic).
-   **Blind Mode**: New advanced option to hide key labels on the 3D keyboard to force touch typing.
-   **UX Improvements**: 
    -   Briefing Card is now a modal overlay to prevent layout clipping.
    -   Simplified "Level 11" unlock logic for full keyboard storytelling.

### Changed
-   **Progression**: Relaxed level completion requirement. Players can now advance with **1 Star** (Level Completion) instead of requiring 2 stars.
-   **Data Structure**: Migrated `localStorage` schema to support dictionary of users (`users: {}`) instead of single flat object. Included auto-migration for legacy saves.

## [1.1.0] - 2025-01-27 (The Progression Update)

### Added
-   **XP & Level System**: Users now earn XP for every session based on performance.
-   **Player Profile**: Added Level, XP Bar, dynamic Titles (e.g., "Mestre da Base"), and selectable Avatars.
-   **Daily Challenges**: A new mission is generated daily (e.g., "Get 3 Stars") offering bonus XP.
-   **Hand Guide Modal**: Interactive visual guide explaining the Home Row position and tactile bumps.
-   **Privacy Features**: Added GDPR-compliant Privacy Modal and Cookie Banner with "Clear Data" functionality.
-   **New Achievements**: Added 5 new badges including "Streak", "Symbol Expert", and "Time Lord".
-   **Visual Polish**: Added Framer Motion animations to result screens, key presses, and level selection.

### Changed
-   **UI Overhaul**: The Level Selector now features a rich profile header.
-   **Error Decay**: Correct keystrokes now gradually reduce historical error counts for better drill targeting.
-   **Footer**: Added privacy controls and attribution.

## [1.0.0] - 2024-05-20
### Initial Release
-   Basic home row exercises.
-   Campaign mode with 7 levels.
-   Visual keyboard integration.
-   Local storage for progress saving.
-   **Timed Mode**: 30s and 60s speed challenges.
-   **Error Drill Mode**: Custom exercises targeting user's specific weak keys using Gemini AI.
-   **Stats Dashboard**: Visual charts for WPM and Accuracy history.
-   **Confetti**: Celebration effects for level completion.
-   **Localization**: Full European Portuguese (pt-PT) support (Tu/Infinitive).
