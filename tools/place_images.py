"""
place_images.py — images/*.png を cards.csv のスラグ情報を使って
                  images/cards/{category_id}/{slug}.png に配置する。
"""

import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
CARDS_CSV = Path(__file__).parent / 'cards.csv'
SRC_DIR = ROOT / 'images'
DST_DIR = ROOT / 'images' / 'cards'


def katakana_to_hiragana(text):
    return ''.join(chr(ord(c) - 0x60) if 'ァ' <= c <= 'ン' else c for c in text)


def hiragana_to_katakana(text):
    return ''.join(chr(ord(c) + 0x60) if 'ぁ' <= c <= 'ん' else c for c in text)


def load_mapping():
    """name → (category_id, slug) のマッピングを作成（正規化済みも含む）。"""
    mapping = {}
    with CARDS_CSV.open(encoding='utf-8-sig', newline='') as f:
        for row in csv.DictReader(f):
            name = row['name']
            val = (row['category_id'], row['slug'])
            mapping[name] = val
            mapping[katakana_to_hiragana(name)] = val
            mapping[hiragana_to_katakana(name)] = val
    return mapping


def main():
    mapping = load_mapping()
    src_pngs = sorted(SRC_DIR.glob('*.png'))

    placed = 0
    skipped = 0

    for src in src_pngs:
        name = src.stem
        if name not in mapping:
            print(f'スキップ（対応なし）: {src.name}')
            skipped += 1
            continue

        category_id, slug = mapping[name]
        dst_folder = DST_DIR / category_id
        dst_folder.mkdir(parents=True, exist_ok=True)
        dst = dst_folder / f'{slug}.png'
        shutil.copy2(src, dst)
        print(f'配置: {src.name} → images/cards/{category_id}/{slug}.png')
        placed += 1

    print(f'\n完了: {placed}枚配置, {skipped}枚スキップ')


if __name__ == '__main__':
    main()
