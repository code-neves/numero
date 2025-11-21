const MY_PHONE_NUMBER = "5581996121431";
const DISPLAY_NUMBER = "(81) 99612-1431";
const SUCCESS_MESSAGE = "Olá, rapaz super ultra legal!";

const gridData = [
    'X', 'V', 'O', 'C', 'Ê', 'Y',
    'Z', 'K', 'W', 'X', 'Y', 'Z',
    'M', 'U', 'I', 'T', 'O', 'X',
    'Y', 'Z', 'K', 'W', 'Q', 'Y',
    'X', 'L', 'E', 'G', 'A', 'L',
    'Z', 'Y', 'X', 'W', 'K', 'Z'
];

const solutions = {
    'voce': [1, 2, 3, 4],
    'muito': [12, 13, 14, 15, 16],
    'legal': [25, 26, 27, 28, 29]
};

const state = {
    selectedIndices: new Set(),
    foundWords: []
};

const gridEl = document.getElementById('grid');
const modal = document.getElementById('success-modal');
const modalContent = modal.querySelector('div');

const displayLink = document.getElementById('display-number-link');
if (displayLink) {
    displayLink.textContent = DISPLAY_NUMBER;
    displayLink.href = `tel:${MY_PHONE_NUMBER}`;
}

gridData.forEach((char, index) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = char;
    tile.dataset.index = index;
    
    tile.addEventListener('click', () => handleTileClick(index, tile));
    gridEl.appendChild(tile);
});

function handleTileClick(index, tileEl) {
    if (tileEl.classList.contains('found')) return;

    if (state.selectedIndices.has(index)) {
        state.selectedIndices.delete(index);
        tileEl.classList.remove('selected');
    } else {
        state.selectedIndices.add(index);
        tileEl.classList.add('selected');
    }

    checkWords();
}

function checkWords() {
    const words = Object.keys(solutions);
    
    words.forEach(word => {
        if (state.foundWords.includes(word)) return;

        const indices = solutions[word];
        const allSelected = indices.every(i => state.selectedIndices.has(i));

        if (allSelected) {
            markWordFound(word, indices);
        }
    });
}

function markWordFound(word, indices) {
    state.foundWords.push(word);
    
    document.getElementById(`word-${word}`).classList.add('done');

    indices.forEach(index => {
        const tile = gridEl.children[index];
        tile.classList.remove('selected');
        tile.classList.add('found');
        state.selectedIndices.delete(index);
    });

    if (navigator.vibrate) navigator.vibrate(50);

    if (state.foundWords.length === 3) {
        setTimeout(triggerWin, 500);
    }
}

function triggerWin() {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.add('modal-enter');
        createConfetti();
    }, 10);
}

document.getElementById('whatsapp-btn').addEventListener('click', () => {
    const text = encodeURIComponent(SUCCESS_MESSAGE);
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${text}`, '_blank');
});

const copyBtn = document.getElementById('copy-btn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(DISPLAY_NUMBER).then(() => {
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check text-green-500"></i>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Erro ao copiar. Tente manualmente!');
        });
    });
}
// ------------------------------

function createConfetti() {
    const colors = ['#f472b6', '#4ade80', '#60a5fa', '#facc15'];
    
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = Math.random() * 3 + 2 + 's';
        const size = Math.random() * 10 + 5 + 'px';
        
        conf.style.backgroundColor = bg;
        conf.style.left = left;
        conf.style.animationDuration = animDuration;
        conf.style.width = size;
        conf.style.height = size;
        conf.style.top = '-20px';
        
        document.body.appendChild(conf);
        
        setTimeout(() => conf.remove(), 5000);
    }
}