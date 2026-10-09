'use strict';
const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('en-GB', {maximumFractionDigits:2, minimumFractionDigits:2}).format(n);
const money = n => `${fmt(n)} ₺`;
const storageKey = 'energylab.history.v1';
let history = [];
try { const data = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(data)) history = data.filter(x => x && typeof x.name === 'string' && [x.power,x.hours,x.days,x.total,x.cost,x.time].every(Number.isFinite)).slice(0,10); } catch {}
function values() {
  const ids = ['power','hours','rate','days'];
  if (!ids.every(id => $(id).value.trim() !== '' && $(id).checkValidity())) return null;
  return Object.fromEntries(ids.map(id => [id, Number($(id).value)]));
}
function calculate({power,hours,rate,days}) { const daily = power / 1000 * hours; return {daily,total:daily*days,cost:daily*days*rate}; }
function update() {
 const v = values();
 if (!v) { $('cost').textContent = '—'; $('daily').textContent = '—'; $('total').textContent = '—'; $('period-label').textContent = 'Enter valid values: 0–24 hours of use and a period of 1–366 days.'; ['val1','val7','val30','cost-a','cost-b','saving','saving-percent','compare-context'].forEach(id=>$(id).textContent='—'); ['bar1','bar7','bar30'].forEach(id=>$(id).style.width='0'); return; }
 const r = calculate(v);
 $('cost').innerHTML = `${fmt(r.cost)} <small>₺</small>`;
 $('daily').innerHTML = `${fmt(r.daily)} <small>kWh</small>`;
 $('total').innerHTML = `${fmt(r.total)} <small>kWh</small>`;
 $('period-label').textContent = `For ${v.days} days of use`;
 $('bar-days').textContent = `${v.days} days`;
 [[1,'1'],[7,'7'],[v.days,'30']].forEach(([d,id])=>{ $('bar'+id).style.width = (r.daily*v.rate===0 ? 0 : d/Math.max(7,v.days)*100)+'%'; $('val'+id).textContent=money(r.daily*v.rate*d); });
 if (!['compare-a','compare-b'].every(id=>$(id).value.trim()!=='' && $(id).checkValidity())) { ['cost-a','cost-b','saving','saving-percent'].forEach(id=>$(id).textContent='—'); return; }
 const a = calculate({...v,power:Number($('compare-a').value)}).cost;
 const b = calculate({...v,power:Number($('compare-b').value)}).cost;
 $('cost-a').textContent=money(a); $('cost-b').textContent=money(b);
 $('saving-title').textContent=a===b?'Both options cost the same':`Savings with option ${a>b?'B':'A'}`;
 $('saving').textContent=money(Math.abs(a-b));
 $('saving-percent').textContent=`${fmt(Math.max(a,b)===0?0:Math.abs(a-b)/Math.max(a,b)*100)}% lower cost`;
 $('compare-context').textContent=`${fmt(v.hours)} hours/day · ${v.days} days · ${money(v.rate)}/kWh. Adjust the power values to match your devices.`;
}
function renderHistory() {
 const list=$('history-list'); list.replaceChildren(); $('clear').disabled=history.length===0;
 if (!history.length) { const p=document.createElement('div'); p.className='empty'; p.textContent='No calculations yet. Calculate your first device and save it here.'; list.append(p); return; }
 history.forEach(item=>{ const row=document.createElement('div'); row.className='history-row'; const cells=[['strong',item.name],['span',`${fmt(item.power)} W · ${fmt(item.hours)} h/day · ${item.days} days`],['span',new Date(item.time).toLocaleDateString('en-GB')],['b',money(item.cost)]]; cells.forEach(([tag,text])=>{const el=document.createElement(tag);el.textContent=text;row.append(el);});list.append(row); });
}
function persist() { try {localStorage.setItem(storageKey,JSON.stringify(history));return true;} catch {return false;} }
$('energy-form').addEventListener('submit',event=>{event.preventDefault();const v=values();if(!v)return; const name=$('device').value.trim();if(!name){$('status').textContent='Enter a device name.';return;}history.unshift({...v,...calculate(v),name,time:Date.now()});history=history.slice(0,10);const saved=persist();renderHistory();$('status').textContent=saved?'✓ Calculation saved in this browser.':'Browser storage is unavailable; this record is kept only for this session.';});
document.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{update();$('status').textContent=''; if(['power','hours','device'].includes(input.id)) document.querySelectorAll('.presets button').forEach(b=>b.classList.remove('active'));}));
document.querySelectorAll('.presets button').forEach(button=>button.addEventListener('click',()=>{$('power').value=button.dataset.w;$('hours').value=button.dataset.h;$('device').value=button.dataset.name;document.querySelectorAll('.presets button').forEach(b=>b.classList.toggle('active',b===button));$('status').textContent='';update();}));
$('clear').addEventListener('click',()=>{history=[];const saved=persist();renderHistory();$('status').textContent=saved?'History cleared.':'Session history cleared; persistent storage is unavailable.';});
update();renderHistory();

const themeButton = $('theme-toggle');
function syncThemeButton() {
 const dark = document.documentElement.dataset.theme === 'dark';
 themeButton.textContent = dark ? '☀' : '☾';
 themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
 themeButton.setAttribute('aria-pressed', String(dark));
 document.querySelector('meta[name="theme-color"]').content = dark ? '#101b16' : '#173d32';
}
themeButton.addEventListener('click', () => {
 const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
 document.documentElement.dataset.theme = theme;
 try { localStorage.setItem('energylab.theme', theme); } catch {}
 syncThemeButton();
});

syncThemeButton();
