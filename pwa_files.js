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
  // SPA navigation fallback: se a navegação falhar (offline/erro), retornar index.html do cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Tenta buscar da rede primeiro para obter a versão mais recente da página
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (err) {
          // Offline/erro de rede: usa fallback para o index.html em cache
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = await cache.match('/index.html');
          if (cachedIndex) {
            return cachedIndex;
          }
          // Se não houver index.html no cache, tenta qualquer resposta em cache para a requisição
          const cachedAny = await caches.match(event.request);
          if (cachedAny) {
            return cachedAny;
          }
          // Como último recurso, retorna uma resposta genérica
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

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
    (async () => {
      // Limpa caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      // Garante que o SW recém-ativado assuma o controle das abas existentes
      await self.clients.claim();
    })()
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
 // Removido conteúdo HTML embutido que estava quebrando o arquivo JS.
