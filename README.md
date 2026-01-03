# Teclado Mágico (Magic Keyboard) 🎹✨

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-TypeScript-blue)
![Framework](https://img.shields.io/badge/framework-React-cyan)

**Teclado Mágico** is a gamified typing trainer designed specifically for children learning to type in **European and Angolan Portuguese**. Unlike generic typing tools, it avoids Brazilian Portuguese phrasing and focuses on the "Tu" (informal singular) form, making it culturally appropriate for children in these regions.

The application starts with the home row and gradually introduces new keys through game-like exercises, using positive reinforcement (stars, levels, confetti) to build muscle memory.

## 🚀 Features

-   **Progressive Learning**: 7 distinct levels starting from the home row (F & J) up to Shift keys and symbols.
-   **Gamification**: Earn stars, unlock levels, and view confetti celebrations upon completion.
-   **Smart Drills**: Uses **Google Gemini AI** to generate infinite, context-aware typing exercises.
-   **Special Modes**:
    -   **Campaign**: Unlock levels one by one.
    -   **Time Attack**: 30s and 60s speed challenges.
    -   **Error Drill**: AI-generated sentences targeting your specific weak keys.
-   **Visual Guidance**: On-screen keyboard showing exact finger placement.
-   **Child-Friendly UI**: Bright colors, large text, and encouraging feedback in European Portuguese.

## 🗺️ Roadmap

We have a comprehensive 10-phase development plan focusing on pedagogy and engagement.
👉 **[View the full ROADMAP.md](./ROADMAP.md)**

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion, Canvas Confetti
-   **AI Integration**: Google GenAI SDK (Gemini 2.5/3 models)
-   **Icons**: Lucide React
-   **Charts**: Recharts

## 📦 Installation & Setup

This project uses modern browser standards (ES Modules via `importmap`) and can be run without a complex build step for development, or bundled for production.

### Prerequisites

-   A Google Gemini API Key (for dynamic text generation).
-   A local web server (e.g., Live Server, python http.server, or Vite).

### Quick Start

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/teclado-magico.git
    cd teclado-magico
    ```

2.  **Environment Setup**
    Create a `.env` file (if using a build tool) or export your API key in your environment.
    *Note: For the pure browser version included in `index.html`, ensure you have a way to inject `process.env.API_KEY` or modify `services/geminiService.ts` to handle the key securely.*

3.  **Run**
    Simply serve the root directory.
    ```bash
    # Using python
    python3 -m http.server 8000
    
    # Or using npx serve
    npx serve .
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:8000`

## 🌍 Localization

This project is strictly localized for **pt-PT** (European Portuguese).
-   **Pronouns**: Uses "Tu" instead of "Você".
-   **Grammar**: Avoids gerunds (e.g., uses "A preparar" instead of "Preparando").
-   **Vocabulary**: Adapted for children in Portugal and Angola.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit changes, specifically regarding language localization rules.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
