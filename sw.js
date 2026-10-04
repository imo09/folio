/* folio - copia per l'uso senza rete. La versione arriva dall'app: non va cambiata a mano. */
const VERSIONE = 'folio-v7.3';
const ROBA = ['./', './index.html', './manifest.webmanifest', './icona-192.png', './icona-512.png', './icona-180.png'];

self.addEventListener('install', e => {
  /* cache:'reload' scavalca la cache del browser: la versione nuova prende davvero i file nuovi */
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(ROBA.map(u => new Request(u, { cache:'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(caduta => {
      const rete = fetch(r).then(risposta => {
        if (risposta && risposta.ok) {
          const copia = risposta.clone();
          caches.open(VERSIONE).then(c => c.put(r, copia));
        }
        return risposta;
      }).catch(() => caduta);
      return caduta || rete;
    })
  );
});
