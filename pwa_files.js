// sw.js - Service Worker para PWA
const CACHE_NAME = 'turbin4da-7o7osa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/components/GameBoard.tsx',
  '/components/StartScreen.tsx',
  '/components/GameOverScreen.tsx',
  '/components/Scoreboard.tsx',
  '/components/MobileControls.tsx',
  '/components/SwipeHandler.tsx',
  '/components/MobileSettings.tsx',
  '/components/PWAInstallPrompt.tsx',
  '/components/MobileInstructions.tsx',
  '/hooks/useMobileControls.ts',
  '/utils/mobileOptimizations.ts',
  '/utils/hapticFeedback.ts',
  '/utils/mobilePerformance.ts',
  '/styles/mobile.css',
  '/types.ts',
  '/constants.ts',
  '/metadata.json',
  // CDN resources
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://cdn.tailwindcss.com'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se encontrado
        if (response) {
          return response;
        }

        // Fazer fetch da rede
        return fetch(event.request).then((response) => {
          // Verificar se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar a resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Atualizar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Lidar com atualizações
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// manifest.json - Manifest para PWA
const manifest = {
  "name": "Turbin4da 7o7osa - Jogo da Cobrinha",
  "short_name": "Turbin4da 7o7osa",
  "description": "Uma reinterpretação moderna do clássico jogo da Cobrinha, com tema de fogo e controles otimizados para mobile",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#ea580c",
  "orientation": "any",
  "categories": ["games", "entertainment"],
  "lang": "pt-BR",
  "dir": "ltr",
  "scope": "/",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/gameplay-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Gameplay no mobile com controles touch"
    },
    {
      "src": "screenshots/gameplay-desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Gameplay no desktop"
    }
  ],
  "features": [
    "Cross Platform",
    "VibrationAPI"
  ],
  "prefer_related_applications": false,
  "edge_side_panel": {
    "preferred_width": 400
  }
};

// Salvar manifest como JSON
// Este conteúdo deve ser salvo em manifest.json
console.log('Manifest PWA:', JSON.stringify(manifest, null, 2));

// index.html - HTML atualizado com PWA
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
    <title>Turbin4da 7o7osa - Jogo da Cobrinha</title>
    
    <!-- PWA Meta Tags -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#ea580c">
    <meta name="background-color" content="#1f2937">
    <meta name="display" content="standalone">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Turbin4da 7o7osa">
    
    <!-- SEO e Descrições -->
    <meta name="description" content="Uma reinterpretação moderna do clássico jogo da Cobrinha, com tema de fogo e controles otimizados para mobile">
    <meta name="keywords" content="jogo, cobrinha, snake, mobile, touch, PWA, fogo, arcade">
    <meta name="author" content="Gabriel Ramos">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Turbin4da 7o7osa - Jogo da Cobrinha">
    <meta property="og:description" content="Jogo da cobrinha com tema de fogo e controles mobile">
    <meta property="og:type" content="game">
    <meta property="og:url" content="https://seu-dominio.com">
    <meta property="og:image" content="https://seu-dominio.com/og-image.png">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Turbin4da 7o7osa">
    <meta name="twitter:description" content="Jogo da cobrinha com tema de fogo">
    <meta name="twitter:image" content="https://seu-dominio.com/twitter-image.png">
    
    <!-- Favicon e Ícones -->
    <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
    <link rel="mask-icon" href="icons/safari-pinned-tab.svg" color="#ea580c">
    
    <!-- Preload de recursos críticos -->
    <link rel="preload" href="https://unpkg.com/react@18/umd/react.production.min.js" as="script">
    <link rel="preload" href="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" as="script">
    <link rel="preload" href="styles/mobile.css" as="style">
    
    <!-- Estilos -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles/mobile.css">
    
    <!-- Configuração do Tailwind -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'bounce-slow': 'bounce 2s infinite',
                        'spin-slow': 'spin 3s linear infinite',
                    }
                }
            }
        }
    </script>
    
    <!-- Importmap para módulos ES -->
    