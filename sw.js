const CACHE_NAME = 'amavidya-v3.0.0';
const STATIC_CACHE = 'amavidya-static-v3.0.0';
const DYNAMIC_CACHE = 'amavidya-dynamic-v3.0.0';
const CONTENT_CACHE = 'amavidya-content-v3.0.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/LandingPage.tsx',
  '/src/components/AuthModal.tsx',
  '/src/components/StudentDashboard.tsx',
  '/src/components/TeacherDashboard.tsx',
  '/src/components/AvatarCustomization.tsx',
  '/src/components/VideoPlayer.tsx',
  '/src/components/GamePlayer.tsx',
  '/src/components/NotificationToast.tsx',
  '/src/lib/supabase.ts',
  '/src/data/content.ts',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('Service Worker: Caching static files');
          return cache.addAll(STATIC_FILES.filter(url => url !== '/'));
        }),
      caches.open(CONTENT_CACHE)
        .then(cache => {
          console.log('Service Worker: Caching content data');
          // Cache video and game content for offline use
          return cache.addAll([
            '/src/data/content.ts'
          ]);
        })
    ])
    .then(() => {
      console.log('Service Worker: All files cached');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('Service Worker: Error caching files', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CONTENT_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For content data, use cache-first strategy
    if (url.pathname.includes('/data/content') || url.pathname.includes('supabase')) {
      return await cacheFirstStrategy(request, CONTENT_CACHE);
    }
    
    // For HTML pages and app files, use cache-first strategy
    if (isAppFile(url.pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }
    
    // For other requests, use network-first strategy
    return await networkFirstStrategy(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Fetch error', error);
    
    // Return offline fallback for HTML pages
    if (isHTMLPage(url.pathname)) {
      return await getOfflineFallback();
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('Service Worker: Serving from cache', request.url);
    // Update cache in background if online
    if (navigator.onLine) {
      updateCacheInBackground(request, cacheName);
    }
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      console.log('Service Worker: Cache updated in background', request.url);
    }
  } catch (error) {
    console.log('Service Worker: Background update failed', request.url);
  }
}

async function getOfflineFallback() {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match('/index.html');
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
        <title>AmaVidya - Offline</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                margin: 0; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 2rem;
            }
            .offline-message {
                background: rgba(255,255,255,0.1);
                padding: 3rem;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                max-width: 400px;
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
                font-weight: 700;
            }
            p {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            button {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            button:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="offline-message">
            <div class="icon">🚀</div>
            <h1>AmaVidya</h1>
            <p>You're currently offline, but you can still access your cached learning content.</p>
            <button onclick="window.location.reload()">Try Again</button>
        </div>
    </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

// Helper functions
function isHTMLPage(pathname) {
  return pathname.endsWith('.html') || 
         pathname === '/' || 
         pathname.endsWith('/');
}

function isAppFile(pathname) {
  return pathname.startsWith('/src/') ||
         pathname.endsWith('.tsx') ||
         pathname.endsWith('.ts') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname === '/';
}

// Background sync for user data
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  } else if (event.tag === 'sync-progress-data') {
    event.waitUntil(syncProgressData());
  } else if (event.tag === 'sync-video-progress') {
    event.waitUntil(syncVideoProgress());
  } else if (event.tag === 'sync-game-progress') {
    event.waitUntil(syncGameProgress());
  }
});

async function syncUserData() {
  try {
    const userData = getStoredUserData();
    
    if (userData && navigator.onLine) {
      console.log('Service Worker: User data ready for sync with Supabase', userData);
      // Here you would sync with Supabase when online
    }
  } catch (error) {
    console.error('Service Worker: User data sync failed', error);
  }
}

async function syncProgressData() {
  try {
    const progressData = getStoredProgressData();
    
    if (progressData && navigator.onLine) {
      console.log('Service Worker: Progress data ready for sync', progressData);
      // Sync progress data with Supabase
    }
  } catch (error) {
    console.error('Service Worker: Progress data sync failed', error);
  }
}

async function syncVideoProgress() {
  try {
    const videoProgress = getStoredVideoProgress();
    
    if (videoProgress && navigator.onLine) {
      console.log('Service Worker: Video progress ready for sync', videoProgress);
      // Sync video progress with Supabase
    }
  } catch (error) {
    console.error('Service Worker: Video progress sync failed', error);
  }
}

async function syncGameProgress() {
  try {
    const gameProgress = getStoredGameProgress();
    
    if (gameProgress && navigator.onLine) {
      console.log('Service Worker: Game progress ready for sync', gameProgress);
      // Sync game progress with Supabase
    }
  } catch (error) {
    console.error('Service Worker: Game progress sync failed', error);
  }
}

function getStoredUserData() {
  // This integrates with localStorage data
  try {
    const currentUser = localStorage.getItem('currentUser');
    const students = localStorage.getItem('students');
    const teachers = localStorage.getItem('teachers');
    
    return {
      currentUser: currentUser ? JSON.parse(currentUser) : null,
      students: students ? JSON.parse(students) : [],
      teachers: teachers ? JSON.parse(teachers) : []
    };
  } catch (error) {
    console.error('Error getting stored user data:', error);
    return null;
  }
}

function getStoredProgressData() {
  try {
    const progressData = localStorage.getItem('studentProgress');
    return progressData ? JSON.parse(progressData) : null;
  } catch (error) {
    console.error('Error getting stored progress data:', error);
    return null;
  }
}

function getStoredVideoProgress() {
  try {
    const videoProgress = localStorage.getItem('videoProgress');
    return videoProgress ? JSON.parse(videoProgress) : [];
  } catch (error) {
    console.error('Error getting stored video progress:', error);
    return [];
  }
}

function getStoredGameProgress() {
  try {
    const gameProgress = localStorage.getItem('gameProgress');
    return gameProgress ? JSON.parse(gameProgress) : [];
  } catch (error) {
    console.error('Error getting stored game progress:', error);
    return [];
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New learning content available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/explore-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AmaVidya Learning Platform', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'SYNC_USER_DATA') {
    event.waitUntil(syncUserData());
  }
  
  if (event.data && event.data.type === 'CACHE_CONTENT') {
    event.waitUntil(cacheContentData());
  }
});

// Cache content data for offline use
async function cacheContentData() {
  try {
    const cache = await caches.open(CONTENT_CACHE);
    
    // Cache video and game content
    const contentUrls = [
      '/src/data/content.ts',
      // Add any video URLs or game assets here
    ];
    
    await cache.addAll(contentUrls);
    console.log('Service Worker: Content data cached for offline use');
  } catch (error) {
    console.error('Service Worker: Error caching content data', error);
  }
}

console.log('Service Worker: Script loaded');