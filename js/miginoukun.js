/* ============================================================
   miginoukun.js — みぎのう君モジュール
   3モード: grid（マス記憶）/ poker（ポーカー）/ color（カラー記憶）
   ============================================================ */
const Miginoukun = (() => {
  let mode = 'grid';
  // grid mode
  let gridCols = 3, gridRows = 3, gridCards = [], gridPhase = 'memorize';
  let gridTimer = null, memorizeTime = 10;
  // poker mode (神経衰弱)
  let pokerCards = [], pokerFlipped = [], pokerMatched = 0, pokerLock = false;
  // color mode
  let colorSeq = [], colorInput = [], colorPhase = 'show';

  function getData() { return Storage.getData().miginoukun; }

  function init() {
    document.querySelectorAll('.mign-mode-btn').forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.mode;
        document.querySelectorAll('.mign-mode-btn').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
        startMode();
      };
    });
  }

  function open() {
    stop();
    mode = 'grid';
    document.querySelectorAll('.mign-mode-btn').forEach(b => b.classList.toggle('on', b.dataset.mode === 'grid'));
    startMode();
    App.showPage('page-miginoukun');
  }

  function startMode() {
    stop();
    clearResult();
    if (mode === 'grid')  startGrid();
    if (mode === 'poker') startPoker();
    if (mode === 'color') startColor();
  }

  function stop() {
    clearTimeout(gridTimer);
    gridTimer = null;
    App.stopSpeech();
  }

  function setMsg(text) {
    const el = document.getElementById('mign-msg');
    if (el) el.textContent = text;
  }

  function clearResult() {
    const el = document.getElementById('mign-result');
    if (el) el.style.display = 'none';
  }

  function showResult(correct, total) {
    const el = document.getElementById('mign-result');
    if (!el) return;
    el.style.display = 'flex';
    const win = correct === total;
    const emojiEl = el.querySelector('.result-emoji');
    const msgEl   = el.querySelector('.result-msg');
    const subEl   = el.querySelector('.result-sub');
    if (emojiEl) emojiEl.textContent = win ? '🎉' : '😊';
    if (msgEl)   msgEl.textContent   = win ? 'パーフェクト！' : correct + ' / ' + total + ' せいかい';
    if (subEl)   subEl.textContent   = win ? 'ぜんぶ おぼえてたね！' : 'もう一回やってみよう！';
  }

  /* ========== マス記憶モード ========== */
  function startGrid() {
    const data = getData();
    const level = Math.min(App.getAge(), 5);
    gridCols = level <= 1 ? 2 : level <= 3 ? 3 : 4;
    gridRows = level <= 1 ? 2 : level <= 3 ? 3 : 4;
    memorizeTime = [5, 8, 10, 15, 18, 20][level];

    const allPics = data.pictures;
    const count = gridCols * gridRows;
    gridCards = shuffle(allPics).slice(0, count);
    gridPhase = 'memorize';
    setMsg(memorizeTime + 'びょう　おぼえよう！');
    renderGrid(false);

    gridTimer = setTimeout(() => {
      gridPhase = 'recall';
      setMsg('どこに　あったかな？');
      renderGrid(true);
    }, memorizeTime * 1000);
  }

  function renderGrid(hidden) {
    const wrap = document.getElementById('mign-grid-wrap');
    if (!wrap) return;
    const existGrid = wrap.querySelector('.mign-grid');
    if (existGrid) wrap.removeChild(existGrid);

    const grid = document.createElement('div');
    grid.className = 'mign-grid';
    grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

    gridCards.forEach((card, i) => {
      const cell = document.createElement('div');
      cell.className = 'mign-cell' + (hidden ? ' hidden' : ' filled');
      if (!hidden) cell.textContent = card.emoji;
      if (hidden) {
        cell.onclick = () => handleGridRecall(i, cell);
      }
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);

    if (hidden) renderPicBank();
  }

  function renderPicBank() {
    const bank = document.getElementById('mign-bank');
    if (!bank) return;
    bank.replaceChildren();
    const shuffled = shuffle([...gridCards]);
    shuffled.forEach(card => {
      const el = document.createElement('div');
      el.className = 'mign-cell filled';
      el.textContent = card.emoji;
      el.onclick = () => selectBankItem(card, el);
      bank.appendChild(el);
    });
  }

  let selectedCard = null;
  function selectBankItem(card, el) {
    document.querySelectorAll('#mign-bank .mign-cell').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedCard = card;
  }

  function handleGridRecall(idx, cell) {
    if (!selectedCard) { setMsg('したの　えを　えらんでね'); return; }
    if (selectedCard.name === gridCards[idx].name) {
      cell.textContent = selectedCard.emoji;
      cell.classList.remove('hidden');
      cell.classList.add('filled', 'correct');
      cell.onclick = null;
      App.say(selectedCard.name);
      // 選んだバンクから削除
      document.querySelectorAll('#mign-bank .mign-cell').forEach(e => {
        if (e.textContent === selectedCard.emoji && e.classList.contains('selected')) e.remove();
      });
      selectedCard = null;
      // 全部埋まったか確認
      const remaining = document.querySelectorAll('#mign-grid-wrap .mign-cell.hidden');
      if (remaining.length === 0) showResult(gridCards.length, gridCards.length);
    } else {
      cell.classList.add('wrong');
      setTimeout(() => cell.classList.remove('wrong'), 500);
      App.say('ちがうよ');
    }
  }

  /* ========== ポーカーモード ========== */
  function startPoker() {
    const data = getData();
    const allPics = data.pictures.slice(0, 10);
    pokerCards = shuffle([...allPics, ...allPics].map((c, i) => ({ ...c, uid: i })));
    pokerFlipped = []; pokerMatched = 0; pokerLock = false;
    setMsg('おなじ　えを　さがそう！');
    renderPoker();
  }

  function renderPoker() {
    const stage = document.getElementById('mign-stage');
    if (!stage) return;
    stage.replaceChildren();
    const grid = document.createElement('div');
    grid.className = 'mign-grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    pokerCards.forEach(card => {
      const cell = document.createElement('div');
      cell.className = 'mign-cell hidden';
      cell.dataset.uid = card.uid;
      cell.onclick = () => handlePokerFlip(card, cell);
      grid.appendChild(cell);
    });
    stage.appendChild(grid);
  }

  function handlePokerFlip(card, el) {
    if (pokerLock || el.textContent !== '' || el.classList.contains('correct')) return;
    if (pokerFlipped.some(f => f.uid === card.uid)) return;

    el.textContent = card.emoji;
    el.classList.remove('hidden');
    el.classList.add('filled');
    pokerFlipped.push({ card, el });
    App.say(card.name);

    if (pokerFlipped.length === 2) {
      pokerLock = true;
      const [a, b] = pokerFlipped;
      if (a.card.name === b.card.name) {
        pokerMatched++;
        a.el.classList.add('correct'); b.el.classList.add('correct');
        pokerFlipped = []; pokerLock = false;
        if (pokerMatched >= pokerCards.length / 2) showResult(pokerMatched, pokerCards.length / 2);
      } else {
        setTimeout(() => {
          [a, b].forEach(({ el: e }) => {
            e.textContent = '';
            e.classList.add('hidden');
            e.classList.remove('filled');
          });
          pokerFlipped = []; pokerLock = false;
        }, 1000);
      }
    }
  }

  /* ========== カラー記憶モード ========== */
  function startColor() {
    const data = getData();
    const level = Math.min(App.getAge(), 5);
    const len = [2, 3, 4, 5, 6, 7][level];
    colorSeq = shuffle(data.colors).slice(0, len);
    colorInput = []; colorPhase = 'show';
    setMsg('いろを　おぼえよう！');
    renderColorShow();
  }

  function renderColorShow() {
    const stage = document.getElementById('mign-stage');
    if (!stage) return;
    stage.replaceChildren();
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;';
    colorSeq.forEach(c => {
      const el = document.createElement('div');
      el.className = 'color-chip';
      el.style.background = c.color;
      if (c.border) el.style.border = '3px solid #ccc';
      row.appendChild(el);
    });
    stage.appendChild(row);
    // 5秒後に隠す
    gridTimer = setTimeout(() => {
      colorPhase = 'recall';
      setMsg('おなじじゅんに　タップ！');
      renderColorRecall();
    }, 5000);
  }

  function renderColorRecall() {
    const stage = document.getElementById('mign-stage');
    if (!stage) return;
    stage.replaceChildren();

    // 入力エリア
    const inputRow = document.createElement('div');
    inputRow.id = 'color-input-row';
    inputRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:14px;';
    for (let i = 0; i < colorSeq.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'color-chip';
      slot.style.cssText = 'background:#ece2d2;border:2px dashed #ccc;';
      inputRow.appendChild(slot);
    }
    stage.appendChild(inputRow);

    // パレット
    const palette = document.createElement('div');
    palette.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;';
    Storage.getData().miginoukun.colors.forEach(c => {
      const el = document.createElement('div');
      el.className = 'color-chip';
      el.style.background = c.color;
      if (c.border) el.style.border = '3px solid #ccc';
      el.onclick = () => handleColorTap(c, inputRow);
      palette.appendChild(el);
    });
    stage.appendChild(palette);
  }

  function handleColorTap(color, inputRow) {
    colorInput.push(color);
    const slots = inputRow.querySelectorAll('.color-chip');
    const idx = colorInput.length - 1;
    if (slots[idx]) {
      slots[idx].style.background = color.color;
      if (color.border) slots[idx].style.border = '3px solid #ccc';
      slots[idx].style.borderStyle = 'solid';
    }
    if (colorInput.length === colorSeq.length) {
      const correct = colorSeq.filter((c, i) => c.name === colorInput[i].name).length;
      showResult(correct, colorSeq.length);
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { init, open, startMode, stop };
})();
