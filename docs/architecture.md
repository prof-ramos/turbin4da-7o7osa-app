# Arquitetura do Sistema

Este documento descreve a arquitetura do sistema do projeto React/TypeScript empacotado com Vite, com foco na aplicação de jogo simples que utiliza componentes como StartScreen, GameBoard, Scoreboard e GameOverScreen, incluindo suporte a PWA e recursos mobile.

## 1. Visão geral de alto nível

### Objetivos e requisitos do sistema

- Objetivo: Fornecer uma aplicação web (SPA) de jogo casual com experiência fluida em desktop e mobile, suporte a PWA e arquitetura simples e manutenível.
- Requisitos funcionais:
  - Iniciar partida (StartScreen), jogar no tabuleiro (GameBoard), visualizar pontuação (Scoreboard) e finalizar (GameOverScreen).
  - Atualização de pontuação durante a partida.
  - Reinício de jogo após Game Over.
  - Integração com controles mobile e estilos responsivos.
  - Suporte a PWA para instalação e funcionamento básico offline.
- Requisitos não funcionais:
  - Desempenho adequado em dispositivos móveis (input responsivo, renderizações eficientes).
  - Manutenibilidade (TypeScript, separação por componentes, contratos bem definidos).
  - Build rápido e DX com Vite.
  - Compatibilidade com navegadores modernos (Service Worker requer HTTPS).

### Contexto e escopo

- Contexto: Frontend SPA React + TypeScript, empacotado com Vite.
- Escopo: UI, lógica do jogo no cliente, estados locais. Sem backend próprio. Integração externa mínima (apenas Web APIs do navegador).
- Fora de escopo: autenticação, persistência de dados em servidor, multiplayer.

### Stakeholders e usuários

- Stakeholders: equipe de desenvolvimento, mantenedores do repositório, docentes/avaliadores (se acadêmico).
- Usuários finais: jogadores em navegadores desktop e mobile.

### Restrições técnicas e de negócio

- Executar em navegadores modernos sem instalação nativa.
- Tipagem com TypeScript (tsconfig.json).
- Empacotamento/servidor dev com Vite (vite.config.ts).
- Estrutura por componentes React.

### Decisões arquiteturais principais

- Framework: React + TypeScript (SPA).
- Bundler: Vite.
- Componentização clara das telas: Start → Game → Over.
- Suporte PWA via `pwa_files.js` (registro de Service Worker/manifest).
- Módulos mobile dedicados: `mobile_controls.ts`, `mobile_screens.ts`, `mobile_styles.css`.
- Contratos e valores compartilhados em `types.ts` e `constants.ts`.

---

## 2. Interações de componentes

### Diagrama de componentes (C4 – nível de componentes, textual)

- App (App.tsx)
  - Orquestra o fluxo de telas e mantém o estado raiz do jogo (fase, score).
  - Renderiza StartScreen, GameBoard, Scoreboard, GameOverScreen conforme a fase.
- StartScreen (components/StartScreen.tsx)
  - Componente de apresentação com ação para iniciar o jogo.
- GameBoard (components/GameBoard.tsx)
  - Contém a lógica do jogo/loop e integra inputs (teclado/toque) via `mobile_controls.ts`.
  - Emite callbacks para o App: `onScore(delta)`, `onGameOver(summary)`.
- Scoreboard (components/Scoreboard.tsx)
  - Exibe pontuação atual (stateless).
- GameOverScreen (components/GameOverScreen.tsx)
  - Mostra resultado/score final e ação para reinício.
- Suporte/infra:
  - `mobile_controls.ts`: abstrações de input mobile (toque/gestos).
  - `mobile_screens.ts`: utilidades de layout/config mobile.
  - `mobile_styles.css`: estilos responsivos.
  - `advanced_mobile_features.ts`: vibração/full screen/orientação (se aplicável).
  - `pwa_files.js`: registro de SW/manifest e estratégias de cache.
  - `constants.ts`: valores/configurações compartilhadas (ex.: limites, tempos).
  - `types.ts`: contratos/tipos centrais.
  - `app_integration.ts`: integrações de alto nível (glue code PWA/mobile quando necessário).

### Interfaces entre módulos (contratos)

- StartScreen props: `onStart: () => void`
- GameBoard props:
  - `onScore: (delta: number) => void`
  - `onGameOver: (summary: GameSummary) => void`
  - (opcional) configs via `constants.ts`
- Scoreboard props: `score: number`
- GameOverScreen props:
  - `score: number`
  - `onRestart: () => void`
- mobile_controls:
  - `addInputListeners(target: EventTarget, handler: (action: InputAction) => void): void`
  - `removeInputListeners(target: EventTarget): void`
