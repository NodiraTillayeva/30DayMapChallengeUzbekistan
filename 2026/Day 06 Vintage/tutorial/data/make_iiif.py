"""Turn one scanned map (JPG) into static IIIF tiles + a manifest that Allmaps Editor can open.

How the 1913 Tashkent plan in this repository was made (needs Python 3 and Pillow: pip install pillow):

    python make_iiif.py tashkent1913.jpg iiif/tashkent-1913 \
        https://raw.githubusercontent.com/NodiraTillayeva/30DayMapChallengeUzbekistan/main/iiif/tashkent-1913

Arguments: the scan, an output folder, and the public web address where that folder will live.
Upload the folder to that address (for example by committing it to a public GitHub repository),
then paste <address>/manifest.json into Allmaps Editor.
Edit the label, summary and metadata below for your own map.
"""
import json, os, sys, math
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out, base = sys.argv[1], sys.argv[2], sys.argv[3].rstrip('/')
TILE = 512
im = Image.open(src).convert('RGB'); W, H = im.size
img_dir = os.path.join(out, 'image'); img_id = base + '/image'
sfs = []; sf = 1
while True:
    sfs.append(sf)
    if math.ceil(W / sf) <= TILE and math.ceil(H / sf) <= TILE: break
    sf *= 2
n = 0
for sf in sfs:
    step = TILE * sf
    for y in range(0, H, step):
        for x in range(0, W, step):
            w, h = min(step, W - x), min(step, H - y)
            tw, th = math.ceil(w / sf), math.ceil(h / sf)
            d = os.path.join(img_dir, f'{x},{y},{w},{h}', f'{tw},', '0'); os.makedirs(d, exist_ok=True)
            im.crop((x, y, x + w, y + h)).resize((tw, th), Image.LANCZOS).save(os.path.join(d, 'default.jpg'), quality=82)
            n += 1
sizes = []
for sf in reversed(sfs):
    tw, th = math.ceil(W / sf), math.ceil(H / sf)
    if tw <= 2048:
        d = os.path.join(img_dir, 'full', f'{tw},', '0'); os.makedirs(d, exist_ok=True)
        im.resize((tw, th), Image.LANCZOS).save(os.path.join(d, 'default.jpg'), quality=82)
        sizes.append({'width': tw, 'height': th})
info = {'@context': 'http://iiif.io/api/image/2/context.json', '@id': img_id, 'protocol': 'http://iiif.io/api/image',
        'width': W, 'height': H, 'profile': ['http://iiif.io/api/image/2/level0.json'],
        'tiles': [{'width': TILE, 'scaleFactors': sfs}], 'sizes': sizes}
json.dump(info, open(os.path.join(img_dir, 'info.json'), 'w'), indent=1)
lab = {'en': ['Plan of the City of Tashkent, 1 April 1913 (Vl. Pirogovsky)'], 'ru': ['План города Ташкента, составлен по 1 апреля 1913 года (изд. Вл. Пироговского)']}
man = {'@context': 'http://iiif.io/api/presentation/3/context.json', 'id': base + '/manifest.json', 'type': 'Manifest', 'label': lab,
  'summary': {'en': ['Russian-era city plan of Tashkent with the old town, the Russian new town and the electric tram lines. Public domain. Scan from Wikimedia Commons, re-hosted as static IIIF tiles for the 30 Day Map Challenge Uzbekistan Day 06 tutorial.']},
  'metadata': [{'label': {'en': ['Date']}, 'value': {'none': ['1913']}}, {'label': {'en': ['Publisher']}, 'value': {'none': ['Vl. Pirogovsky']}},
               {'label': {'en': ['Scale']}, 'value': {'en': ['100 sazhens to the inch (about 1:8,400)']}},
               {'label': {'en': ['Source']}, 'value': {'none': ['https://commons.wikimedia.org/wiki/File:Tashkent-1913-map.jpg']}}],
  'rights': 'http://creativecommons.org/publicdomain/mark/1.0/',
  'items': [{'id': base + '/canvas/1', 'type': 'Canvas', 'width': W, 'height': H, 'label': lab,
    'items': [{'id': base + '/canvas/1/page', 'type': 'AnnotationPage', 'items': [{'id': base + '/canvas/1/page/image', 'type': 'Annotation', 'motivation': 'painting',
      'target': base + '/canvas/1', 'body': {'id': img_id + f'/full/{sizes[-1]["width"]},/0/default.jpg', 'type': 'Image', 'format': 'image/jpeg', 'width': W, 'height': H,
        'service': [{'@id': img_id, '@type': 'ImageService2', 'profile': 'http://iiif.io/api/image/2/level0.json'}]}}]}]}]}
json.dump(man, open(os.path.join(out, 'manifest.json'), 'w'), indent=1, ensure_ascii=False)
print('tiles', n, 'scaleFactors', sfs, 'sizes', sizes)
