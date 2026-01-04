
# Teclado Mágico 🇵🇹 🇦🇴
### O Treinador de Digitação com Alma Lusófona
### *The Typing Trainer with a Lusophone Soul*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.4.0-rose)](package.json)
[![Status](https://img.shields.io/badge/Status-Production_Ready-green)](https://github.com/yourusername/teclado-magico)
[![Tech Stack](https://img.shields.io/badge/Stack-React_18_%7C_Vite_%7C_Gemini_AI-8E75B2)](https://react.dev/)

---

## 🌟 Porquê o Teclado Mágico? | Why Magic Keyboard?

**O Problema:** A maioria dos treinadores de digitação online ou são apenas em Inglês ou, quando em Português, utilizam vocabulário e gramática do Brasil (PT-BR). Para crianças em **Portugal** e **Angola**, isto cria confusão linguística (ex: "tela" vs "ecrã", "mouse" vs "rato", uso do gerúndio).

**A Solução:** O **Teclado Mágico** é uma plataforma educativa "Privacy-First" que utiliza Inteligência Artificial para gerar exercícios infinitos, culturalmente relevantes e gramaticalmente corretos para o contexto Luso-Afro-Europeu.

> **Our Mission:** To provide a safe, engaging, and culturally accurate typing environment for children in the CPLP (Community of Portuguese Language Countries), specifically focusing on the linguistic nuances of Portugal and Angola.

---

## 🚀 Funcionalidades de Destaque | Feature Highlights

### 🧠 Inteligência Artificial Contextual (Gemini Powered)
Ao contrário de sites que repetem as mesmas frases estáticas, o Teclado Mágico usa a **API Google Gemini** para criar conteúdos dinâmicos.
*   **Adaptação Cultural**: O sistema sabe a diferença entre o Tejo e o Kwanza. Gera frases sobre *Imbondeiros*, *Pastéis de Nata*, *Palancas Negras* e *Elétricos de Lisboa*.
*   **Correção de Erros em Tempo Real**: Se a criança falha muito nas teclas "A" e "S", a IA gera automaticamente um "Treino de Dificuldades" focado nessas letras.
*   **Zero Alucinações**: Prompting rigoroso garante que o conteúdo é seguro para crianças e pedagogicamente útil.

### 🛡️ Soberania de Dados (Privacy by Design)
A segurança das crianças é a nossa prioridade número um.
*   **Sem Base de Dados**: Não temos servidores para guardar dados de utilizadores.
*   **Armazenamento Local**: Todo o progresso, XP e perfis são guardados encriptados no dispositivo (LocalStorage).
*   **Anonimato na IA**: Quando pedimos frases à Google, enviamos pedidos anónimos (ex: "Gera uma frase com a letra J"). Nenhum dado da criança é enviado para a cloud.
*   **GDPR/RGPD**: Totalmente compatível com as normas europeias de proteção de dados.

### 🎮 Gamificação RPG
Aprender não tem de ser aborrecido. Transformámos a digitação num jogo.
*   **Sistema de XP e Níveis**: Evolui de "Aprendiz" até "A Lenda do Teclado".
*   **Streak Diário**: Incentivos para a prática diária consistente.
*   **Desafios Aleatórios**: Missões diárias (ex: "Atinge 98% de precisão") com recompensas extra.
*   **Avatares e Temas**: Personalização visual com temas de alto contraste (Rosa, Azul, Âmbar).

### 🎓 Ferramentas para Pais e Professores (v1.4.0)
*   **Lições Personalizadas**: O professor pode criar um ditado específico ou lista de palavras para TPC.
*   **Certificados Oficiais**: Geração de Diplomas em PDF diretamente no navegador para celebrar a conclusão de níveis.
*   **Backup e Portabilidade**: Exporte o progresso do aluno para um ficheiro JSON e leve-o para outro computador.
*   **Modo Ditado (Acessibilidade)**: Utiliza síntese de voz (TTS) para ditar palavras, treinando a ortografia auditiva.

---

## 🗺️ Inclusão Cultural: Portugal & Angola

Este projeto celebra a lusofonia. Os níveis avançados e o Modo História introduzem vocabulário específico:

| Categoria | Portugal 🇵🇹 | Angola 🇦🇴 |
|-----------|-------------|-----------|
| **Geografia** | Tejo, Serra da Estrela, Algarve | Kwanza, Lubango, Cabinda |
| **Cultura** | Fado, Galo de Barcelos, Azulejo | Semba, Kizomba, Pensador |
| **Fauna/Flora**| Lince Ibérico, Sobreiro | Palanca Negra, Imbondeiro |
| **Culinária** | Sardinha, Caldo Verde | Muamba, Funge, Ginguba |

---

## 🔮 Roteiro de Desenvolvimento | Roadmap

O projeto começou em **3 de Janeiro de 2026** e encontra-se na versão de produção v1.4.0.

| Fase | Foco | Versão | Estado |
| :--- | :--- | :--- | :--- |
| **Fase 1** | **Fundação Técnica** (PWA, Motor de Jogo) | v1.0.0 | ✅ Concluído |
| **Fase 2** | **Inteligência** (IA, Treino de Erros, Gamificação) | v1.1.0 | ✅ Concluído |
| **Fase 3** | **Motor Cultural** (Adaptação PT/AO) | v1.3.0 | ✅ Concluído |
| **Fase 4** | **"As Minhas Palavras"** (Lições, Diplomas, Backup) | v1.4.0 | ✅ Concluído |
| **Fase 5** | **Acessibilidade** (Modo Ditado/TTS, Guias Visuais) | v1.4.0 | ✅ Concluído |
| **Fase 6** | **Sala de Aula** (Modo Multijogador, Turmas) | v2.0+ | 🚧 Planeado |

*Para veres o roteiro detalhado, consulta o ficheiro [ROADMAP.md](ROADMAP.md).*

---

## 🏗️ Arquitetura Técnica | Technical Architecture

O Teclado Mágico é uma **Progressive Web App (PWA)**, o que significa que pode ser instalada no computador/tablet e funciona **Offline**.

### Stack
*   **Frontend**: React 18 + TypeScript (Performance e Tipagem estrita)
*   **Build Tool**: Vite (Carregamento instantâneo)
*   **Styling**: Tailwind CSS (Design responsivo e acessível)
*   **Audio**: Web Audio API (Sintetizador de som nativo, sem assets pesados)
*   **Visualização**: Recharts (Gráficos de progresso) & Framer Motion (Animações fluidas)

### Fluxo de Dados (Data Flow)

```mermaid
graph TD
    User([Aluno / Student]) -->|Interação| UI[React UI Layer]
    
    subgraph "Navegador (Client-Side Only)"
        UI --> Engine[Game Engine]
        Engine -->|Validação| Typist[Typing Logic]
        Engine -->|Sons| Audio[Web Audio Synth]
        Engine -->|Persistência| LocalStore[LocalStorage]
        
        UI -->|Gestão| ParentDash[Área de Pais]
        ParentDash -->|Export/Import| JSON[Ficheiro Backup]
        ParentDash -->|Gerar| PDF[jsPDF Generator]
    end
    
    subgraph "Cloud (Stateless & Anonymous)"
        Engine -->|Request: 'Gera frase com F e J'| Gemini[Google Gemini Flash API]
        Gemini -->|Response: 'A fada fala já'| Engine
    end
```

---

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
*   Node.js 18+
*   Uma chave de API do Google Gemini (Gratuita para desenvolvimento no Google AI Studio)

### Passos
1.  **Clonar o Repositório**
    ```bash
    git clone https://github.com/yourusername/teclado-magico.git
    cd teclado-magico
    ```

2.  **Instalar Dependências**
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente**
    Crie um ficheiro `.env` na raiz:
    ```env
    API_KEY=a_tua_chave_api_aqui
    ```

4.  **Correr Localmente**
    ```bash
    npm run dev
    ```

---

## 📚 Roteiro de Conteúdos | Syllabus

O curso está estruturado em 13 fases pedagógicas:

1.  **A Linha Mágica**: F e J (Dedos indicadores)
2.  **Vizinhos Amigos**: D e K
3.  **Família Completa**: S, L, A, Ç (Home Row completa)
4.  **A Subir**: E, I, O, T
5.  **Exploradores**: R, U, N, M, C, V
6.  **Mestre do Alfabeto**: B, G, H, P, Q, W, X, Y, Z + Shift
7.  **Símbolos**: Pontuação básica
8.  **Números**: Esquerda (1-5)
9.  **Números**: Direita (6-0)
10. **Pontuação Extra**: ! ? -
11. **Histórias do Mundo**: Frases completas PT/AO
12. **Acentos Agudos**: á, é, í, ó, ú, à
13. **Ondas e Chapéus**: ã, õ, â, ê, ô

---

## 🤝 Contribuir

Contribuições são muito bem-vindas, especialmente de educadores e falantes nativos de Português Europeu e de Angola para refinar os prompts culturais. Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de submeter um Pull Request.

## 📄 Licença

Distribuído sob a licença MIT. Ver [LICENSE](LICENSE) para mais informações.

---

<p align="center">
  <strong>Feito com ❤️ para o futuro da educação na CPLP.</strong><br>
  © 2026 Cláudio Roberto Gonçalves
</p>
