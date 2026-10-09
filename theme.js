'use strict';
(() => {
 let saved;
 try { saved = localStorage.getItem('energylab.theme'); } catch {}
 document.documentElement.dataset.theme = saved === 'dark' || saved === 'light'
  ? saved : 'dark';
})();
