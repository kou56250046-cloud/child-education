/* ============================================================
   memorychip.js — メモリーチップモジュール
   3モード: link（リンク法）/ match（神経衰弱）/ sort（仲間分け）
   ============================================================ */
const MemoryChip = (() => {
  let mode = 'link';
  let allChips = [], curCatId = null;
  // link mode
  let linkSeq = [], linkStep = 0, linkPhase = 'show'; // show | recall
  let linkTimer = null;
  // match mode
  let matchCards = [], flipped = [], matchedPairs = 0;
  let matchLock = false;
  // sort mode
  let sortQueue = [], sortIdx = 0, sortScore = 0;

  function getData() { return Storage.getData().memorychip; }

  function allFlatChips(catId) {
    const data = getData();
    if (catId) {
      const cat = data.categories.find(c => c.id === catId);
      return cat ? cat.chips : [];
    }
    return data.categories.flatMap(c => c.chips);
  }

  function init() {
    document.querySelectorAll('.mc-mode-btn').forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.mode;
        document.querySelectorAll('.mc-mode-btn').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
        startMode();
      };
    });
  }

  function open() {
    stop();
    const data = getData();
    curCatId = data.categories[0]?.id || null;
    buildCatRow();
    mode = 'link';
    document.querySelectorAll('.mc-mode-btn').forEach(b => b.classList.toggle('on', b.dataset.mode === 'link'));
    startMode();
    App.showPage('page-memorychip');
  }

  function buildCatRow() {
    const row = document.getElementById('mc-cat-row');
    if (!row) return;
    row.replaceChildren();
    getData().categories.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'cat-btn' + (cat.id === curCatId ? ' on' : '');
      b.textContent = cat.name;
      b.onclick = () => { curCatId = cat.id; buildCatRow(); startMode(); };
      row.appendChild(b);
    });
  }

  /* ---- モード共通 ---- */
  function startMode() {
    stop();
    clearResult();
    if (mode === 'link')  startLink();
    if (mode === 'match') startMatch();
    if (mode === 'sort')  startSort();
  }

  function stop() {
    clearTimeout(linkTimer);
    linkTimer = null;
    App.stopSpeech();
  }

  function setMsg(text) {
    const el = document.getElementById('mc-msg');
    if (el) el.textContent = text;
  }

  function setScore(text) {
    const el = document.getElementById('mc-score');
    if (el) el.textContent = text;
  }

  function clearResult() {
    const el = document.getElementById('mc-result');
    if (el) el.style.display = 'none';
  }

  function showResult(win) {
    const el = document.getElementById('mc-result');
    if (!el) return;
    el.style.display = 'flex';
    const emoji = el.querySelector('.result-emoji');
    const msg   = el.querySelector('.result-msg');
    const sub   = el.querySelector('.result-sub');
    if (emoji) emoji.textContent = win ? '🎉' : '😊';
    if (msg)   msg.textContent   = win ? 'すごい！' : 'もう一回！';
    if (sub)   sub.textContent   = win ? 'ぜんぶ おぼえたね！' : 'がんばれ！';
  }

  /* ========== リンク法モード ========== */
  function startLink() {
    const chips = allFlatChips(curCatId);
    const len = Math.min(5, chips.length);
    linkSeq = shuffle(chips).slice(0, len);
    linkStep = 0;
    linkPhase = 'show';
    setMsg('よく　みてね！');
    setScore('');
    renderLinkShow();
  }

  function renderLinkShow() {
    const stage = document.getElementById('mc-stage');
    if (!stage) return;
    stage.replaceChildren();
    linkSeq.forEach((chip, i) => {
      const el = makeChip(chip, false);
      el.style.animationDelay = (i * 0.06) + 's';
      stage.appendChild(el);
    });
    setMsg('よく　みてね！');
    // 3秒後に裏返す
    linkTimer = setTimeout(() => {
      stage.replaceChildren();
      linkSeq.forEach(chip => {
        const el = makeChip(chip, true);
        stage.appendChild(el);
        el.onclick = () => handleLinkTap(chip, el);
      });
      linkPhase = 'recall';
      linkStep = 0;
      setMsg('じゅんばんに　タップ！');
    }, 3000);
  }

  function handleLinkTap(chip, el) {
    if (linkPhase !== 'recall') return;
    if (chip === linkSeq[linkStep]) {
      el.classList.add('correct-flash');
      el.onclick = null;
      App.say(chip.name);
      linkStep++;
      if (linkStep >= linkSeq.length) {
        setMsg('やったね！');
        setTimeout(startLink, 1500);
      }
    } else {
      el.classList.add('wrong');
      setMsg('ちがうよ、もう一回！');
      setTimeout(() => { el.classList.remove('wrong'); }, 500);
    }
  }

  /* ========== 神経衰弱モード ========== */
  function startMatch() {
    const chips = shuffle(allFlatChips(curCatId)).slice(0, 6); // 6ペア=12枚
    matchCards = shuffle([...chips, ...chips].map((c, i) => ({ ...c, uid: i })));
    flipped = []; matchedPairs = 0; matchLock = false;
    setMsg('おなじ　えを　さがそう！');
    setScore('0 ペア');
    renderMatchBoard();
  }

  function renderMatchBoard() {
    const stage = document.getElementById('mc-stage');
    if (!stage) return;
    stage.replaceChildren();
    matchCards.forEach(card => {
      const el = makeChip(card, true);
      el.dataset.uid = card.uid;
      el.onclick = () => handleMatchFlip(card, el);
      stage.appendChild(el);
    });
  }

  function handleMatchFlip(card, el) {
    if (matchLock || el.classList.contains('matched') || flipped.some(f => f.uid === card.uid)) return;
    el.classList.remove('face-down');
    const emojiEl = document.createElement('span'); emojiEl.className = 'chip-emoji'; emojiEl.textContent = card.emoji;
    const nameEl  = document.createElement('span'); nameEl.className  = 'chip-name';  nameEl.textContent  = card.name;
    el.replaceChildren(emojiEl, nameEl);
    flipped.push({ card, el });
    App.say(card.name);
    if (flipped.length === 2) {
      matchLock = true;
      const [a, b] = flipped;
      if (a.card.name === b.card.name) {
        matchedPairs++;
        setScore(matchedPairs + ' ペア');
        a.el.classList.add('matched'); b.el.classList.add('matched');
        flipped = []; matchLock = false;
        if (matchedPairs >= matchCards.length / 2) {
          setMsg('ぜんぶ　そろった！🎉');
          showResult(true);
        }
      } else {
        setTimeout(() => {
          [a, b].forEach(({ el: e }) => {
            e.replaceChildren();
            e.classList.add('face-down');
          });
          flipped = []; matchLock = false;
        }, 1000);
      }
    }
  }

  /* ========== 仲間分けモード ========== */
  function startSort() {
    const data = getData();
    if (data.categories.length < 2) { setMsg('カテゴリが2つ以上ひつようです'); return; }
    const cats = data.categories.slice(0, 3);
    sortQueue = shuffle(cats.flatMap(cat => cat.chips.slice(0, 4).map(c => ({ ...c, catId: cat.id, catName: cat.name }))));
    sortIdx = 0; sortScore = 0;
    setMsg('どのなかまかな？');
    setScore('0 / ' + sortQueue.length);
    renderSort(cats);
  }

  function renderSort(cats) {
    const stage = document.getElementById('mc-stage');
    if (!stage) return;
    stage.replaceChildren();

    // 現在のチップ
    const current = sortQueue[sortIdx];
    if (!current) { showResult(true); return; }
    const chipEl = makeChip(current, false);
    chipEl.style.fontSize = '52px';
    stage.appendChild(chipEl);

    // カテゴリボタン
    const btnWrap = document.createElement('div');
    btnWrap.className = 'mode-select';
    btnWrap.style.marginTop = '16px';
    cats.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'mode-btn';
      b.textContent = cat.name;
      b.onclick = () => {
        if (cat.id === current.catId) {
          sortScore++;
          b.classList.add('on');
          App.say('せいかい！');
        } else {
          b.style.opacity = '0.4';
          App.say('ちがうよ');
        }
        sortIdx++;
        setScore(sortScore + ' / ' + sortQueue.length);
        setTimeout(() => renderSort(cats), 600);
      };
      btnWrap.appendChild(b);
    });
    stage.appendChild(btnWrap);
  }

  /* ---- ユーティリティ ---- */
  function makeChip(chip, faceDown) {
    const el = document.createElement('div');
    el.className = 'chip' + (faceDown ? ' face-down' : '');
    if (!faceDown) {
      const emojiEl = document.createElement('span'); emojiEl.className = 'chip-emoji'; emojiEl.textContent = chip.emoji;
      const nameEl  = document.createElement('span'); nameEl.className  = 'chip-name';  nameEl.textContent  = chip.name;
      el.appendChild(emojiEl); el.appendChild(nameEl);
    }
    return el;
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
