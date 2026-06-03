"""
sync_images.py — images/cards/ をスキャンして tools/cards.csv と js/data.js を更新する。
何度でも実行可能（冪等）。
"""

import csv
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
CARDS_CSV = Path(__file__).parent / 'cards.csv'
DATA_JS = ROOT / 'js' / 'data.js'
IMAGES_DIR = ROOT / 'images' / 'cards'

VALID_CATEGORIES = {'animals', 'foods', 'vehicles', 'nature', 'shapes', 'hiragana'}
SUPPORTED_EXTS = {'.png', '.jpg', '.jpeg', '.webp'}


def load_csv():
    if not CARDS_CSV.exists():
        print(f'エラー: {CARDS_CSV} が見つかりません。先に export_cards.py を実行してください。')
        raise SystemExit(1)
    with CARDS_CSV.open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def save_csv(rows):
    fieldnames = ['category_id', 'name', 'emoji', 'slug', 'image_url', 'status']
    with CARDS_CSV.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def find_image(category_id, slug):
    """slug に対応する画像ファイルを探す（拡張子不問）。"""
    if not slug:
        return None
    base = IMAGES_DIR / category_id / slug
    for ext in SUPPORTED_EXTS:
        p = base.with_suffix(ext)
        if p.exists():
            return p
    return None


def relative_url(image_path):
    """リポジトリルートからの相対パス（Webで使えるスラッシュ区切り）を返す。"""
    return image_path.relative_to(ROOT).as_posix()


def update_data_js(updates, removals):
    """
    updates:  dict { (category_id, name): image_url } — imageUrl を追加・更新
    removals: set  { (category_id, name) }            — imageUrl を削除
    js/data.js を行単位で書き換える。
    """
    lines = DATA_JS.read_text(encoding='utf-8').splitlines(keepends=True)
    new_lines = []
    current_category = None

    for line in lines:
        # カテゴリID追跡
        m = re.search(r"id:\s*'(\w+)'", line)
        if m:
            cid = m.group(1)
            current_category = cid if cid in VALID_CATEGORIES else None

        # カード行の検出
        if current_category:
            m = re.search(r"name:\s*'([^']+)'", line)
            if m:
                name = m.group(1)
                key = (current_category, name)
                stripped = line.rstrip('\n').rstrip()

                if key in updates:
                    image_url = updates[key]
                    if 'imageUrl' in stripped:
                        stripped = re.sub(
                            r",\s*imageUrl:\s*'[^']*'",
                            f", imageUrl: '{image_url}'",
                            stripped
                        )
                    else:
                        if stripped.endswith('}'):
                            stripped = stripped[:-1].rstrip() + f", imageUrl: '{image_url}'" + ' }'
                        elif stripped.endswith('},'):
                            stripped = stripped[:-2].rstrip() + f", imageUrl: '{image_url}'" + ' },'
                    line = stripped + '\n'

                elif key in removals and 'imageUrl' in stripped:
                    stripped = re.sub(r",\s*imageUrl:\s*'[^']*'", '', stripped)
                    line = stripped + '\n'

        new_lines.append(line)

    return ''.join(new_lines)


def main():
    rows = load_csv()

    # 画像ファイルの存在チェック → CSV の image_url / status を更新
    updates  = {}  # { (category_id, name): image_url } — 追加・更新
    removals = set()  # { (category_id, name) } — imageUrl 削除対象
    newly_found = 0
    skip_count = 0

    for row in rows:
        if row['status'] == 'skip':
            skip_count += 1
            continue

        img = find_image(row['category_id'], row['slug'])
        if img:
            url = relative_url(img)
            if row['image_url'] != url or row['status'] != 'done':
                row['image_url'] = url
                row['status'] = 'done'
                newly_found += 1
            updates[(row['category_id'], row['name'])] = url
        else:
            # ファイルが消えた場合はリセット
            if row['status'] == 'done':
                removals.add((row['category_id'], row['name']))
                row['image_url'] = ''
                row['status'] = 'pending'

    # data.js を更新
    if updates or removals:
        backup = DATA_JS.with_suffix('.js.bak')
        shutil.copy2(DATA_JS, backup)
        new_content = update_data_js(updates, removals)
        DATA_JS.write_text(new_content, encoding='utf-8')

    # CSV を保存
    save_csv(rows)

    # サマリー表示
    done = sum(1 for r in rows if r['status'] == 'done')
    pending = sum(1 for r in rows if r['status'] == 'pending')
    total = len(rows)

    print(f'同期完了')
    print(f'  完了  : {done} / {total} 枚')
    print(f'  未完了: {pending} 枚')
    print(f'  スキップ: {skip_count} 枚')
    if newly_found:
        print(f'  今回新たにリンク: {newly_found} 枚')
    if updates:
        print(f'  バックアップ: {DATA_JS.with_suffix(".js.bak").name}')
    print()

    if pending > 0:
        print('未完了のカード（最大10件）:')
        shown = 0
        for r in rows:
            if r['status'] == 'pending':
                slug_hint = r['slug'] or '（slug未設定）'
                print(f'  [{r["category_id"]}] {r["name"]} → images/cards/{r["category_id"]}/{slug_hint}.png')
                shown += 1
                if shown >= 10:
                    remaining = pending - 10
                    if remaining > 0:
                        print(f'  ... 他 {remaining} 件')
                    break


if __name__ == '__main__':
    main()
