<<<<<<< HEAD
"""Construit un HTML autonome avec les visuels embarqués."""
from pathlib import Path
from urllib.parse import quote
import base64
=======
"""Assemble les livrables V0.2 : HTML autonome et archive du projet avec son dépôt Git local."""
from pathlib import Path
from urllib.parse import quote
import base64
import re
import zipfile

>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
root=Path(__file__).resolve().parent
h=(root/'index.html').read_text('utf-8')
css=(root/'css/style.css').read_text('utf-8')
data=(root/'js/data.js').read_text('utf-8')
js=(root/'js/app.js').read_text('utf-8')
icon=(root/'assets/icon.svg').read_text('utf-8')

h=h.replace('<link rel="icon" href="assets/icon.svg" type="image/svg+xml">',f'<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,{quote(icon)}">')
h=h.replace('  <link rel="manifest" href="manifest.webmanifest">\n','')
h=h.replace('  <link rel="stylesheet" href="css/style.css">',f'  <style>\n{css}\n  </style>')
h=h.replace('  <script src="js/data.js" defer></script>\n','').replace('  <script src="js/app.js" defer></script>\n','')
<<<<<<< HEAD
for path in (root/'assets/recipes').glob('*.webp'):
    data_url='data:image/webp;base64,'+base64.b64encode(path.read_bytes()).decode('ascii')
    js=js.replace('assets/recipes/'+path.name,data_url)
h=h.replace('</body>',f'<script>\n{data}\n</script>\n<script>\n{js}\n</script>\n</body>')
out=root.parent/'Frigo_Express_V0.3_Autonome.html'
out.write_text(h,'utf-8')
print(out,out.stat().st_size)
=======

# Le fichier autonome comprend aussi les images : aucun lien local manquant.
photos=list((root/'assets/recipes').glob('*.webp'))
photo_map={f.name:'data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode('ascii') for f in photos}
if photo_map:
    replacement='const PHOTO_DATA='+__import__('json').dumps(photo_map,ensure_ascii=False)+';\n  const photoOf=r=>PHOTOS[r.id]?PHOTO_DATA[PHOTOS[r.id]]:null;'
    js,n=re.subn(r'const photoOf=r=>PHOTOS\[r\.id\]\?`assets/recipes/\$\{PHOTOS\[r\.id\]\}`:null;',lambda m:replacement,js,count=1)
    if n!=1:raise RuntimeError('Impossible d’intégrer les images au fichier autonome')

h=h.replace('</body>',f'<script>\n{data}\n</script>\n<script>\n{js}\n</script>\n</body>')
out=root.parent/'Frigo_Express_V0.2_Autonome.html'
out.write_text(h,'utf-8')

zip_path=root.parent/'Frigo_Express_V0.2_Git.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for f in root.rglob('*'):
        if not f.is_file() or f.name=='.DS_Store':continue
        rel=f.relative_to(root)
        if '__pycache__' in rel.parts or 'print_preview.html' in rel.parts or (rel.parts[0]=='tests' and f.suffix=='.png'):continue
        z.write(f,arcname='frigo-express/'+rel.as_posix())
print(out, out.stat().st_size)
print(zip_path, zip_path.stat().st_size)
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
