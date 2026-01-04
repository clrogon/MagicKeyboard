
# Changelog

Todas as alterações notáveis a este projeto serão documentadas neste ficheiro.
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-03-05 (A Atualização "As Minhas Palavras" | The "My Words" Update)

### Adicionado (Added)
-   **Lições Personalizadas**: Pais e professores podem agora criar listas de palavras específicas para TPC ou treino focado, guardadas localmente.
-   **Diplomas em PDF**: Geração de certificados de conclusão diretamente no navegador (sem envio de dados para servidores) para celebrar conquistas de nível.
-   **Backup e Restauro**: Funcionalidade de exportar/importar dados (ficheiro JSON) para permitir mover o progresso entre dispositivos mantendo a privacidade (GDPR).
-   **Melhorias de Acessibilidade**: Substituição de metas puramente numéricas por pistas visuais e narrativa.

### Alterado (Changed)
-   **Privacidade Reforçada**: Documentação e comentários de código atualizados para explicitar o processamento de dados 100% local.

## [1.3.0] - 2025-02-26 (A Atualização Cultural | The Cultural Update)

### Adicionado (Added)
-   **Integração Angola**: Os níveis e a IA agora geram vocabulário específico de Angola (ex: Kwanza, Muxima, Imbondeiro) juntamente com Português de Portugal.
-   **Níveis Revistos**: Os níveis 4, 5 e 6 foram reestruturados para garantir que todas as letras do alfabeto são ensinadas.
-   **Footer Informativo**: Créditos atualizados para refletir o foco em Portugal e Angola.

### Alterado (Changed)
-   **Terminologia Acessível**:
    -   "Modo Cego" renomeado para **"Teclas Invisíveis"** (Conceito de Magia).
    -   "Estatísticas" renomeado para **"O Meu Progresso"**.
    -   "Opções Avançadas" renomeado para **"Desafios Especiais"**.
    -   "Ferramentas" renomeado para **"Ajudas"**.
-   **Motor de IA**: O prompt do sistema foi atualizado para rejeitar estritamente termos do Português do Brasil (ex: gerúndio) e forçar referências geográficas locais.

## [1.2.0] - 2025-01-29 (Atualização Família | Family Update)

### Adicionado (Added)
-   **Suporte Multi-Utilizador**: Criação de múltiplos perfis no mesmo dispositivo.
-   **Área de Pais**: Dashboard para gestão de utilizadores e visualização de tempo total de jogo.
-   **Sistema de Temas**: Escolha entre temas Rosa, Azul e Âmbar.
-   **Modo História**: Geração de pequenas histórias criativas.

### Alterado (Changed)
-   **Progressão**: Requisito de nível facilitado (1 Estrela para passar).
-   **Dados**: Migração da estrutura do `localStorage` para suportar múltiplos utilizadores.

## [1.1.0] - 2025-01-27 (Atualização de Progressão)

### Adicionado
-   Sistema de XP e Níveis de Jogador.
-   Títulos e Avatares desbloqueáveis.
-   Desafios Diários.
-   Guia de Mãos Interativo.
-   Sons e Animações (Confetti).

## [1.0.0] - 2024-05-20
### Lançamento Inicial
-   Motor de digitação básico.
-   Teclado Virtual 3D.
-   Integração Gemini AI.