- types.ts (exemplos esperados):
  - `type GamePhase = 'Start' | 'Playing' | 'GameOver'`
  - `interface GameSummary { score: number; durationMs?: number; ... }`
  - `type InputAction = 'Left' | 'Right' | 'Up' | 'Down' | 'Tap' | 'Hold' | 'Pause'`

### Fluxo de dados

- Top-down: App (fonte de verdade) → props → componentes.
- Bottom-up: componentes emitem callbacks → App atualiza estado → re-render.
- Armazenamento: estado React em memória; opcionalmente Web Storage (ex.: highscores).

### Padrões de comunicação

- Props/callbacks entre componentes (React).
- Event handlers (teclado/toque) traduzidos para `InputAction`.
- PWA/Service Worker para caching de assets, atualização versionada e fallback offline seguro.

### Dependências externas

- React, ReactDOM.
- Vite toolchain (dev/build).
- Web APIs: Service Worker, Cache, Pointer/Touch Events, Vibration/Screen (se usados).

### APIs e contratos (resumo)

- Callbacks: `onStart`, `onScore(delta)`, `onGameOver(summary)`, `onRestart`.
- Tipos/constantes centralizados em `types.ts` e `constants.ts`.
- Módulos mobile e PWA expõem funções utilitárias/documentadas.

---

## 3. Diagramas de fluxo de dados

### Fluxo de dados principal

1. App monta `StartScreen`.
2. Usuário aciona `onStart` → App inicializa estado e renderiza `GameBoard` + `Scoreboard`.
3. `GameBoard` processa inputs e lógica interna; emite `onScore(delta)` durante o jogo.
4. Em condição de término, `GameBoard` emite `onGameOver(summary)`.
5. App muda para `GameOverScreen`, exibe `score`.
6. Usuário aciona `onRestart` → App reseta estado e volta ao `StartScreen`.

### Processamento de eventos

- Evento de input (teclado/toque) → `mobile_controls` → `GameBoard.handleInput` → atualiza estado interno → possivelmente `onScore` → App.setScore → re-render `Scoreboard`.
- Condição de fim → `onGameOver(summary)` → App muda fase para GameOver.

### Pipeline de dados

- Entrada: eventos do usuário.
- Processamento: regras do jogo no `GameBoard`.
- Saída: renderização UI, atualização de pontuação e tela final.
- Persistência opcional: `localStorage`/`IndexedDB` se necessário (não obrigatória).

### Transformações e mapeamentos

- Eventos brutos → `InputAction`.
- `InputAction` → transições de estado do jogo (posição, colisões, score).
- Estados atualizados → callbacks (score/game over) → estado do App → UI.

### Pontos de entrada e saída

- Entrada: cliques, teclas, toques/gestos; possivelmente prompt de instalação PWA.
- Saída: DOM renderizado; registro do Service Worker; vibração/FS em mobile (se implementado).

### Armazenamento de dados

- Primário: memória (estado React).
- Secundário (opcional): Web Storage para preferências/scores locais.
- Não há base de dados externa.

---

## 4. Decisões de design e justificativa

### Trade-offs considerados

- SPA com estado local vs. gerenciadores globais (Redux/Zustand):
  - Decisão: estado local no App para simplicidade; escalável depois.
- PWA:
  - Decisão: habilitar instalação/offline com baixo overhead de manutenção do SW.
  - Política de atualização do SW: ver seção "Política de atualização do Service Worker (SW)".
- Mobile-first:
  - Decisão: módulos e estilos dedicados melhoram UX em telas pequenas.

### Alternativas avaliadas

- Bundlers: Webpack/Parcel vs. Vite → Vite por velocidade e DX.
- Frameworks: Vue/Svelte vs. React → React pela ubiquidade e domínio da equipe.
- Estado global: adiado até que complexidade justifique.

### Critérios de decisão

- Simplicidade, performance, curva de aprendizado, suporte mobile/PWA, manutenção.

### Impacto nas qualidades do sistema

- Desempenho: Vite + React para builds e HMR rápidos; lógica de jogo leve.
- Manutenibilidade: TypeScript e contratos claros reduzem acoplamento.
- Portabilidade: PWA e web standards ampliam alcance.
- Testabilidade: componentes dirigidos por props/callbacks.

### Riscos e mitigações

- Crescimento de complexidade no `GameBoard`:
  - Mitigar com submódulos (ex.: sistemas de input, física, pontuação) e testes.
- Divergência UX desktop/mobile:
  - Centralizar input em `mobile_controls` e aplicar CSS responsivo.
- Cache PWA desatualizado:
  - Versionar assets e implementar atualização de SW com skipWaiting/clientsClaim quando apropriado.
  - Adotar fallback de navegação para index.html em falhas de rede quando aplicável.

