# Contributing to Teclado Mágico

First off, thank you for considering contributing to Teclado Mágico! It's people like you that make tools for education better.

## 🇧🇷 vs 🇵🇹 Language Guidelines

**Crucial:** This project targets **European/Angolan Portuguese (pt-PT)**.
When contributing text or UI changes, please adhere to the following strict rules:

1.  **Addressing the User**: Always use **"Tu"** (2nd person singular informal). Never use "Você".
    *   *Correct*: "Tu conseguiste!", "O teu progresso".
    *   *Incorrect*: "Você conseguiu!", "Seu progresso".
2.  **Verb Forms**: Avoid the Gerund (Gerúndio) for ongoing actions. Use "a + infinitive".
    *   *Correct*: "A carregar...", "A preparar desafio...".
    *   *Incorrect*: "Carregando...", "Preparando desafio...".
3.  **Vocabulary**: Use European terminology where it differs (e.g., "Ecrã" instead of "Tela", though "Rato" vs "Mouse" is less relevant for touch typing).

## 🛠️ Development Process

1.  **Fork the repo** and create your branch from `main`.
2.  **Install dependencies** (if we transition to a package.json workflow in the future). Currently, ensure standard ES Module compatibility.
3.  **Test your changes**. Ensure the Virtual Keyboard renders correctly on different screen sizes.
4.  **Linting**: Keep code clean. We prefer Prettier/ESLint standards.

## 🐛 Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:
-   The browser and version you are using.
-   Steps to reproduce the bug.
-   Expected behavior vs. actual behavior.

## ✉️ Pull Requests

1.  Ensure the PR description clearly describes the problem and solution.
2.  Include screenshots for any UI changes.
3.  If adding a new Feature Level, ensure it follows the finger progression logic (Home row -> Top/Bottom -> Shift).

By contributing, you agree that your contributions will be licensed under its MIT License.
