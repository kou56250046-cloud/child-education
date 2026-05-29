/* ============================================================
   admin.js — 管理画面ロジック
   ============================================================ */
const Admin = (() => {
  let activeCatKey = null; // 'flashcards' | 'memorychip'
  let activeCatId  = null;

  /* ---- パスワード認証 ---- */
  function init() {
    document.getElementById('pw-form').onsubmit = e => {
      e.preventDefault();
      const pw = document.getElementById('pw-input').value;
      if (Storage.checkPassword(pw)) {
        document.getElementById('pw-screen').style.display   = 'none';
        document.getElementById('admin-layout').classList.add('active');
        buildAll();
      } else {
        document.getElementById('pw-error').textContent = 'パスワードが違います';
      }
    };

    // タブ切替
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      };
    });
  }

  function buildAll() {
    buildCardTab();
    buildTextTab();
    buildSettingsTab();
    buildBackupTab();
    buildPwChange();
  }

  /* ============================================================
     ① カード管理タブ
     ============================================================ */
  function buildCardTab() {
    buildContentSelector();
  }

  function buildContentSelector() {
    const sel = document.getElementById('card-content-sel');
    if (!sel) return;
    sel.onchange = () => {
      activeCatKey = sel.value;
      activeCatId  = null;
      buildCatList();
    };
    activeCatKey = sel.value;
    buildCatList();
  }

  function buildCatList() {
    const data = Storage.getData();
    const cats = activeCatKey === 'flashcards'
      ? data.flashcards.categories
      : activeCatKey === 'memorychip'
      ? data.memorychip.categories
      : data.miginoukun ? [] : [];

    const wrap = document.getElementById('cat-list-wrap');
    if (!wrap) return;
    wrap.replaceChildren();

    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-tab' + (cat.id === activeCatId ? ' active' : '');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = cat.name;
      btn.appendChild(nameSpan);

      const delBtn = document.createElement('span');
      delBtn.className = 'del-cat';
      delBtn.textContent = '×';
      delBtn.title = 'カテゴリを削除';
      delBtn.onclick = ev => { ev.stopPropagation(); deleteCat(cat.id); };
      btn.appendChild(delBtn);

      btn.onclick = () => { activeCatId = cat.id; buildCatList(); buildCardList(); };
      wrap.appendChild(btn);
    });

    // カテゴリ追加フォーム
    const addForm = document.getElementById('add-cat-form');
    if (addForm) {
      addForm.onsubmit = e => { e.preventDefault(); addCategory(); };
    }

    if (activeCatId) buildCardList();
  }

  function addCategory() {
    const nameInp = document.getElementById('new-cat-name');
    const name = nameInp.value.trim();
    if (!name) return;
    const data = Storage.getData();
    const id   = 'cat_' + Date.now();
    if (activeCatKey === 'flashcards') {
      data.flashcards.categories.push({ id, name, color: '#cfe0b8', cards: [] });
      Storage.saveFlashcards(data.flashcards);
    } else if (activeCatKey === 'memorychip') {
      data.memorychip.categories.push({ id, name, color: '#bcdce4', chips: [] });
      Storage.saveMemorychip(data.memorychip);
    }
    nameInp.value = '';
    activeCatId = id;
    buildCatList();
  }

  function deleteCat(catId) {
    if (!confirm('このカテゴリを削除しますか？')) return;
    const data = Storage.getData();
    if (activeCatKey === 'flashcards') {
      data.flashcards.categories = data.flashcards.categories.filter(c => c.id !== catId);
      Storage.saveFlashcards(data.flashcards);
    } else if (activeCatKey === 'memorychip') {
      data.memorychip.categories = data.memorychip.categories.filter(c => c.id !== catId);
      Storage.saveMemorychip(data.memorychip);
    }
    if (activeCatId === catId) activeCatId = null;
    buildCatList();
    const wrap = document.getElementById('card-list-wrap');
    if (wrap) wrap.replaceChildren();
  }

  function buildCardList() {
    const data = Storage.getData();
    let cards = [];
    if (activeCatKey === 'flashcards') {
      const cat = data.flashcards.categories.find(c => c.id === activeCatId);
      cards = cat ? cat.cards : [];
    } else if (activeCatKey === 'memorychip') {
      const cat = data.memorychip.categories.find(c => c.id === activeCatId);
      cards = cat ? cat.chips : [];
    }

    const wrap = document.getElementById('card-list-wrap');
    if (!wrap) return;
    wrap.replaceChildren();

    cards.forEach((card, idx) => {
      const item = document.createElement('div');
      item.className = 'card-item';

      const top = document.createElement('div');
      top.className = 'card-item-top';

      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'card-preview-emoji';
      emojiSpan.textContent = card.emoji;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'card-preview-name';
      nameSpan.textContent = card.name;

      top.appendChild(emojiSpan);
      top.appendChild(nameSpan);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-secondary';
      editBtn.textContent = '編集';
      editBtn.onclick = () => openCardEdit(idx, card);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-danger';
      delBtn.textContent = '削除';
      delBtn.onclick = () => deleteCard(idx);

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      item.appendChild(top);
      item.appendChild(actions);
      wrap.appendChild(item);
    });

    // カード追加フォーム
    const addForm = document.getElementById('add-card-form');
    if (addForm) addForm.onsubmit = e => { e.preventDefault(); addCard(); };
  }

  function addCard() {
    const nameInp  = document.getElementById('new-card-name');
    const emojiInp = document.getElementById('new-card-emoji');
    const name  = nameInp.value.trim();
    const emoji = emojiInp.value.trim();
    if (!name || !emoji) return;
    const data = Storage.getData();
    if (activeCatKey === 'flashcards') {
      const cat = data.flashcards.categories.find(c => c.id === activeCatId);
      if (cat) { cat.cards.push({ name, emoji }); Storage.saveFlashcards(data.flashcards); }
    } else if (activeCatKey === 'memorychip') {
      const cat = data.memorychip.categories.find(c => c.id === activeCatId);
      if (cat) { cat.chips.push({ name, emoji }); Storage.saveMemorychip(data.memorychip); }
    }
    nameInp.value = ''; emojiInp.value = '';
    buildCardList();
  }

  function deleteCard(idx) {
    if (!confirm('このカードを削除しますか？')) return;
    const data = Storage.getData();
    if (activeCatKey === 'flashcards') {
      const cat = data.flashcards.categories.find(c => c.id === activeCatId);
      if (cat) { cat.cards.splice(idx, 1); Storage.saveFlashcards(data.flashcards); }
    } else if (activeCatKey === 'memorychip') {
      const cat = data.memorychip.categories.find(c => c.id === activeCatId);
      if (cat) { cat.chips.splice(idx, 1); Storage.saveMemorychip(data.memorychip); }
    }
    buildCardList();
  }

  function openCardEdit(idx, card) {
    const newName  = prompt('名前を入力してください', card.name);
    if (newName === null) return;
    const newEmoji = prompt('絵文字を入力してください', card.emoji);
    if (newEmoji === null) return;
    const data = Storage.getData();
    if (activeCatKey === 'flashcards') {
      const cat = data.flashcards.categories.find(c => c.id === activeCatId);
      if (cat) { cat.cards[idx] = { ...card, name: newName.trim(), emoji: newEmoji.trim() }; Storage.saveFlashcards(data.flashcards); }
    } else if (activeCatKey === 'memorychip') {
      const cat = data.memorychip.categories.find(c => c.id === activeCatId);
      if (cat) { cat.chips[idx] = { ...card, name: newName.trim(), emoji: newEmoji.trim() }; Storage.saveMemorychip(data.memorychip); }
    }
    buildCardList();
  }

  /* ============================================================
     ② テキスト管理タブ
     ============================================================ */
  function buildTextTab() {
    const data = Storage.getData();
    const sections = data.sections;

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

    // ヒーロー
    setVal('edit-hero-title',    sections.hero.title);
    setVal('edit-hero-subtitle', sections.hero.subtitle);
    setVal('edit-hero-brainDesc',    sections.hero.brainDesc);
    setVal('edit-hero-criticalDesc', sections.hero.criticalDesc);
    setVal('edit-hero-flashDesc',    sections.hero.flashDesc);
    setVal('edit-hero-disclaimer',   sections.hero.disclaimer);

    // 各コンテンツセクション
    ['flashcard','dots','recitation','memorychip','miginoukun','game'].forEach(k => {
      const sec = sections[k];
      if (!sec) return;
      setVal(`edit-${k}-title`,   sec.title);
      setVal(`edit-${k}-meaning`, sec.meaning);
      setVal(`edit-${k}-howto`,   sec.howTo);
    });

    // 暗唱テキスト
    buildReciteList();

    // 保存ボタン
    const saveBtn = document.getElementById('save-text-btn');
    if (saveBtn) saveBtn.onclick = saveTexts;

    // 暗唱追加
    const addReciteForm = document.getElementById('add-recite-form');
    if (addReciteForm) addReciteForm.onsubmit = e => { e.preventDefault(); addReciteText(); };
  }

  function saveTexts() {
    const data = Storage.getData();
    const s = data.sections;
    const getVal = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    s.hero.title        = getVal('edit-hero-title');
    s.hero.subtitle     = getVal('edit-hero-subtitle');
    s.hero.brainDesc    = getVal('edit-hero-brainDesc');
    s.hero.criticalDesc = getVal('edit-hero-criticalDesc');
    s.hero.flashDesc    = getVal('edit-hero-flashDesc');
    s.hero.disclaimer   = getVal('edit-hero-disclaimer');

    ['flashcard','dots','recitation','memorychip','miginoukun','game'].forEach(k => {
      if (!s[k]) s[k] = {};
      s[k].title   = getVal(`edit-${k}-title`);
      s[k].meaning = getVal(`edit-${k}-meaning`);
      s[k].howTo   = getVal(`edit-${k}-howto`);
    });

    Storage.saveSections(s);
    showToast('テキストを保存しました ✓');
  }

  function buildReciteList() {
    const data = Storage.getData();
    const wrap = document.getElementById('recite-text-list');
    if (!wrap) return;
    wrap.replaceChildren();

    data.recitation.texts.forEach((t, i) => {
      const row = document.createElement('div');
      row.style.cssText = 'border:2px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px;';

      const titleRow = document.createElement('div');
      titleRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
      const titleSpan = document.createElement('b');
      titleSpan.textContent = t.title;
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-secondary';
      editBtn.textContent = '編集';
      editBtn.onclick = () => editReciteText(i, t);
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-danger';
      delBtn.textContent = '削除';
      delBtn.onclick = () => deleteReciteText(i);

      titleRow.appendChild(titleSpan);
      titleRow.appendChild(editBtn);
      titleRow.appendChild(delBtn);

      const preview = document.createElement('p');
      preview.style.cssText = 'font-size:12px;color:var(--soft-ink);margin:0;';
      preview.textContent = t.text.substring(0, 40) + '…';

      row.appendChild(titleRow);
      row.appendChild(preview);
      wrap.appendChild(row);
    });
  }

  function addReciteText() {
    const titleInp = document.getElementById('new-recite-title');
    const textArea = document.getElementById('new-recite-text');
    const title = titleInp.value.trim();
    const text  = textArea.value.trim();
    if (!title || !text) return;
    const data = Storage.getData();
    data.recitation.texts.push({ id: 'r_' + Date.now(), title, text });
    Storage.saveRecitation(data.recitation);
    titleInp.value = ''; textArea.value = '';
    buildReciteList();
  }

  function editReciteText(idx, t) {
    const newTitle = prompt('タイトルを入力してください', t.title);
    if (newTitle === null) return;
    const newText  = prompt('テキストを入力してください', t.text);
    if (newText === null) return;
    const data = Storage.getData();
    data.recitation.texts[idx] = { ...t, title: newTitle.trim(), text: newText.trim() };
    Storage.saveRecitation(data.recitation);
    buildReciteList();
  }

  function deleteReciteText(idx) {
    if (!confirm('この題材を削除しますか？')) return;
    const data = Storage.getData();
    data.recitation.texts.splice(idx, 1);
    Storage.saveRecitation(data.recitation);
    buildReciteList();
  }

  /* ============================================================
     ③ 設定管理タブ
     ============================================================ */
  function buildSettingsTab() {
    const data = Storage.getData();
    const wrap = document.getElementById('age-settings-wrap');
    if (!wrap) return;
    wrap.replaceChildren();

    data.ageSettings.forEach((a, i) => {
      const row = document.createElement('div');
      row.className = 'age-setting-row';

      const lbl = document.createElement('span');
      lbl.className = 'age-lbl';
      lbl.textContent = a.label;

      const speedInp = document.createElement('input');
      speedInp.className = 'inp';
      speedInp.type = 'number'; speedInp.min = '100'; speedInp.max = '5000';
      speedInp.value = a.flashSpeed;
      speedInp.dataset.idx = i; speedInp.dataset.field = 'flashSpeed';

      const dotInp = document.createElement('input');
      dotInp.className = 'inp';
      dotInp.type = 'number'; dotInp.min = '1'; dotInp.max = '100';
      dotInp.value = a.dotMax;
      dotInp.dataset.idx = i; dotInp.dataset.field = 'dotMax';

      row.appendChild(lbl);
      row.appendChild(speedInp);
      row.appendChild(dotInp);
      wrap.appendChild(row);
    });

    const saveBtn = document.getElementById('save-age-btn');
    if (saveBtn) saveBtn.onclick = saveAgeSettings;
    const resetBtn = document.getElementById('reset-age-btn');
    if (resetBtn) resetBtn.onclick = () => {
      if (confirm('年齢別設定をデフォルトに戻しますか？')) {
        Storage.remove('ageSettings');
        buildSettingsTab();
        showToast('リセットしました');
      }
    };
  }

  function saveAgeSettings() {
    const data = Storage.getData();
    document.querySelectorAll('#age-settings-wrap input').forEach(inp => {
      const i = +inp.dataset.idx;
      const f = inp.dataset.field;
      data.ageSettings[i][f] = +inp.value;
    });
    Storage.saveAgeSettings(data.ageSettings);
    showToast('設定を保存しました ✓');
  }

  /* ============================================================
     ④ バックアップタブ
     ============================================================ */
  function buildBackupTab() {
    document.getElementById('btn-export').onclick = () => Storage.exportAll();

    document.getElementById('btn-import-trigger').onclick = () =>
      document.getElementById('import-file').click();

    document.getElementById('import-file').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const ok = Storage.importAll(ev.target.result);
        const notice = document.getElementById('import-notice');
        if (notice) {
          notice.textContent = ok ? 'インポートに成功しました ✓' : 'ファイルの形式が正しくありません';
          notice.classList.add('show');
          setTimeout(() => notice.classList.remove('show'), 3000);
        }
        if (ok) buildAll();
      };
      reader.readAsText(file);
    };

    document.getElementById('btn-reset-all').onclick = () => {
      if (confirm('すべてのデータをデフォルトに戻しますか？\nこの操作は元に戻せません。')) {
        Storage.resetAll();
        buildAll();
        showToast('全データをリセットしました');
      }
    };
  }

  /* ============================================================
     パスワード変更
     ============================================================ */
  function buildPwChange() {
    const form = document.getElementById('pw-change-form');
    if (!form) return;
    form.onsubmit = e => {
      e.preventDefault();
      const cur  = document.getElementById('pw-current').value;
      const next = document.getElementById('pw-new').value;
      const conf = document.getElementById('pw-confirm').value;
      if (!Storage.checkPassword(cur)) { alert('現在のパスワードが違います'); return; }
      if (next.length < 4) { alert('新しいパスワードは4文字以上にしてください'); return; }
      if (next !== conf)   { alert('確認パスワードが一致しません'); return; }
      Storage.setPassword(next);
      showToast('パスワードを変更しました ✓');
      form.reset();
    };
  }

  /* ---- ユーティリティ ---- */
  function showToast(msg) {
    const t = document.getElementById('admin-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 2500);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Admin.init());
