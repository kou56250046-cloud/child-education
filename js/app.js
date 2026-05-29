/* ============================================================
   app.js — アプリコア（ナビ・ビュー切替・音声・アニメーション）
   ============================================================ */
const App = (() => {
  let currentAge = 2;
  let jpVoice = null;

  /* ---- 音声 ---- */
  function initSpeech() {
    if (!window.speechSynthesis) return;
    const load = () => {
      const vs = speechSynthesis.getVoices();
      jpVoice = vs.find(v => v.lang === 'ja-JP') || vs.find(v => v.lang.startsWith('ja')) || null;
    };
    speechSynthesis.onvoiceschanged = load;
    load();
  }

  function say(text, rate = 1) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = rate; u.pitch = 1.1;
    if (jpVoice) u.voice = jpVoice;
    speechSynthesis.speak(u);
  }

  function stopSpeech() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  /* ---- ビュー切替 ---- */
  function showPage(id) {
    document.querySelectorAll('.page, .training-page').forEach(el => {
      el.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  }

  function goHome() {
    stopSpeech();
    Flashcard.stop();
    Dots.stop();
    Recitation.stop();
    showPage('page-landing');
    // ランディングページはスクロールをトップへ
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---- 年齢 ---- */
  function getAge() { return currentAge; }

  function setAge(idx) {
    currentAge = idx;
    // 全ビューの年齢ピルを同期
    document.querySelectorAll('.age-pills').forEach(wrap => {
      wrap.querySelectorAll('.pill').forEach((p, i) => {
        p.classList.toggle('on', i === idx);
      });
    });
  }

  function buildAgePills(containerId, onChange) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    const data = Storage.getData();
    data.ageSettings.forEach((a, i) => {
      const b = document.createElement('button');
      b.className = 'pill' + (i === currentAge ? ' on' : '');
      b.textContent = a.label;
      b.onclick = () => { setAge(i); if (onChange) onChange(i); };
      c.appendChild(b);
    });
  }

  /* ---- スクロールアニメーション ---- */
  function initScrollAnimation() {
    if (!window.IntersectionObserver) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
  }

  /* ---- 右脳グラフの描画 ---- */
  function renderBrainGraph() {
    const data = Storage.getData();
    const wrap = document.getElementById('brain-graph-bars');
    if (!wrap) return;
    wrap.innerHTML = '';
    // 0歳が最大（100%）〜5歳（20%）の臨界期イメージ
    const percents = [100, 85, 68, 50, 35, 20];
    data.ageSettings.forEach((a, i) => {
      const row = document.createElement('div');
      row.className = 'graph-bar-row';

      const lbl = document.createElement('span');
      lbl.className = 'age-lbl';
      lbl.textContent = a.label;

      const bar = document.createElement('div');
      bar.className = 'graph-bar';

      const fill = document.createElement('div');
      fill.className = 'graph-bar-fill';
      fill.style.width = '0%';
      fill.dataset.w = percents[i] + '%';

      bar.appendChild(fill);
      row.appendChild(lbl);
      row.appendChild(bar);
      wrap.appendChild(row);
    });
    // アニメーション
    setTimeout(() => {
      wrap.querySelectorAll('.graph-bar-fill').forEach(el => {
        el.style.width = el.dataset.w;
      });
    }, 300);
  }

  /* ---- セクションテキスト動的ロード ---- */
  function loadSectionTexts() {
    const s = Storage.getData().sections;
    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt || ''; };

    setText('hero-title-main', s.hero.title.split(' ')[0]);
    setText('hero-title-span', s.hero.title.split(' ')[1] || 'あそび');
    setText('hero-sub', s.hero.subtitle);
    setText('hero-brain-desc', s.hero.brainDesc);
    setText('hero-critical-desc', s.hero.criticalDesc);
    setText('hero-flash-desc', s.hero.flashDesc);
    setText('hero-disclaimer', s.hero.disclaimer);

    const contents = ['flashcard','dots','recitation','memorychip','miginoukun','game'];
    contents.forEach(k => {
      const sec = s[k];
      if (!sec) return;
      setText(`sec-${k}-title`, sec.title);
      setText(`sec-${k}-meaning`, sec.meaning);
      setText(`sec-${k}-howto`, sec.howTo);
    });
  }

  /* ---- 印刷ページ遷移 ---- */
  function openPrint(type) {
    window.open(`print.html?type=${type}`, '_blank');
  }

  /* ---- 初期化 ---- */
  function init() {
    initSpeech();
    loadSectionTexts();
    renderBrainGraph();
    initScrollAnimation();
    // PWA Service Worker 登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  return { init, say, stopSpeech, showPage, goHome, getAge, setAge, buildAgePills, openPrint };
})();