### Lições aprendidas

- Contratos em `types.ts` previnem regressões e facilitam refatorações.
- Antecipar UX mobile reduz retrabalho.
- Separar telas (Start/Playing/Over) simplifica fluxo e estado.

---

## 5. Restrições e limitações do sistema

### Limitações técnicas

- Ausência de backend impede recursos colaborativos e sincronização entre dispositivos.
- Dependência em APIs Web modernas pode limitar suporte a navegadores antigos.

### Restrições de performance

- Dispositivos low-end: necessário evitar re-renders excessivos e usar `requestAnimationFrame` no loop do jogo.

### Limitações de segurança

- Sem autenticação; dados locais podem ser manipulados pelo cliente.
- Service Worker exige HTTPS para funcionar plenamente.

### Restrições de compliance

- Sem coleta de dados por padrão; se houver coleta futura, atender LGPD/Consentimento.
- Recomendado observar diretrizes de acessibilidade (WCAG) na UI.

### Dependências de terceiros

- React/ReactDOM, Vite, SW APIs. Acompanhar CVEs e updates.

### Considerações de manutenibilidade

- Ativar `strict` no TypeScript (quando possível).
- Documentar contratos via JSDoc e comentários nos componentes.
- Manter `constants.ts` e `types.ts` como fontes de verdade para valores e tipos.

---

## Diagramas

### Diagrama de estados (UML State Machine)

```
[Start] --onStart--> [Playing] --onGameOver--> [GameOver] --onRestart--> [Start]
```

### Diagrama de fluxo (alto nível)

```
User Input -> mobile_controls -> GameBoard.logic -> onScore/onGameOver -> App.state -> UI (Scoreboard/GameOver)
```

---

## Especificações (por arquivo)

- App.tsx
  - Mantém `phase: GamePhase`, `score: number`.
  - Renderiza StartScreen/Playing(GameBoard+Scoreboard)/GameOverScreen.
  - Manipula callbacks: `onStart`, `onScore`, `onGameOver`, `onRestart`.

- components/StartScreen.tsx
  - Props: `{ onStart: () => void }`.
  - Componente de apresentação, sem estado global.

- components/GameBoard.tsx
  - Props: `{ onScore(delta: number): void; onGameOver(summary: GameSummary): void }`.
  - Loop de jogo com `requestAnimationFrame`/`useEffect`.
  - Integra `mobile_controls` para mapear eventos a `InputAction`.

- components/Scoreboard.tsx
  - Props: `{ score: number }`.
  - Renderização pura.

- components/GameOverScreen.tsx
  - Props: `{ score: number; onRestart: () => void }`.

- constants.ts
  - Configurações de jogo: tempos, limites, tamanhos, cores, etc.

- types.ts
  - Tipos compartilhados: `GamePhase`, `GameSummary`, `InputAction`, etc.

- mobile_controls.ts
  - API para registro de listeners touch/pointer e tradução para `InputAction`.

- mobile_screens.ts
  - Utilidades/feature flags para comportamento mobile (ex.: orientation lock).

- mobile_styles.css
  - CSS responsivo e estilos específicos para mobile.

- advanced_mobile_features.ts
  - Acesso a APIs como Vibration, Fullscreen, Screen Orientation (progressivo).

- pwa_files.js
  - Registro do Service Worker e manifest.
  - Estratégias de cache para assets estáticos e fallback básico.
  - Implementa versão de cache, remoção de caches antigos, e suporte a skipWaiting/clientsClaim via mensagem.

- index.html / index.tsx / vite.config.ts / tsconfig.json
  - Bootstrap da aplicação, ponto de entrada React, configurações de build e TS.

---

## Exemplos (casos de uso)

1) Jogar no mobile

- Usuário abre app e toca em “Start”.
- Desliza/toque para interagir; `GameBoard` processa e atualiza score.
- Ao perder, `GameOverScreen` exibe pontuação e botão “Restart”.

2) Instalação PWA

- Navegador elegível apresenta prompt de instalação.
- Após instalado, usuário pode abrir o app e jogar offline (assets em cache).

---

## Glossário

- GamePhase: estado atual do jogo (Start, Playing, GameOver).
- InputAction: ação mapeada a partir de eventos de input (Left, Right, Up, Down, Tap, Hold, Pause).
- PWA: Progressive Web App — app web instalável com suporte offline.
- Service Worker: script que intercepta requisições de rede para caching/offline.

---

## 6. Política de atualização do Service Worker (SW)

Esta seção documenta a política de versão, atualização e fallback do Service Worker para evitar problemas de “stale cache”.

Resumo das decisões

