/* ============================================================
   flashcard.js — フラッシュカードモジュール
   ============================================================ */
const Flashcard = (() => {
  let cats = [], curCatId = null, curIdx = 0;
  let playing = false, timer = null, speed = 1000;
  let voiceOn = true, textOn = true, flipMode = false;

  function getData() {
    return Storage.getData().flashcards.categories;
  }

  function curCat() {
    return cats.find(c => c.id === curCatId) || cats[0];
  }

  function init() {
    App.buildAgePills('fc-age-pills', i => {
      speed = Storage.getData().ageSettings[i].flashSpeed;
      syncSpeedSeg();
    });

    // 速度セグメント
    document.querySelectorAll('#fc-speed-seg button').forEach(btn => {
      btn.onclick = () => {
        speed = +btn.dataset.s;
        syncSpeedSeg();
      };
    });

    // 音声トグル
    document.getElementById('fc-voice-toggle').onclick = function () {
      voiceOn = !voiceOn;
      this.classList.toggle('on', voiceOn);
    };
    // 文字トグル
    document.getElementById('fc-text-toggle').onclick = function () {
      textOn = !textOn;
      this.classList.toggle('on', textOn);
      renderCard();
    };
    // 両面モードトグル
    document.getElementById('fc-flip-toggle').onclick = function () {
      flipMode = !flipMode;
      this.classList.toggle('on', flipMode);
      renderCard();
    };
  }

  function open() {
    stop();
    cats = getData();
    if (!cats.length) return;
    curCatId = cats[0].id;
    curIdx = 0;
    const ageData = Storage.getData().ageSettings[App.getAge()];
    speed = ageData.flashSpeed;
    syncSpeedSeg();
    buildCatRow();
    renderCard();
    App.showPage('page-flashcard');
  }

  function buildCatRow() {
    const row = document.getElementById('fc-cat-row');
    if (!row) return;
    row.replaceChildren();
    cats.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'cat-btn' + (cat.id === curCatId ? ' on' : '');
      b.textContent = cat.name;
      b.onclick = () => { curCatId = cat.id; curIdx = 0; buildCatRow(); renderCard(); };
      row.appendChild(b);
    });
  }

  function renderCard() {
    const cat = curCat();
    if (!cat || !cat.cards.length) return;
    const card = cat.cards[curIdx % cat.cards.length];

    const picEl = document.getElementById('fc-pic');
    const wordEl = document.getElementById('fc-word');
    const cardEl = document.getElementById('fc-card');

    // 表示するもの：通常=絵文字、両面flip=ひらがな名
    const isHiragana = cat.id === 'hiragana';
    let displayEmoji = card.emoji;

    if (flipMode && isHiragana && card.wordEmoji) {
      displayEmoji = card.wordEmoji;
    }

    if (card.imageUrl) {
      const img = document.createElement('img');
      img.src = card.imageUrl;
      img.alt = card.name;
      picEl.replaceChildren(img);
      picEl.className = 'pic has-image';
    } else {
      picEl.textContent = displayEmoji;
      picEl.className = 'pic' + (isHiragana && !flipMode ? ' hiragana-pic' : '');
    }

    if (textOn) {
      wordEl.textContent = flipMode && isHiragana ? card.word || card.name : card.name;
      wordEl.style.display = 'block';
    } else {
      wordEl.style.display = 'none';
    }

    // pop アニメーション
    cardEl.classList.remove('pop');
    void cardEl.offsetWidth;
    cardEl.classList.add('pop');

    if (voiceOn) App.say(card.name);
  }

  function next() { curIdx++; renderCard(); }
  function prev() { curIdx = Math.max(0, curIdx - 1); renderCard(); }

  function togglePlay() {
    playing = !playing;
    const btn = document.getElementById('fc-play-btn');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
    if (playing) loop();
    else clearTimeout(timer);
  }

  function loop() {
    if (!playing) return;
    renderCard();
    curIdx++;
    timer = setTimeout(loop, speed);
  }

  function stop() {
    playing = false;
    clearTimeout(timer);
    timer = null;
    const btn = document.getElementById('fc-play-btn');
    if (btn) btn.textContent = '▶';
  }

  function syncSpeedSeg() {
    document.querySelectorAll('#fc-speed-seg button').forEach(b => {
      b.classList.toggle('on', +b.dataset.s === speed);
    });
  }

  return { init, open, next, prev, togglePlay, stop };
})();
