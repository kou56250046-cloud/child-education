"""
export_cards.py — js/data.js の全フラッシュカードを tools/cards.csv に出力する。
初回のみ実行。以降は cards.csv を直接編集して管理する。
"""

import csv
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA_JS = ROOT / 'js' / 'data.js'
OUT_CSV = Path(__file__).parent / 'cards.csv'

VALID_CATEGORIES = {'animals', 'foods', 'vehicles', 'nature', 'shapes', 'hiragana'}

# 日本語名 → 英字スラグ（ファイル名）のマッピング
SLUG_MAP = {
    # どうぶつ
    'うさぎ': 'usagi', 'いぬ': 'inu', 'ねこ': 'neko', 'ぞう': 'zou',
    'きりん': 'kirin', 'らいおん': 'raion', 'ぱんだ': 'panda', 'さる': 'saru',
    'くま': 'kuma', 'ぶた': 'buta', 'ひつじ': 'hitsuji', 'うし': 'ushi',
    'にわとり': 'niwatori', 'かめ': 'kame', 'いるか': 'iruka', 'たか': 'taka',
    'きつね': 'kitsune', 'おおかみ': 'ookami', 'りす': 'risu', 'ぺんぎん': 'pengin',
    # くだもの・やさい
    'りんご': 'ringo', 'ばなな': 'banana', 'いちご': 'ichigo', 'みかん': 'mikan',
    'ぶどう': 'budou', 'すいか': 'suika', 'もも': 'momo', 'さくらんぼ': 'sakuranbo',
    'なし': 'nashi', 'めろん': 'melon', 'にんじん': 'ninjin', 'とまと': 'tomato',
    'きゅうり': 'kyuuri', 'とうもろこし': 'toumorokoshi', 'ほうれんそう': 'hourensou',
    # のりもの
    'でんしゃ': 'densha', 'バス': 'basu', 'タクシー': 'takushii', 'ひこうき': 'hikouki',
    'ふね': 'fune', 'じてんしゃ': 'jitensha', 'オートバイ': 'ootobai',
    'しょうぼうしゃ': 'shoubousha', 'きゅうきゅうしゃ': 'kyuukyuusha',
    'パトカー': 'patokaa', 'トラック': 'torakku', 'ロケット': 'roketto',
    'ヘリコプター': 'herikoputaa', 'しんかんせん': 'shinkansen', 'ヨット': 'yotto',
    # しぜん
    'たいよう': 'taiyou', 'つき': 'tsuki', 'ほし': 'hoshi', 'くも': 'kumo',
    'あめ': 'ame', 'ゆき': 'yuki', 'かわ': 'kawa', 'うみ': 'umi',
    'やま': 'yama', 'はな': 'hana', 'き': 'ki', 'にじ': 'niji',
    # いろ・かたち
    'あか': 'aka', 'あお': 'ao', 'きいろ': 'kiiro', 'みどり': 'midori',
    'しろ': 'shiro', 'くろ': 'kuro', 'まる': 'maru', 'さんかく': 'sankaku',
    'しかく': 'shikaku', 'ハート': 'haato', 'ひし': 'hishi',
    # ひらがな（文字そのものが name）
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
}

# ひらがなカテゴリのみ「き」が 'ki' に重複するため上書き
SLUG_MAP_HIRAGANA_OVERRIDES = {
    'き': 'ki',   # ひらがなカテゴリの「き」
}


def parse_cards():
    text = DATA_JS.read_text(encoding='utf-8')
    lines = text.splitlines()

    current_category = None
    cards = []

    for line in lines:
        # カテゴリIDの検出（flashcardsセクション内のみ対象）
        m = re.search(r"id:\s*'(\w+)'", line)
        if m:
            cid = m.group(1)
            current_category = cid if cid in VALID_CATEGORIES else None

        if current_category is None:
            continue

        # カードエントリの検出
        m = re.search(r"name:\s*'([^']+)',\s*emoji:\s*'([^']*)'", line)
        if m:
            name = m.group(1)
            emoji = m.group(2)

            # スラグ決定
            if current_category == 'hiragana' and name in SLUG_MAP_HIRAGANA_OVERRIDES:
                slug = SLUG_MAP_HIRAGANA_OVERRIDES[name]
            else:
                slug = SLUG_MAP.get(name, '')

            cards.append({
                'category_id': current_category,
                'name': name,
                'emoji': emoji,
                'slug': slug,
                'image_url': '',
                'status': 'pending',
            })

    return cards


def main():
    if OUT_CSV.exists():
        print(f'警告: {OUT_CSV} は既に存在します。上書きしますか？ [y/N]: ', end='')
        ans = input().strip().lower()
        if ans != 'y':
            print('キャンセルしました。')
            return

    cards = parse_cards()
    print(f'{len(cards)} 件のカードを検出しました。')

    with OUT_CSV.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['category_id', 'name', 'emoji', 'slug', 'image_url', 'status'])
        writer.writeheader()
        writer.writerows(cards)

    print(f'出力完了: {OUT_CSV}')
    print()
    print('次のステップ:')
    print('  1. tools/cards.csv を Excel で開く')
    print('  2. slug 列を確認・修正（英字ファイル名）')
    print('  3. nanobanana で画像を生成し images/cards/{category_id}/{slug}.png に保存')
    print('  4. python tools/sync_images.py を実行')


if __name__ == '__main__':
    main()
