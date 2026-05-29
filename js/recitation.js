/* ============================================================
   recitation.js — 暗唱モジュール
   ============================================================ */
const Recitation = (() => {
  let texts = [], curIdx = 0, rate = 1;

  function getData() {
    return Storage.getData().recitation.texts;
  }

  function init() {
    document.querySelectorAll('#rec-speed-seg button').forEach(btn => {
      btn.onclick = () => {
        rate = parseFloat(btn.dataset.r);
        document.querySelectorAll('#rec-speed-seg button').forEach(b =>
          b.classList.toggle('on', b.dataset.r === btn.dataset.r));
      };
    });
  }

  function open() {
    stop();
    texts = getData();
    curIdx = 0;
    buildList();
    renderText();
    App.showPage('page-recitation');
  }

  function buildList() {
    const list = document.getElementById('rec-list');
    if (!list) return;
    list.replaceChildren();
    texts.forEach((t, i) => {
      const b = document.createElement('button');
      b.className = 'cat-btn' + (i === curIdx ? ' on' : '');
      b.textContent = t.title;
      b.onclick = () => { curIdx = i; buildList(); renderText(); };
      list.appendChild(b);
    });
  }

  function renderText() {
    const el = document.getElementById('rec-text');
    if (!el || !texts.length) return;
    el.textContent = texts[curIdx].text;
  }

  function play() {
    if (!texts.length) return;
    App.say(texts[curIdx].text.replace(/　/g, '、'), rate);
  }

  function stop() {
    App.stopSpeech();
  }

  return { init, open, play, stop };
})();