- Versionamento de cache: cada release atualiza o sufixo do CACHE_NAME (ex.: turbin4da-7o7osa-v1 → -v2).
- Estratégia de cache:
  - Pré-cache de assets essenciais durante install (cache-first para assets estáticos).
  - Network-first com cache de preenchimento para requests não encontrados (dinâmico com cache.put).
- Limpeza de caches antigos: na fase activate, todos os caches cujo nome difira do CACHE_NAME atual são removidos.
- Atualização imediata (opcional): suportamos skipWaiting via mensagem do cliente para promover o SW recém-instalado.
- Assumir o controle dos clientes: após a ativação, o SW deve adotar clientsClaim para controlar imediatamente as abas abertas.
- Fallback offline:
  - Para navegação (navegations), caso a rede falhe e não haja cache, retornar index.html (SPA fallback), quando configurado.
  - Para assets, retornar do cache quando disponível; caso contrário, falha explícita.

Versão e empacotamento

- O arquivo pwa_files.js define const CACHE_NAME = 'turbin4da-7o7osa-v1'. Ao lançar uma nova versão:
  1) Atualizar o sufixo da versão em CACHE_NAME.
  2) Garantir que a lista de urlsToCache inclua somente caminhos válidos gerados no build (prod prefere arquivos estáticos do dist/).
  3) Fazer deploy do novo SW; navegadores instalarão o novo worker em paralelo, mantendo o antigo atendendo as abas existentes até a ativação.

Ciclo de vida e promoção do SW

- install: abre o cache atual e adiciona os arquivos essenciais (precache).
- activate:
  - Deleta caches cujo nome não corresponda ao CACHE_NAME atual.
  - clientsClaim(): o SW passa a controlar imediatamente as páginas ativas (evita período sem cobertura do SW novo).
- fetch:
  - cache-first para assets presentes no cache (retorna rápido e offline-friendly).
  - Em falta no cache, tenta rede; em sucesso, clona e armazena no cache atual (cache de preenchimento).
  - Em falha de rede:
    - Se request é de navegação (mode 'navigate'), tentar retornar index.html do cache (SPA fallback).
    - Caso contrário, retornar erro padrão (ou um fallback específico se configurado).

Atualização imediata com skipWaiting e clientsClaim

- Por padrão, o SW novo entra em estado “waiting” até que todas as abas com o SW antigo sejam fechadas.
- Para forçar a atualização:
  - O cliente envia postMessage({ type: 'SKIP_WAITING' }) para o SW.
  - No SW: self.addEventListener('message', e => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
  - Após a ativação, chamar self.clients.claim() para assumir controle das abas abertas, reduzindo janelas de inconsistência.
- Recomendação de UI: opcionalmente exibir um toast “Atualização disponível. Recarregar?”; ao aceitar, enviar SKIP_WAITING e depois window.location.reload() quando o novo controller estiver ativo.

Evitar stale cache

- Sempre alterar CACHE_NAME em releases que mudem assets.
- Considerar incluir hash de conteúdo no nome dos arquivos (build) para invalidar seletivamente.
- Manter a lista urlsToCache alinhada ao build de produção, evitando referenciar fontes de desenvolvimento (.tsx/.ts).
- Limpar caches antigos na ativação (já implementado).
- Validar que o SW registra e atualiza sob HTTPS/escopo correto.

Implementação de referência

- Arquivo: pwa_files.js
  - CACHE_NAME e install/fetch/activate/message listeners.
  - Remoção de caches antigos e skipWaiting.
  - Sugerido adicionar, após activate: self.clients.claim();
  - Sugerido aprimorar fetch para fallback de navegação:
    Exemplo (conceitual):
      if (event.request.mode === 'navigate') {
        event.respondWith(
          fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
      }

Alinhamento com o código atual

- pwa_files.js já:
  - Versiona o cache via CACHE_NAME.
  - Faz precache com cache.addAll(urlsToCache).
  - Remove caches antigos em activate.
  - Suporta skipWaiting via mensagem.
- Ações recomendadas:
  - Adicionar clientsClaim no activate.
  - Adotar fallback de navegação para index.html (SPA offline mais robusto).
  - Revisar urlsToCache para usar assets do build final (dist) em produção.

---

## Referências

- React: <https://react.dev/>
- Vite: <https://vitejs.dev/>
- TypeScript: <https://www.typescriptlang.org/>
- PWA: <https://web.dev/progressive-web-apps/>
- MDN Pointer/Touch Events: <https://developer.mozilla.org/docs/Web/API/Touch_events>
- C4 Model: <https://c4model.com/>
- UML State Machine: <https://www.uml-diagrams.org/state-machine-diagrams.html>
