const V='tf-v5';
const FILES=['./','index.html','data.enc.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Primero lo nuevo de internet (así llegan las tarjetas nuevas al abrir); sin internet, lo guardado.
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}return res})
    .catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
