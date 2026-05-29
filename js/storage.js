/* ============================================================
   Storage — localStorage CRUD ヘルパー
   デフォルトデータ (DEFAULT_DATA) を基底に、
   管理画面での変更を localStorage で上書き管理する
   ============================================================ */
const Storage = (() => {
  const PREFIX = 'rnt_';

  function key(name) { return PREFIX + name; }

  /* --- 基本操作 --- */
  function get(name) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
    } catch (e) { console.warn('Storage.set failed:', e); }
  }

  function remove(name) {
    localStorage.removeItem(key(name));
  }

  /* --- データ全体の取得（デフォルト＋ローカル上書き） --- */
  function getData() {
    const d = JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep clone

    const overrides = ['ageSettings','flashcards','dots','recitation',
                       'memorychip','miginoukun','sections'];
    overrides.forEach(k => {
      const v = get(k);
      if (v !== null) d[k] = v;
    });
    return d;
  }

  /* --- 個別キー上書き --- */
  function saveFlashcards(data)   { set('flashcards',   data); }
  function saveRecitation(data)   { set('recitation',   data); }
  function saveMemorychip(data)   { set('memorychip',   data); }
  function saveMiginoukun(data)   { set('miginoukun',   data); }
  function saveSections(data)     { set('sections',     data); }
  function saveAgeSettings(data)  { set('ageSettings',  data); }
  function saveDots(data)         { set('dots',         data); }

  /* --- 全リセット --- */
  function resetAll() {
    ['ageSettings','flashcards','dots','recitation',
     'memorychip','miginoukun','sections'].forEach(remove);
  }

  /* --- エクスポート（JSON ダウンロード） --- */
  function exportAll() {
    const blob = new Blob([JSON.stringify(getData(), null, 2)],
                          { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'miginoua-data.json';
    a.click();
  }

  /* --- インポート --- */
  function importAll(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      ['ageSettings','flashcards','dots','recitation',
       'memorychip','miginoukun','sections'].forEach(k => {
        if (parsed[k]) set(k, parsed[k]);
      });
      return true;
    } catch { return false; }
  }

  /* --- パスワード管理 --- */
  const DEFAULT_PW = 'admin1234';

  function checkPassword(pw) {
    const stored = localStorage.getItem(PREFIX + 'pw') || DEFAULT_PW;
    return pw === stored;
  }

  function setPassword(newPw) {
    localStorage.setItem(PREFIX + 'pw', newPw);
  }

  return {
    get, set, remove,
    getData,
    saveFlashcards, saveRecitation, saveMemorychip,
    saveMiginoukun, saveSections, saveAgeSettings, saveDots,
    resetAll, exportAll, importAll,
    checkPassword, setPassword
  };
})();
