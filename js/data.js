/* ============================================================
   DEFAULT_DATA — 全コンテンツのデフォルト値（編集不可の初期値）
   管理画面での変更は localStorage に保存し、ここを上書きしない
   ============================================================ */
const DEFAULT_DATA = {

  /* ---- 年齢別設定 ---- */
  ageSettings: [
    { age: 0, label: '0さい', flashSpeed: 2000, dotMax: 3 },
    { age: 1, label: '1さい', flashSpeed: 1500, dotMax: 5 },
    { age: 2, label: '2さい', flashSpeed: 1000, dotMax: 7 },
    { age: 3, label: '3さい', flashSpeed: 800,  dotMax: 10 },
    { age: 4, label: '4さい', flashSpeed: 600,  dotMax: 15 },
    { age: 5, label: '5さい', flashSpeed: 500,  dotMax: 20 }
  ],

  /* ---- フラッシュカード ---- */
  flashcards: {
    categories: [
      {
        id: 'animals', name: 'どうぶつ', color: '#cfe0b8',
        cards: [
          { name: 'うさぎ',     emoji: '🐰' },
          { name: 'いぬ',       emoji: '🐶' },
          { name: 'ねこ',       emoji: '🐱' },
          { name: 'ぞう',       emoji: '🐘' },
          { name: 'きりん',     emoji: '🦒' },
          { name: 'らいおん',   emoji: '🦁' },
          { name: 'ぱんだ',     emoji: '🐼' },
          { name: 'さる',       emoji: '🐵' },
          { name: 'くま',       emoji: '🐻' },
          { name: 'ぶた',       emoji: '🐷' },
          { name: 'ひつじ',     emoji: '🐑' },
          { name: 'うし',       emoji: '🐄' },
          { name: 'にわとり',   emoji: '🐔' },
          { name: 'かめ',       emoji: '🐢' },
          { name: 'いるか',     emoji: '🐬' },
          { name: 'たか',       emoji: '🦅' },
          { name: 'きつね',     emoji: '🦊' },
          { name: 'おおかみ',   emoji: '🐺' },
          { name: 'りす',       emoji: '🐿️' },
          { name: 'ぺんぎん',   emoji: '🐧' }
        ]
      },
      {
        id: 'foods', name: 'くだもの・やさい', color: '#f6c8b0',
        cards: [
          { name: 'りんご',       emoji: '🍎' },
          { name: 'ばなな',       emoji: '🍌' },
          { name: 'いちご',       emoji: '🍓' },
          { name: 'みかん',       emoji: '🍊' },
          { name: 'ぶどう',       emoji: '🍇' },
          { name: 'すいか',       emoji: '🍉' },
          { name: 'もも',         emoji: '🍑' },
          { name: 'さくらんぼ',   emoji: '🍒' },
          { name: 'なし',         emoji: '🍐' },
          { name: 'めろん',       emoji: '🍈' },
          { name: 'にんじん',     emoji: '🥕' },
          { name: 'とまと',       emoji: '🍅' },
          { name: 'きゅうり',     emoji: '🥒' },
          { name: 'とうもろこし', emoji: '🌽' },
          { name: 'ほうれんそう', emoji: '🥬' }
        ]
      },
      {
        id: 'vehicles', name: 'のりもの', color: '#bcdce4',
        cards: [
          { name: 'でんしゃ',       emoji: '🚃' },
          { name: 'バス',           emoji: '🚌' },
          { name: 'タクシー',       emoji: '🚕' },
          { name: 'ひこうき',       emoji: '✈️' },
          { name: 'ふね',           emoji: '⛵' },
          { name: 'じてんしゃ',     emoji: '🚲' },
          { name: 'オートバイ',     emoji: '🏍️' },
          { name: 'しょうぼうしゃ', emoji: '🚒' },
          { name: 'きゅうきゅうしゃ',emoji: '🚑' },
          { name: 'パトカー',       emoji: '🚓' },
          { name: 'トラック',       emoji: '🚛' },
          { name: 'ロケット',       emoji: '🚀' },
          { name: 'ヘリコプター',   emoji: '🚁' },
          { name: 'しんかんせん',   emoji: '🚅' },
          { name: 'ヨット',         emoji: '⛵' }
        ]
      },
      {
        id: 'nature', name: 'しぜん', color: '#f5d98b',
        cards: [
          { name: 'たいよう', emoji: '☀️' },
          { name: 'つき',     emoji: '🌙' },
          { name: 'ほし',     emoji: '⭐' },
          { name: 'くも',     emoji: '☁️' },
          { name: 'あめ',     emoji: '🌧️' },
          { name: 'ゆき',     emoji: '❄️' },
          { name: 'かわ',     emoji: '🏞️' },
          { name: 'うみ',     emoji: '🌊' },
          { name: 'やま',     emoji: '⛰️' },
          { name: 'はな',     emoji: '🌸' },
          { name: 'き',       emoji: '🌳' },
          { name: 'にじ',     emoji: '🌈' }
        ]
      },
      {
        id: 'shapes', name: 'いろ・かたち', color: '#e8d5f0',
        cards: [
          { name: 'あか',   emoji: '🔴' },
          { name: 'あお',   emoji: '🔵' },
          { name: 'きいろ', emoji: '🟡' },
          { name: 'みどり', emoji: '🟢' },
          { name: 'しろ',   emoji: '⬜' },
          { name: 'くろ',   emoji: '⬛' },
          { name: 'まる',   emoji: '⭕' },
          { name: 'さんかく',emoji: '🔺' },
          { name: 'しかく', emoji: '🟦' },
          { name: 'ほし',   emoji: '⭐' },
          { name: 'ハート', emoji: '❤️' },
          { name: 'ひし',   emoji: '💠' }
        ]
      },
      {
        id: 'hiragana', name: 'ひらがな', color: '#fde8d8',
        cards: [
          { name: 'あ', emoji: 'あ', word: 'あめ',   wordEmoji: '🍬' },
          { name: 'い', emoji: 'い', word: 'いぬ',   wordEmoji: '🐶' },
          { name: 'う', emoji: 'う', word: 'うし',   wordEmoji: '🐄' },
          { name: 'え', emoji: 'え', word: 'えんぴつ',wordEmoji: '✏️' },
          { name: 'お', emoji: 'お', word: 'おに',   wordEmoji: '👹' },
          { name: 'か', emoji: 'か', word: 'かに',   wordEmoji: '🦀' },
          { name: 'き', emoji: 'き', word: 'きつね', wordEmoji: '🦊' },
          { name: 'く', emoji: 'く', word: 'くも',   wordEmoji: '☁️' },
          { name: 'け', emoji: 'け', word: 'けいたい',wordEmoji: '📱' },
          { name: 'こ', emoji: 'こ', word: 'こい',   wordEmoji: '🐟' },
          { name: 'さ', emoji: 'さ', word: 'さる',   wordEmoji: '🐵' },
          { name: 'し', emoji: 'し', word: 'しか',   wordEmoji: '🦌' },
          { name: 'す', emoji: 'す', word: 'すいか', wordEmoji: '🍉' },
          { name: 'せ', emoji: 'せ', word: 'せみ',   wordEmoji: '🌿' },
          { name: 'そ', emoji: 'そ', word: 'そら',   wordEmoji: '🌤️' },
          { name: 'た', emoji: 'た', word: 'たこ',   wordEmoji: '🐙' },
          { name: 'ち', emoji: 'ち', word: 'ちず',   wordEmoji: '🗺️' },
          { name: 'つ', emoji: 'つ', word: 'つき',   wordEmoji: '🌙' },
          { name: 'て', emoji: 'て', word: 'てぶくろ',wordEmoji: '🧤' },
          { name: 'と', emoji: 'と', word: 'とり',   wordEmoji: '🐦' },
          { name: 'な', emoji: 'な', word: 'なす',   wordEmoji: '🍆' },
          { name: 'に', emoji: 'に', word: 'にんじん',wordEmoji: '🥕' },
          { name: 'ぬ', emoji: 'ぬ', word: 'ぬいぐるみ',wordEmoji: '🧸' },
          { name: 'ね', emoji: 'ね', word: 'ねこ',   wordEmoji: '🐱' },
          { name: 'の', emoji: 'の', word: 'のはら', wordEmoji: '🌿' },
          { name: 'は', emoji: 'は', word: 'はな',   wordEmoji: '🌸' },
          { name: 'ひ', emoji: 'ひ', word: 'ひつじ', wordEmoji: '🐑' },
          { name: 'ふ', emoji: 'ふ', word: 'ふね',   wordEmoji: '⛵' },
          { name: 'へ', emoji: 'へ', word: 'へび',   wordEmoji: '🐍' },
          { name: 'ほ', emoji: 'ほ', word: 'ほし',   wordEmoji: '⭐' },
          { name: 'ま', emoji: 'ま', word: 'まる',   wordEmoji: '⭕' },
          { name: 'み', emoji: 'み', word: 'みかん', wordEmoji: '🍊' },
          { name: 'む', emoji: 'む', word: 'むし',   wordEmoji: '🐛' },
          { name: 'め', emoji: 'め', word: 'めだか', wordEmoji: '🐟' },
          { name: 'も', emoji: 'も', word: 'もも',   wordEmoji: '🍑' },
          { name: 'や', emoji: 'や', word: 'やま',   wordEmoji: '⛰️' },
          { name: 'ゆ', emoji: 'ゆ', word: 'ゆき',   wordEmoji: '❄️' },
          { name: 'よ', emoji: 'よ', word: 'よる',   wordEmoji: '🌙' },
          { name: 'ら', emoji: 'ら', word: 'らいおん',wordEmoji: '🦁' },
          { name: 'り', emoji: 'り', word: 'りんご', wordEmoji: '🍎' },
          { name: 'る', emoji: 'る', word: 'るびー', wordEmoji: '💎' },
          { name: 'れ', emoji: 'れ', word: 'れもん', wordEmoji: '🍋' },
          { name: 'ろ', emoji: 'ろ', word: 'ろうそく',wordEmoji: '🕯️' },
          { name: 'わ', emoji: 'わ', word: 'わに',   wordEmoji: '🐊' },
          { name: 'を', emoji: 'を', word: 'を',     wordEmoji: 'を' },
          { name: 'ん', emoji: 'ん', word: 'ん',     wordEmoji: 'ん' }
        ]
      }
    ]
  },

  /* ---- ドッツ ---- */
  dots: {
    shapes: ['circle', 'star', 'heart', 'rabbit', 'penguin'],
    defaultShape: 'circle'
  },

  /* ---- 暗唱 ---- */
  recitation: {
    texts: [
      {
        id: 'aiueo',
        title: 'あいうえお',
        text: 'あいうえお　かきくけこ　さしすせそ　たちつてと　なにぬねの　はひふへほ　まみむめも　やいゆえよ　らりるれろ　わいうえを　ん'
      },
      {
        id: 'kazoeutea',
        title: 'かぞえうた',
        text: 'ひとつ　ふたつ　みっつ　よっつ　いつつ　むっつ　ななつ　やっつ　ここのつ　とお'
      },
      {
        id: 'harunouta',
        title: 'はるのうた',
        text: 'はるのひざし　おはながさいた　ちょうちょとんで　みつをあつめる　みんなえがおで　そとであそぼう'
      },
      {
        id: 'tsuki',
        title: 'つき',
        text: 'でた　でた　つきが　まるい　まるい　まんまるい　ぼんのような　つきが'
      },
      {
        id: 'iroha',
        title: 'いろはにほへと',
        text: 'いろはにほへと　ちりぬるを　わかよたれそ　つねならむ　うゐのおくやま　けふこえて　あさきゆめみし　ゑひもせす'
      }
    ]
  },

  /* ---- メモリーチップ ---- */
  memorychip: {
    categories: [
      {
        id: 'mc_animals', name: 'どうぶつ', color: '#cfe0b8',
        chips: [
          { name: 'いぬ',     emoji: '🐶' },
          { name: 'ねこ',     emoji: '🐱' },
          { name: 'うさぎ',   emoji: '🐰' },
          { name: 'くま',     emoji: '🐻' },
          { name: 'さる',     emoji: '🐵' },
          { name: 'ぞう',     emoji: '🐘' },
          { name: 'きりん',   emoji: '🦒' },
          { name: 'らいおん', emoji: '🦁' },
          { name: 'ぱんだ',   emoji: '🐼' },
          { name: 'ぺんぎん', emoji: '🐧' }
        ]
      },
      {
        id: 'mc_foods', name: 'たべもの', color: '#f6c8b0',
        chips: [
          { name: 'りんご',   emoji: '🍎' },
          { name: 'ばなな',   emoji: '🍌' },
          { name: 'いちご',   emoji: '🍓' },
          { name: 'みかん',   emoji: '🍊' },
          { name: 'ぶどう',   emoji: '🍇' },
          { name: 'にんじん', emoji: '🥕' },
          { name: 'とまと',   emoji: '🍅' },
          { name: 'とうもろこし', emoji: '🌽' },
          { name: 'すいか',   emoji: '🍉' },
          { name: 'もも',     emoji: '🍑' }
        ]
      },
      {
        id: 'mc_nature', name: 'しぜん', color: '#bcdce4',
        chips: [
          { name: 'たいよう', emoji: '☀️' },
          { name: 'つき',     emoji: '🌙' },
          { name: 'ほし',     emoji: '⭐' },
          { name: 'くも',     emoji: '☁️' },
          { name: 'あめ',     emoji: '🌧️' },
          { name: 'ゆき',     emoji: '❄️' },
          { name: 'にじ',     emoji: '🌈' },
          { name: 'はな',     emoji: '🌸' },
          { name: 'き',       emoji: '🌳' },
          { name: 'うみ',     emoji: '🌊' }
        ]
      }
    ]
  },

  /* ---- みぎのう君 ---- */
  miginoukun: {
    pictures: [
      { name: 'りんご',   emoji: '🍎' },
      { name: 'いぬ',     emoji: '🐶' },
      { name: 'ほし',     emoji: '⭐' },
      { name: 'くるま',   emoji: '🚗' },
      { name: 'はな',     emoji: '🌸' },
      { name: 'ふね',     emoji: '⛵' },
      { name: 'ちょうちょ',emoji: '🦋' },
      { name: 'つき',     emoji: '🌙' },
      { name: 'きつね',   emoji: '🦊' },
      { name: 'すいか',   emoji: '🍉' },
      { name: 'ロケット', emoji: '🚀' },
      { name: 'ねこ',     emoji: '🐱' },
      { name: 'たいよう', emoji: '☀️' },
      { name: 'うさぎ',   emoji: '🐰' },
      { name: 'でんしゃ', emoji: '🚃' },
      { name: 'にじ',     emoji: '🌈' },
      { name: 'くま',     emoji: '🐻' },
      { name: 'みかん',   emoji: '🍊' },
      { name: 'ひこうき', emoji: '✈️' },
      { name: 'ぺんぎん', emoji: '🐧' }
    ],
    colors: [
      { name: 'あか',     color: '#e35b4a' },
      { name: 'あお',     color: '#4a9fe3' },
      { name: 'きいろ',   color: '#f5d98b' },
      { name: 'みどり',   color: '#5fc87f' },
      { name: 'しろ',     color: '#f0f0f0', border: true },
      { name: 'くろ',     color: '#333333' },
      { name: 'ピンク',   color: '#f6c8b0' },
      { name: 'むらさき', color: '#a78bca' },
      { name: 'だいだい', color: '#f5a55b' },
      { name: 'ちゃいろ', color: '#8b6a44' }
    ],
    symbols: [
      { name: 'まる',     emoji: '⭕' },
      { name: 'ばつ',     emoji: '❌' },
      { name: 'さんかく', emoji: '🔺' },
      { name: 'しかく',   emoji: '🟦' },
      { name: 'ほし',     emoji: '⭐' },
      { name: 'ハート',   emoji: '❤️' },
      { name: 'ひし',     emoji: '💠' },
      { name: 'まる（白）',emoji: '⚪' },
      { name: 'くろまる', emoji: '⚫' },
      { name: 'はな',     emoji: '✿' }
    ]
  },

  /* ---- セクションテキスト ---- */
  sections: {
    hero: {
      title: 'みぎのう あそび',
      subtitle: '0〜5さいの　きおく・ちょっかんトレーニング',
      brainDesc: '右脳は感性・イメージ・直感、左脳は言語・論理・計算をつかさどるとされています。両方をバランスよく育てることで、高い力を発揮できると考えられています。',
      criticalDesc: '右脳は生まれてすぐは活発に働いており、成長とともに左脳が優位になっていくとされています。右脳が活発な乳幼児期に楽しい刺激をたっぷり与えることが大切と考えられています。',
      flashDesc: '1枚1秒以下の高速提示で、瞬時に処理しようとする右脳が働き始めて活性化するとされています。',
      disclaimer: '※ここで紹介している効果は、右脳教育に関する教育理論の紹介であり、医学的・科学的に確立された効果を保証するものではありません。お子さまの様子を見ながら、楽しく取り組むことを第一にしてください。'
    },
    flashcard: {
      title: 'フラッシュカード',
      badge: 'おすすめ',
      emoji: '🐰',
      meaning: '絵や文字のカードを高速・大量に見せることで、瞬時に処理する右脳が働き始めて活性化するとされる、右脳トレーニングの基礎です。語彙力・理解力・表現力が育ち、見たものを一瞬で覚える「写真的記憶」、絵（映像＝右脳）と名称（言語＝左脳）を結ぶ連結回路を育てるとされます。',
      howTo: '1枚1秒以下のテンポでリズムよく見せましょう。子どもが楽しんでいる範囲で行い、嫌がったらすぐやめることが大切です。毎日少しずつ同じカードを繰り返すことで定着しやすくなります。カードの名称をはっきり発声しながら見せることで、音声と映像がセットになります。'
    },
    dots: {
      title: 'ドッツ',
      badge: 'おすすめ',
      emoji: '🔴',
      meaning: '赤い点（ドッツ）の数を高速で見せることで、誰もが持つとされる右脳の計算力・数量感覚を目覚めさせるトレーニングです。算数を教え込むのではなく、数を「量」として直感的にとらえる力を育てるとされます。',
      howTo: '点の配置を毎回ランダムにし、並びの暗記ではなく「量」を感じさせましょう。高速でテンポよく見せながら数字を声に出して添えます。少ない数から始め、年齢・慣れに応じて段階的に増やしていきましょう。'
    },
    recitation: {
      title: 'イメージ・あんしょう',
      badge: '',
      emoji: '🌈',
      meaning: '短い詩や言葉を繰り返し唱え、慣れたら倍速で言えるようにすることで記憶の質を高め、完全記憶を育てるとされます。また、ありありと想像するイメージ力を育て、学習やスポーツなど多場面で活用できるとされます。',
      howTo: '短い詩・童謡から始め、毎日繰り返しましょう。覚えたら2倍速・3倍速と速めて記憶の質を高めます。完璧を求めず、リズムや音の楽しさを大切にしてください。'
    },
    memorychip: {
      title: 'メモリーチップ',
      badge: 'あたらしい',
      emoji: '🧩',
      meaning: 'チップを使って記憶力・記憶法を楽しく育てるトレーニングです。複数のチップを順番に覚えて再現したり、神経衰弱形式でペアを探したり、仲間ごとに分けたりすることで、右脳の記憶力・ESP能力を育てるとされます。',
      howTo: 'リンク法ではチップを順番に示しながら情景的なお話を作りましょう。神経衰弱は枚数を少なくからスタートし、慣れたら増やします。仲間分けゲームはカテゴリを意識させながら楽しく行いましょう。'
    },
    miginoukun: {
      title: 'みぎのう君',
      badge: 'あたらしい',
      emoji: '🧠',
      meaning: '絵・色・記号のチップを使って、一度見たものを瞬時に再現する「完全記憶」を育てるトレーニングです。グリッドに並べたチップを覚えて再現するマス記憶や、カードをめくるポーカーゲームで楽しく記憶力を鍛えます。',
      howTo: 'マス記憶は最初は少ないチップ・短い時間から始め、できたら徐々に難しくしましょう。当てる楽しさ・できた喜びを大切にし、遊び感覚で取り組みます。色の記憶は色チップの並びを覚えて再現することで、視覚的な記憶力を育てます。'
    },
    game: {
      title: 'きおくゲーム',
      badge: 'じゅんびちゅう',
      emoji: '🎮',
      meaning: '複数のものを一定時間見て、その後に位置や内容を思い出すことで、短期間に大量に記憶し一度見たものを瞬時に再現する力を育てるとされます。',
      howTo: '少ない枚数・短い時間から始め、できたら徐々に難しくします。当てる楽しさ・できた喜びを大切にし、遊び感覚で行いましょう。'
    }
  }
};
