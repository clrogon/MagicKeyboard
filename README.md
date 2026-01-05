
# Teclado Mágico 🇵🇹 🇦🇴
### O Treinador de Digitação com Alma Lusófona
### *The Typing Trainer with a Lusophone Soul*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-rose)](package.json)
[![Status](https://img.shields.io/badge/Status-Production_Ready-green)](https://github.com/clrogon/MagicKeyboard)
[![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_Vite_%7C_Gemini_AI-8E75B2)](https://react.dev/)

---

## 📸 Galeria | Screenshots

<p align="center">
  <!-- 
    NOTE: Images are using placeholders because the AI environment deletes local binary files on sync.
  -->
  <img src="https://placehold.co/600x400/F43F5E/ffffff?text=Magic+QR+Reporting" alt="Relatório QR Mágico" width="45%" style="border-radius: 10px; margin-right: 10px;" />
  <img src="https://placehold.co/600x400/3B82F6/ffffff?text=Teacher+Dashboard" alt="Área de Pais e Professores" width="45%" style="border-radius: 10px;" />
</p>

<p align="center">
  <strong>Novo: Relatórios por Código QR (Esq.) e Gestão de Sala de Aula (Dir.)</strong>
</p>

---

## 🌟 Porquê o Teclado Mágico? | Why Magic Keyboard?

**O Problema:** A maioria dos treinadores de digitação online ou são apenas em Inglês ou, quando em Português, utilizam vocabulário e gramática do Brasil (PT-BR). Para crianças em **Portugal** e **Angola**, isto cria confusão linguística (ex: "tela" vs "ecrã", uso do gerúndio). Além disso, escolas com internet limitada ou restrições de privacidade (RGPD) têm dificuldade em usar ferramentas baseadas na nuvem.

**A Solução:** O **Teclado Mágico** é uma plataforma educativa "Privacy-First" e **Local-First**. Utiliza Inteligência Artificial para gerar exercícios infinitos e culturalmente relevantes, mas corre inteiramente no navegador da criança.

---

## 🚀 Funcionalidades de Destaque | Feature Highlights

### 🏫 Ferramentas "Sala de Aula" (Novidade v2.0)
Desenvolvidas para professores que não querem gerir logins ou bases de dados.
*   **Magic QR Reporting**: O aluno termina o nível e o ecrã gera um Código QR. O professor lê com o telemóvel e obtém instantaneamente o relatório (Nome, Nível, PPM, Precisão). Sem servidores, sem papel.
*   **Modo Kiosk**: Bloqueia o perfil do aluno. Impede a mudança de avatares ou temas para garantir foco total na aula.
*   **Códigos TPC**: O professor escreve "TPC-1" no quadro. O aluno insere o código e o jogo carrega a lista de palavras exata para a aula.

### 🛡️ Soberania de Dados (Privacy by Design)
A segurança das crianças é a nossa prioridade número um.
*   **Sem Base de Dados**: Não temos servidores para guardar dados de utilizadores.
*   **Armazenamento Local**: Todo o progresso é guardado encriptado no dispositivo (LocalStorage).
*   **Anonimato na IA**: Apenas enviamos prompts anónimos à Google Gemini (ex: "Gera frase com a letra J").

### 🧠 Inteligência Artificial Contextual
*   **Adaptação Cultural**: O sistema gera frases sobre *Imbondeiros*, *Pastéis de Nata*, *Rio Kwanza* e *Serra da Estrela*.
*   **Correção de Erros**: Se a criança falha no "R", a IA gera um "Treino de Dificuldades" focado nessa letra.

### 💻 Literacia Digital (Fase 8)
Para além do alfabeto, preparamos as crianças para o futuro:
*   **Modo Hacker**: Níveis dedicados a `camelCase`, `snake_case` e comandos de terminal.
*   **Alt Gr Mastery**: Ensino explícito de símbolos como `@`, `[`, `]`, `{`, `}` e `€`.

---

## 📚 Documentação | Documentation

*   🎓 **[Pedagogia e Método](docs/PEDAGOGY.md)**: Estrutura dos 20 níveis, incluindo Literacia Digital.
*   👨‍👩‍👧‍👦 **[Guia para Pais e Professores](docs/PARENTS_GUIDE.md)**: Manual de utilização, **Códigos TPC** e **Relatórios QR**.
*   🗺️ **[Roteiro (Roadmap)](ROADMAP.md)**: O desenvolvimento do projeto.
*   🛡️ **[Segurança](SECURITY.md)**: Detalhes sobre dados locais e GDPR.

---

## 🏗️ Arquitetura Técnica

O Teclado Mágico é uma **Progressive Web App (PWA)** que funciona **Offline**.

### Stack
*   **Frontend**: React 19 + TypeScript
*   **Build**: Vite
*   **AI**: Google GenAI SDK (Gemini 3 Flash)
*   **Reporting**: `react-qr-code` (Serverless reporting) & `jspdf` (Client-side certificates)

---

## 📦 Instalação

1.  **Clonar o Repositório**
    ```bash
    git clone https://github.com/clrogon/MagicKeyboard.git
    cd MagicKeyboard
    ```

2.  **Instalar Dependências**
    ```bash
    npm install
    ```

3.  **Configurar API Key**
    Crie um ficheiro `.env` na raiz:
    ```env
    API_KEY=a_tua_chave_api_aqui
    ```

4.  **Correr Localmente**
    ```bash
    npm run dev
    ```

---

<p align="center">
  <strong>Feito com ❤️ para a educação na CPLP.</strong><br>
  © 2026 Cláudio Roberto Gonçalves
</p>
