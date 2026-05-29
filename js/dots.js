/* ============================================================
   dots.js — ドッツモジュール
   ============================================================ */
const Dots = (() => {
  let playing = false, timer = null, speed = 1200;
  let dotMax = 7, showAnswer = true, voiceOn = true;
  let shape = 'circle';
  let addSubMode = false;
  let eqA = 0, eqB = 0;

  const SHAPE_CHARS = { star: '⭐', heart: '❤️', rabbit: '🐰', penguin: '🐧', circle: '' };

  function init() {
    App.buildAgePills('dots-age-pills', i => {
      const s = Storage.getData().ageSettings[i];
      dotMax = s.dotMax;
      speed = s.flashSpeed;
      syncSpeedSeg();
    });

    document.querySelectorAll('#dots-speed-seg button').forEach(btn => {
      btn.onclick = () => { speed = +btn.dataset.s; syncSpeedSeg(); };
    });

    document.getElementById('dots-show-toggle').onclick = function () {
      showAnswer = !showAnswer;
      this.classList.toggle('on', showAnswer);
    };
    document.getElementById('dots-voice-toggle').onclick = function () {
      voiceOn = !voiceOn;
      this.classList.toggle('on', voiceOn);
    };
    document.getElementById('dots-addsub-toggle').onclick = function () {
      addSubMode = !addSubMode;
      this.classList.toggle('on', addSubMode);
    };

    // 形状セグメント
    document.querySelectorAll('#dots-shape-seg button').forEach(btn => {
      btn.onclick = () => {
        shape = btn.dataset.sh;
        document.querySelectorAll('#dots-shape-seg button').forEach(b =>
          b.classList.toggle('on', b.dataset.sh === shape));
      };
    });
  }

  function open() {
    stop();
    const s = Storage.getData().ageSettings[App.getAge()];
    dotMax = s.dotMax;
    speed = s.flashSpeed;
    syncSpeedSeg();
    newDots();
    App.showPage('page-dots');
  }

  function newDots() {
    const n = Math.max(1, Math.floor(Math.random() * dotMax) + 1);
    const board = document.getElementById('dots-board');
    if (!board) return;

    // 既存の点を削除（answerは残す）
    Array.from(board.children).forEach(c => {
      if (c.classList.contains('dot-shape') || c.classList.contains('dot-answer') || c.classList.contains('dot-equation'))
        board.removeChild(c);
    });

    const ansEl = document.getElementById('dots-answer');
    const eqEl  = document.getElementById('dots-equation');
    if (ansEl) ansEl.classList.remove('show');
    if (eqEl)  eqEl.classList.remove('show');

    if (addSubMode && App.getAge() >= 3) {
      renderEquation(board, n, ansEl, eqEl);
    } else {
      renderDots(board, n);
      if (ansEl) { ansEl.textContent = String(n); }
      if (showAnswer) setTimeout(() => ansEl && ansEl.classList.add('show'), 200);
      if (voiceOn) App.say(String(n));
    }
    return n;
  }

  function renderDots(board, n) {
    const positions = generatePositions(n);
    positions.forEach((pos, i) => {
      const d = document.createElement('div');
      d.className = 'dot-shape ' + shape;
      d.style.left = pos.x + '%';
      d.style.top  = pos.y + '%';
      d.style.animationDelay = (i * 0.04) + 's';
      if (shape !== 'circle') {
        d.textContent = SHAPE_CHARS[shape] || '●';
      }
      board.insertBefore(d, board.firstChild);
    });
  }

  function renderEquation(board, n, ansEl, eqEl) {
    eqA = Math.max(1, Math.floor(Math.random() * (n - 1)) + 1);
    eqB = n - eqA;
    const isAdd = Math.random() > 0.5;
    let displayN, displayEq;
    if (isAdd) {
      displayN = n; displayEq = eqA + ' ＋ ' + eqB + ' ＝ ';
    } else {
      const big = Math.max(eqA, eqB) + eqA;
      displayN = eqA; displayEq = big + ' － ' + eqB + ' ＝ ';
    }
    renderDots(board, displayN);
    if (eqEl)  eqEl.textContent = displayEq + (showAnswer ? displayN : '？');
    if (eqEl && showAnswer) setTimeout(() => eqEl.classList.add('show'), 200);
    if (eqEl && !showAnswer) eqEl.classList.add('show');
    if (voiceOn) App.say(displayEq + displayN);
  }

  function generatePositions(n) {
    const positions = [];
    const margin = 10;
    for (let i = 0; i < n; i++) {
      let x, y, ok;
      let tries = 0;
      do {
        x = margin + Math.random() * (80 - margin);
        y = margin + Math.random() * (55 - margin);
        ok = positions.every(p => Math.hypot(p.x - x, p.y - y) > 14);
        tries++;
      } while (!ok && tries < 30);
      positions.push({ x, y });
    }
    return positions;
  }

  function togglePlay() {
    playing = !playing;
    const btn = document.getElementById('dots-play-btn');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
    if (playing) loop();
    else clearTimeout(timer);
  }

  function loop() {
    if (!playing) return;
    newDots();
    timer = setTimeout(loop, speed);
  }

  function stop() {
    playing = false;
    clearTimeout(timer);
    timer = null;
    const btn = document.getElementById('dots-play-btn');
    if (btn) btn.textContent = '▶';
  }

  function syncSpeedSeg() {
    document.querySelectorAll('#dots-speed-seg button').forEach(b => {
      b.classList.toggle('on', +b.dataset.s === speed);
    });
  }

  return { init, open, newDots, togglePlay, stop };
})();
