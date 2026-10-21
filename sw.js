'use strict';
// Change the version whenever the application files change.
const BASE=new URL('./',self.location.href);
const PREFIX='voies-shell-'+BASE.pathname+'-';
const CACHE=PREFIX+'0.5.0-r2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
// Look only in this version's cache; older installations may retain legacy caches.
const cached=request=>caches.open(CACHE).then(cache=>cache.match(request));
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
  if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>response.ok?response:cached(new URL('./index.html',BASE).href)).catch(()=>cached(new URL('./index.html',BASE).href)));return}
  if(ASSETS.includes(url.href))event.respondWith(cached(request).then(result=>result||fetch(request)));
});

