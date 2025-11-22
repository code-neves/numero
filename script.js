const PH = "5581996121431", DISP = "(81) 99612-1431", MSG = "Olá!";
const grid = ['X','V','O','C','Ê','Y','Z','K','W','X','Y','Z','M','U','I','T','O','X','Y','Z','K','W','Q','Y','X','L','E','G','A','L','Z','Y','X','W','K','Z'];
const sols = { voce: [1,2,3,4], muito: [12,13,14,15,16], legal: [25,26,27,28,29] };
const state = { sel: new Set(), found: [] }, get = id => document.getElementById(id);
const gridEl = get('grid'), modal = get('success-modal'), link = get('display-number-link');

const ctx = new (window.AudioContext || window.webkitAudioContext)();
let combo = 0, lastTapTime = 0;
const cMajorScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

const playTone = (freq, type, dur, vol=0.1) => {
    if(ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + dur);
};

const sfx = {
    tap: () => {
        const now = Date.now();
        if (now - lastTapTime > 1500) combo = 0;
        const freq = cMajorScale[combo % cMajorScale.length] * (1 + Math.floor(combo / cMajorScale.length));
        playTone(freq, 'sine', 0.15);
        combo++;
        lastTapTime = now;
    },
    err: () => playTone(150, 'sawtooth', 0.3, 0.1),
    win: () => { 
        combo = 0;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.3), i * 120));
    },
    done: () => {
        combo = 0; 
        [392.00, 493.88, 523.25].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.2), i * 100));
    }
};

if (link) Object.assign(link, { textContent: DISP, href: `tel:${PH}` });

grid.forEach((char, i) => {
    const tile = Object.assign(document.createElement('div'), { className: 'letter-tile', textContent: char, onclick: () => handleClick(i, tile) });
    gridEl.appendChild(tile);
});

const handleClick = (i, el) => {
    if (el.classList.contains('found')) return;
    const has = state.sel.has(i);
    state.sel[has ? 'delete' : 'add'](i);
    el.classList.toggle('selected', !has);
    sfx[has ? 'err' : 'tap']();
    
    Object.entries(sols).forEach(([word, idxs]) => {
        if (!state.found.includes(word) && idxs.every(x => state.sel.has(x))) {
            state.found.push(word);
            get(`word-${word}`).classList.add('done');
            idxs.forEach(x => { gridEl.children[x].classList.replace('selected', 'found'); state.sel.delete(x); });
            if (state.found.length < 3) sfx.done();
            
            if (state.found.length === 3) setTimeout(() => {
                sfx.win();
                modal.classList.remove('hidden');
                startTyping();
                setTimeout(() => (modal.firstElementChild.classList.add('modal-enter'), confetti()), 10);
            }, 500);
        }
    });
};

const startTyping = () => {
    const phrases = ["Fica na paz comigo?", "Espero que você tenha curtido",  "Deu um trabalhinho fazer isso aqui. :p", "Tahm Kennnnnnnnnnch!", "Mano Juro, aperta logo."];
    let pIdx = 0, cIdx = 0, isDel = false, el = get('typing-text');
    
    const loop = () => {
        const current = phrases[pIdx];
        el.textContent = current.substring(0, cIdx) || '\u00A0';
        let speed = 100;

        if (!isDel) {
            if (cIdx < current.length) {
                cIdx++;
            } else {
                isDel = true;
                speed = 3500;
            }
        } else {
            if (cIdx > 0) {
                cIdx--;
                speed = 50;
            } else {
                isDel = false;
                pIdx = (pIdx + 1) % phrases.length;
                speed = 500;
            }
        }
        setTimeout(loop, speed);
    };
    loop();
};

get('typing-text').textContent = "Fica na paz comigo?";

get('whatsapp-btn').onclick = () => window.open(`https://wa.me/${PH}?text=${encodeURIComponent(MSG)}`, '_blank');

const copyBtn = get('copy-btn');
if (copyBtn) copyBtn.onclick = () => navigator.clipboard.writeText(DISP).then(() => {
    const toast = get('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}).catch(() => alert('Erro ao copiar.'));

const confetti = () => {
    for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        Object.assign(c.style, {
            backgroundColor: ['#f472b6','#4ade80','#60a5fa','#facc15'][i % 4],
            left: Math.random()*100+'vw', top: '-20px', width: Math.random()*10+5+'px', height: Math.random()*10+5+'px',
            animationDuration: Math.random()*3+2+'s'
        });
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
};