// Render the local HTML deck with an isolated Chromium profile.
// No npm packages or network downloads are required (Node >= 22).
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'slides.pdf');
const handout = path.join(root, 'slides-handout.pdf');
const checkArg = process.argv.indexOf('--check-dir');
const checkDir = checkArg >= 0 ? path.resolve(process.argv[checkArg + 1]) : null;
const candidates = [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
let chrome;
for (const candidate of candidates) {
  try { await fs.access(candidate); chrome = candidate; break; } catch {}
}
if (!chrome) throw new Error('Set CHROME_BIN to a Chromium executable.');
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'qe-slides-'));
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--disable-sync', '--allow-file-access-from-files', '--remote-debugging-port=0', `--user-data-dir=${temporary}`, 'about:blank'], {stdio: ['ignore','ignore','pipe']});
let browserLog = '';
browser.stderr.on('data', data => { browserLog = (browserLog + data).slice(-5000); });
let socket;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  let port;
  for (let tries = 0; tries < 150; tries++) {
    try { port = Number((await fs.readFile(path.join(temporary, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break; } catch {}
    if (browser.exitCode !== null || browser.signalCode !== null) throw new Error(`Chromium exited early: ${browserLog}`);
    await delay(100);
  }
  if (!port) throw new Error(`Chromium did not start: ${browserLog}`);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(target => target.type === 'page');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject) => { socket.addEventListener('open',resolve,{once:true}); socket.addEventListener('error',reject,{once:true}); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    message.error ? handler.reject(new Error(JSON.stringify(message.error))) : handler.resolve(message.result);
  });
  const call = (method, params={}) => new Promise((resolve,reject) => {
    const id = ++nextId;
    pending.set(id, {resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', {expression, awaitPromise:true, returnByValue:true});
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', {width:1280,height:720,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate', {url:pathToFileURL(path.join(root,'index.html')).href});
  let ready = false;
  for (let tries=0;tries<100;tries++) {
    ready = await evaluate('document.documentElement.dataset.ready === "true"');
    if (ready) break;
    await delay(100);
  }
  if (!ready) throw new Error('Deck did not finish rendering fonts and math.');
  const revealError = await evaluate('document.documentElement.dataset.revealError');
  if (revealError) throw new Error(revealError);
  await evaluate('Promise.all(Array.from(document.images, image => image.decode()))');
  const inventory = await evaluate(`({slides:document.querySelectorAll('.slide').length, main:document.querySelectorAll('.slide:not([data-backup])').length, seconds:Array.from(document.querySelectorAll('[data-seconds]')).reduce((n,s)=>n+Number(s.dataset.seconds),0), math:document.querySelectorAll('.katex').length, mathErrors:Array.from(document.querySelectorAll('.katex-error'),e=>e.textContent), font:document.fonts.check('30px "Termes Slides"'), images:Array.from(document.images,i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))})`);
  if (inventory.mathErrors.length || !inventory.font || inventory.images.some(i=>!i.loaded)) throw new Error(JSON.stringify(inventory));
  if (checkDir) await fs.mkdir(checkDir,{recursive:true});
  const checks=[];
  for (let i=1;i<=inventory.slides;i++) {
    await evaluate(`window.slideDeck.goTo(${i-1}, Infinity, false)`);
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    checks.push(await evaluate(`(() => {
      const s=document.querySelector('.slide.is-active');
      const beyond=[];
      const take=s.querySelector('.takeaway');
      const t=take?.getBoundingClientRect();
      const overlaps=[];
      for (const e of s.querySelectorAll('h1,h2,h3,p,.card,.equation-box,.source,.takeaway,.katex-html,.full-theorem,.moment-pair,img,svg,table')) {
        if(e.closest('.speaker-notes')) continue;
        const b=e.getBoundingClientRect();
        if(b.width && (b.left < -1 || b.top < -1 || b.right > 1281 || b.bottom > 721)) beyond.push({element:e.tagName,text:e.textContent.slice(0,90),box:[b.left,b.top,b.right,b.bottom]});
        if(e.matches('.slide__title') && (e.scrollWidth>e.clientWidth+1 || e.scrollHeight>e.clientHeight+1)) beyond.push({element:'title',text:e.textContent});
        if(t && e.parentElement===s.querySelector('.slide__content') && e!==take && b.bottom>t.top+1 && b.top<t.bottom && b.width>0) overlaps.push({element:e.tagName,text:e.textContent.slice(0,90),bottom:b.bottom,takeawayTop:t.top});
      }
      return {slide:${i},title:s.dataset.title,beyond,overlaps};
    })()`));
    if (checkDir) {
      const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      await fs.writeFile(path.join(checkDir,`slide-${String(i).padStart(2,'0')}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  // Check every reveal in the browser: hidden groups must leave their space,
  // earlier groups must stay visible, and appendix pages must be complete.
  const revealChecks = await evaluate(`(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    return slides.map((slide, index) => {
      const steps = window.slideDeck.stepCount(slide);
      const errors = [];
      window.slideDeck.goTo(index, Infinity, false);
      const targets = Array.from(slide.querySelectorAll('[data-step]'));
      const bounds = targets.map(e => JSON.stringify(e.getBoundingClientRect().toJSON()));
      for (let step = 0; step < steps; step++) {
        window.slideDeck.goTo(index, step, false);
        targets.forEach((element, i) => {
          const visible = getComputedStyle(element).visibility === 'visible';
          if (visible !== (Number(element.dataset.step) <= step)) errors.push('Incorrect visibility at step ' + step);
          if (JSON.stringify(element.getBoundingClientRect().toJSON()) !== bounds[i]) errors.push('Layout moved at step ' + step);
        });
      }
      if (slide.hasAttribute('data-backup') && (steps !== 1 || targets.length)) errors.push('Appendix has reveals');
      return {slide:index+1, steps, labels:JSON.parse(slide.dataset.stepLabels || '["Full slide"]'), errors};
    });
  })()`);
  if (revealChecks.some(check => check.errors.length)) throw new Error(JSON.stringify(revealChecks.filter(c => c.errors.length)));
  // Capture every partial state as well as the completed slides above.
  if (checkDir) {
    const stepDir = path.join(checkDir, 'steps');
    await fs.mkdir(stepDir, {recursive:true});
    for (const check of revealChecks.filter(c => c.steps > 1)) {
      for (let step=0; step<check.steps-1; step++) {
        await evaluate(`window.slideDeck.goTo(${check.slide-1}, ${step}, false)`);
        await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        await fs.writeFile(path.join(stepDir,`slide-${String(check.slide).padStart(2,'0')}-step-${step+1}.png`),Buffer.from(shot.data,'base64'));
      }
    }
  }
  // Verify the template's keyboard navigation, direct links and notes controls.
  await evaluate('window.slideDeck.goTo(0)');
  await delay(50);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  const navigation=await evaluate('location.hash==="#2"');
  const navigationState=await evaluate('({hash:location.hash,state:window.slideDeck.state(),active:document.querySelector(".slide.is-active").id})');
  const revealNavigation=await evaluate(`(() => {
    const press = key => document.dispatchEvent(new KeyboardEvent('keydown', {key,bubbles:true,cancelable:true}));
    const states = Array.from(document.querySelectorAll('.slide')).flatMap((slide,index) =>
      Array.from({length:window.slideDeck.stepCount(slide)}, (_,step) => ({index,step})));
    const matches = expected => { const actual=window.slideDeck.state(); return actual.index===expected.index && actual.step===expected.step; };
    window.slideDeck.goTo(0);
    for (const expected of states.slice(1)) { press('ArrowRight'); if (!matches(expected)) return false; }
    press('ArrowRight');
    if (!matches(states.at(-1))) return false;
    for (const expected of states.slice(0,-1).reverse()) { press('ArrowLeft'); if (!matches(expected)) return false; }
    press('ArrowLeft');
    if (!matches(states[0])) return false;
    press('End'); if (!matches(states.at(-1))) return false;
    press('Home'); if (!matches(states[0])) return false;
    window.slideDeck.goTo(1);
    press(' '); if (!matches({index:1,step:1})) return false;
    press('PageDown'); if (!matches({index:1,step:2})) return false;
    press('PageUp'); if (!matches({index:1,step:1})) return false;
    return true;
  })()`);
  await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'n',bubbles:true}))");
  const notes=await evaluate("document.querySelector('.notes-overlay').classList.contains('is-open') && document.querySelector('.notes-overlay h2').textContent===document.querySelector('.slide.is-active').dataset.title");
  const notesFreeze=await evaluate("(() => { const before=JSON.stringify(window.slideDeck.state()); document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true})); return before===JSON.stringify(window.slideDeck.state()); })()");
  await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));document.dispatchEvent(new KeyboardEvent('keydown',{key:'b',bubbles:true}))");
  const backupNavigation=await evaluate("(() => { const backup=document.querySelector('.slide[data-backup]'); return backup ? location.hash==='#'+backup.id : location.hash==='#2'; })()");
  const backupState=await evaluate('({hash:location.hash,state:window.slideDeck.state()})');
  const brokenLinks=await evaluate("Array.from(document.querySelectorAll('a[href^=\"#\"]')).map(a=>a.getAttribute('href')).filter(href=>!document.getElementById(href.slice(1)))");
  await evaluate("location.hash='#3'");
  await delay(50);
  const directNavigation=await evaluate('window.slideDeck.state().index===2 && window.slideDeck.state().step===0');
  const directState=await evaluate('({hash:location.hash,state:window.slideDeck.state()})');
  await evaluate('window.slideDeck.goTo(0)');
  if(!navigation||!revealNavigation||!notes||!notesFreeze||!backupNavigation||!directNavigation||brokenLinks.length) throw new Error('Navigation, links or notes check failed: '+JSON.stringify({navigation,navigationState,revealNavigation,notes,notesFreeze,backupNavigation,backupState,directNavigation,directState,brokenLinks}));
  const report={...inventory,navigation,revealNavigation,backupNavigation,directNavigation,brokenLinks,notes,notesFreeze,revealChecks,checks};
  if(checkDir) await fs.writeFile(path.join(checkDir,'checks.json'),JSON.stringify(report,null,2));
  const warnings=checks.filter(c=>c.beyond.length||c.overlaps.length);
  if(warnings.length) console.warn('Layout findings:',JSON.stringify(warnings));
  // Include every printed slide in the accessibility tree and PDF outline.
  await evaluate("document.querySelectorAll('.slide').forEach(slide => { window.slideDeck.reveal(slide, Infinity); slide.removeAttribute('aria-hidden'); })");
  await call('Emulation.setEmulatedMedia',{media:'print'});
  await evaluate('document.fonts.ready');
  const printOptions={printBackground:true,displayHeaderFooter:false,preferCSSPageSize:true,generateTaggedPDF:true,generateDocumentOutline:true};
  const handoutPdf=await call('Page.printToPDF',printOptions);
  await fs.writeFile(path.join(temporary,'handout.pdf'),Buffer.from(handoutPdf.data,'base64'));
  // Clone the already typeset slides: one PDF page per step, with unchanged
  // logical slide numbers. Give SVG definitions unique IDs in every clone so
  // markers and clipping paths cannot accidentally refer to a different page.
  const presentationPages=await evaluate(`(() => {
    const deck=document.querySelector('[data-slide-deck]');
    const originals=Array.from(deck.querySelectorAll('.slide'));
    const pages=document.createDocumentFragment();
    let count=0;
    for(const slide of originals) {
      for(let step=0;step<window.slideDeck.stepCount(slide);step++) {
        const clone=slide.cloneNode(true);
        clone.id=step===0 ? slide.id : 'slide-'+slide.id+'-step-'+(step+1);
        clone.dataset.printStep=step;
        clone.removeAttribute('aria-hidden');
        clone.classList.remove('is-active');
        const ids=new Map();
        for(const node of clone.querySelectorAll('[id]')) {
          const old=node.id;
          node.id='print-'+slide.id+'-'+step+'-'+old;
          ids.set(old,node.id);
        }
        for(const node of clone.querySelectorAll('*')) {
          for(const attr of Array.from(node.attributes)) {
            let value=attr.value.replace(/url\\(#([^)]*)\\)/g,(match,id)=>ids.has(id)?'url(#'+ids.get(id)+')':match);
            if((attr.name==='href'||attr.name==='xlink:href') && value.startsWith('#') && ids.has(value.slice(1))) value='#'+ids.get(value.slice(1));
            if(value!==attr.value) node.setAttribute(attr.name,value);
          }
        }
        window.slideDeck.reveal(clone,step);
        // Hidden fragments should not leak into the tagged PDF reading order.
        clone.querySelectorAll('.reveal-hidden').forEach(node=>node.setAttribute('aria-hidden','true'));
        pages.append(clone);
        count++;
      }
    }
    deck.replaceChildren(pages);
    document.body.classList.add('reveal-print');
    const allIds=Array.from(document.querySelectorAll('[id]'),e=>e.id);
    if(new Set(allIds).size!==allIds.length) throw new Error('Duplicate IDs in print deck');
    return count;
  })()`);
  await evaluate('Promise.all([document.fonts.ready, ...Array.from(document.images, image=>image.decode())])');
  const pdf=await call('Page.printToPDF',printOptions);
  const tempPdf=path.join(temporary,'slides.pdf');
  await fs.writeFile(tempPdf,Buffer.from(pdf.data,'base64'));
  await fs.copyFile(tempPdf,output);
  await fs.copyFile(path.join(temporary,'handout.pdf'),handout);
  console.log(`Built ${output} (${presentationPages} reveal pages)\nBuilt ${handout} (${inventory.slides} complete slides)\n${inventory.main} main + ${inventory.slides-inventory.main} backup slides; ${Math.floor(inventory.seconds/60)}:${String(inventory.seconds%60).padStart(2,'0')} planned speaking time.\nFonts, ${inventory.math} math expressions, images, reveal order, navigation, and notes checked.`);
} finally {
  if(socket) socket.close();
  browser.kill('SIGTERM');
  for(let tries=0;tries<30 && browser.exitCode===null && browser.signalCode===null;tries++) await delay(100);
  if(browser.exitCode===null && browser.signalCode===null) browser.kill('SIGKILL');
  await delay(200);
  await fs.rm(temporary,{recursive:true,force:true,maxRetries:10,retryDelay:100});
}
