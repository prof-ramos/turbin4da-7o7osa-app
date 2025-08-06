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
- PWA/Service Worker para caching de assets.

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
  - Registro do Service Worker.
  - Estratégias de cache para assets estáticos e fallback básico.

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

## Referências

- React: <https://react.dev/>
- Vite: <https://vitejs.dev/>
- TypeScript: <https://www.typescriptlang.org/>
- PWA: <https://web.dev/progressive-web-apps/>
- MDN Pointer/Touch Events: <https://developer.mozilla.org/docs/Web/API/Touch_events>
- C4 Model: <https://c4model.com/>
- UML State Machine: <https://www.uml-diagrams.org/state-machine-diagrams.html>
