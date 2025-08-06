# TURBIN4DA 7O7OSA - Um Jogo da Cobrinha Ardente

Uma reinterpretação moderna do clássico jogo da Cobrinha, com uma estética visual imersiva com tema de fogo. Experimente a nostalgia dos jogos de arcade com efeitos de fogo dinâmicos, controles responsivos e um design de UI/UX refinado.

Este projeto foi construído com React, TypeScript e Tailwind CSS, tudo rodando diretamente no navegador sem uma etapa de compilação, aproveitando módulos ES e importações de CDN.

## Funcionalidades

- **Jogabilidade Clássica da Cobrinha**: A diversão atemporal de guiar uma cobra crescente para comer comida.
- **Tema de Fogo Imersivo**: Uma estética visualmente impressionante com uma paleta de cores escuras e ardentes e efeitos de brilho alimentados pelo Canvas HTML5.
- **Design Responsivo**: Jogue perfeitamente em dispositivos desktop e móveis.
- **Controles Duplos**:
  - **Teclado**: Use as `Setas` ou `WASD` para um movimento preciso.
  - **Toque**: Controles de deslize intuitivos para jogadores móveis.
- **Pontuação Máxima Persistente**: Sua pontuação mais alta é salva localmente no `localStorage` do seu navegador, para que você possa sempre tentar bater seu recorde pessoal.
- **Dificuldade Dinâmica**: A velocidade da cobra aumenta à medida que você come mais comida, tornando o jogo progressivamente mais desafiador.
- **Pausar/Retomar**: Pressione a tecla 'P' para pausar o jogo a qualquer momento.

## Como Jogar

### Objetivo

Seu objetivo é comer a comida amarela brilhante para fazer sua cobra crescer o máximo possível e alcançar a pontuação mais alta. O jogo termina se a cobra bater nas paredes ou em seu próprio corpo.

### Controles

- **Desktop**:
  - **Mover para Cima**: `Seta para Cima` ou `W`
  - **Mover para Baixo**: `Seta para Baixo` ou `S`
  - **Mover para a Esquerda**: `Seta para a Esquerda` ou `A`
  - **Mover para a Direita**: `Seta para a Direita` ou `D`
  - **Pausar/Retomar**: `P`
- **Móvel**:
  - **Deslize** na direção que você quer que a cobra se mova.

## Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Renderização**: `<canvas>` HTML5 para o tabuleiro do jogo.
- **Sistema de Módulos**: Módulos ES com `importmap` para gerenciamento de dependências no navegador.

## Estrutura do Projeto

```
.
├── index.html              # Arquivo HTML principal, carrega scripts e estilos
├── index.tsx               # Ponto de entrada da aplicação React
├── App.tsx                 # Componente principal, lida com a lógica de estado do jogo (Início, Jogando, Fim de Jogo)
├── constants.ts            # Constantes do jogo (tamanho da grade, velocidade, cores)
├── types.ts                # Interfaces e enums do TypeScript
├── metadata.json           # Metadados da aplicação
└── components/
    ├── GameBoard.tsx       # O canvas principal do jogo, lidando com a renderização e a lógica do jogo
    ├── GameOverScreen.tsx  # A tela exibida quando o jogo termina
    ├── Scoreboard.tsx      # Exibe as pontuações atual e máxima durante o jogo
    └── StartScreen.tsx     # A tela inicial para começar o jogo e ver as instruções
```

## Como Executar Localmente

Este projeto está configurado para ser executado sem um processo de compilação complexo.

1. Certifique-se de ter todos os arquivos do projeto em um único diretório.
2. Você precisa servir os arquivos usando um servidor web local simples, porque os navegadores restringem o acesso a `file://` por razões de segurança.
    - **Usando Python**: Se você tiver o Python instalado, navegue até o diretório do projeto no seu terminal e execute: `python -m http.server`
    - **Usando Node.js**: Se você tiver o Node.js, pode instalar um pacote de servidor simples globalmente: `npm install -g serve` e depois executar `serve .` no diretório do projeto.
    - **Usando o VS Code**: A extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) é uma excelente opção. Simplesmente clique com o botão direito em `index.html` e escolha "Open with Live Server".
3. Abra seu navegador e navegue para o URL local fornecido pelo servidor (por exemplo, `http://localhost:8000` ou `http://127.0.0.1:5500`).

## Implantando no Vercel

Você pode implantar este projeto gratuitamente no [Vercel](https://vercel.com/). Como não há etapa de compilação, você o configurará como um site estático simples.

### Pré-requisitos

- Uma [conta no Vercel](https://vercel.com/signup).
- O projeto enviado para um repositório Git (GitHub, GitLab ou Bitbucket).

### Passos

1. **Novo Projeto no Vercel**:
    - Vá para o seu Painel Vercel.
    - Clique no botão "Add New..." e selecione "Project".

2. **Importar Repositório Git**:
    - Importe o repositório Git onde você enviou o código do projeto.

3. **Configurar Projeto**:
    - O Vercel tentará detectar o framework. Ele pode não encontrar um, o que está correto.
    - Expanda a seção **"Build and Output Settings"**.
    - Defina o **"Framework Preset"** como **`Other`**.
    - **Deixe o "Build Command" vazio**. Este é o passo mais importante, pois nosso projeto não precisa ser compilado.
    - **Deixe o "Output Directory" vazio** ou certifique-se de que está definido para o padrão. O Vercel servirá automaticamente o conteúdo do diretório raiz.
    - Você não precisa substituir o "Install Command".

4. **Implantar**:
    - Clique no botão "Deploy".
    - O Vercel implantará seu site e fornecerá um URL. A implantação deve ser muito rápida, pois está apenas servindo arquivos estáticos.
