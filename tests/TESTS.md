<<<<<<< HEAD
# Vérifications de Frigo Express V0.3

```bash
node --check js/data.js
node --check js/app.js
node --check sw.js
node tests/test_logic.js
python tests/test_app.py
```

Les tests logiques couvrent notamment le catalogue de 303 recettes, 124 ingrédients, la saisie naturelle, les unités, les quantités des courses, l'import des anciens états, les modes 7/14/21 repas, les équipements, les restrictions, les DLC dépassées et les champs de dates.

**Limite de test :** le navigateur Chromium de l'environnement de construction bloque les navigations `file://` et `http://127.0.0.1`, empêchant le test graphique Playwright. Les essais réels sur Samsung et les impressions PDF doivent être validés après publication.
=======
# Tests — Frigo Express V0.2

## Vérifications logiques sans navigateur

- `node --check js/data.js`
- `node --check js/app.js`
- `node --check sw.js`
- `node tests/test_logic.js`

Couvert : catalogue 151 recettes/105 produits, texte naturel, unités g/kg/paquets/pièces, sauvegardes V0.1, arrondis, filtres de repas 7/14/21, matériels, génération de 49 composantes avec entrées et desserts, restrictions alimentaires, verrouillages, liste et structure de l’impression.

## Impression A4

Pour générer un exemple HTML de document imprimable, exécuter `FRIGO_PRINT_PREVIEW=1 node tests/test_logic.js` sous Linux/macOS ou `$env:FRIGO_PRINT_PREVIEW=1; node tests/test_logic.js` avec PowerShell. Le résultat `tests/print_preview.html` est ignoré par Git. Un rendu de cet exemple avec WeasyPrint a donné **une page A4** pour 21 repas/5 personnes ; il reste nécessaire de vérifier le résultat dans Chrome et sur l'imprimante réelle.

## E2E navigateur

`python tests/test_app.py` (nécessite Playwright, `playwright install chromium`). Un serveur HTTP localhost est démarré automatiquement. Le test vérifie aussi une navigation hors ligne après installation du service worker.

**Limitation de la session de construction :** Chromium retourne `net::ERR_BLOCKED_BY_ADMINISTRATOR` sur les adresses locales, y compris localhost. L'E2E visuel est donc fourni pour exécution extérieure mais n'est pas déclaré réussi ici.
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
