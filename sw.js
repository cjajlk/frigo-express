/* Cache hors ligne, avec vérification en ligne des nouvelles versions. */
const CACHE='frigo-express-v04-20261111';
const FILES=['./','./index.html','./css/style.css','./js/data.js','./js/app.js','./assets/icon.svg','./assets/recipes/gateau-yaourt.webp','./assets/recipes/mousse-chocolat.webp','./assets/recipes/spaghetti-bolognaise.webp','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frigo-express-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      // En ligne, prendre la dernière version plutôt que bloquer sur une ancienne page.
      const fresh=await fetch(req);
      if(fresh.ok)await cache.put(req,fresh.clone());
      return fresh;
    }catch{
      return await caches.match(req)||(req.mode==='navigate'?await caches.match('./index.html'):Response.error());
    }
  })());
});
