
# Changelog

Todas as alterações notáveis a este projeto serão documentadas neste ficheiro.
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-25 (A Atualização "Sala de Aula" | The Classroom Update)

### Adicionado (Added)
-   **Magic QR Reports**: No final de cada nível, é gerado um Código QR que contém um relatório de texto simples (Nome, Nível, PPM, Precisão). Os professores podem ler este código com a câmara do telemóvel para registar notas sem precisar de base de dados.
-   **Modo Kiosk (Professor)**: Nova opção na Área de Pais para bloquear o perfil do aluno. Impede a mudança de Avatar/Tema e requer um desafio matemático para sair da conta.
-   **Códigos TPC**: Novo botão no menu principal para inserir códigos rápidos (ex: "TPC-1") que carregam lições pré-definidas para toda a turma.
-   **Novos Níveis de Literacia Digital**:
    -   Nível 18: Variáveis (camelCase, snake_case).
    -   Nível 19: O Hacker (Alt Gr, @, [], {}).
    -   Nível 20: O Sistema (Comandos de Terminal e Código).
-   **Ghost Mode**: Vê o teu próprio "fantasma" (melhor tempo anterior) a correr contra ti nos níveis repetidos.

### Alterado (Changed)
-   **QR Code Legível**: O QR Code agora gera texto formatado e legível por humanos em vez de JSON bruto.
-   **Interface de Resultados**: Redesenhada para destacar o botão "QR Pro".

## [1.5.0] - 2026-03-20 (A Atualização Internacional | The International Update)

### Adicionado (Added)
-   **Suporte AZERTY**: Adicionado suporte completo para teclados franceses/belgas, crucial para comunidades emigrantes.
-   **Deteção Automática de Hardware**: O sistema deteta agora fisicamente o layout do teclado do utilizador (via `navigator.keyboard` API) e ajusta a interface automaticamente.
-   **Seleção de Layout no Perfil**: Nova opção durante a criação de perfil para escolher explicitamente entre QWERTY (PT) e AZERTY (FR).

### Alterado (Changed)
-   **Melhorias na UI de Criação de Utilizador**: Formulário redesenhado para ser mais intuitivo.

## [1.4.0] - 2026-03-05 (A Atualização "As Minhas Palavras" | The "My Words" Update)

### Adicionado (Added)
-   **Lições Personalizadas**: Pais e professores podem agora criar listas de palavras específicas para TPC ou treino focado, guardadas localmente.
-   **Diplomas em PDF**: Geração de certificados de conclusão diretamente no navegador.
-   **Backup e Restauro**: Funcionalidade de exportar/importar dados (ficheiro JSON).
-   **Melhorias de Acessibilidade**: Substituição de metas puramente numéricas por pistas visuais.
-   **Modo Ditado**: Novo modo de jogo utilizando síntese de voz (TTS).

## [1.3.0] - 2026-02-26 (A Atualização Cultural | The Cultural Update)

### Adicionado (Added)
-   **Integração Angola**: Vocabulário específico de Angola (ex: Kwanza, Muxima, Imbondeiro).
-   **Footer Informativo**: Créditos atualizados para refletir o foco em Portugal e Angola.

## [1.2.0] - 2026-01-29 (Atualização Família | Family Update)

### Adicionado (Added)
-   **Suporte Multi-Utilizador** e **Área de Pais**.
-   **Sistema de Temas** e **Modo História**.

## [1.1.0] - 2026-01-27 (Atualização de Progressão)

### Adicionado
-   Sistema de XP, Níveis, Títulos e Desafios Diários.

## [1.0.0] - 2026-01-20 (Lançamento Inicial)
### Adicionado
-   Motor de digitação, Teclado 3D, Integração Gemini AI.
