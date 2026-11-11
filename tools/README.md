# Référence du catalogue V0.3

`recettes_v03_source.txt` conserve les **160 lignes de travail** du lot V0.3 : une fiche d'origine V0.2 a été enrichie, les 159 autres lignes correspondent à de nouvelles recettes (les nombres finaux du catalogue sont ceux de `js/data.js`).

Les quantités sont indiquées pour **deux personnes**. Les champs sont séparés par `|` : catégorie, titre, durée en minutes, matériel, ingrédients `id:quantité`, étapes séparées par ` / `, pictogramme.

Le fichier utilisé par l'application est `js/data.js`. Ce texte est une source de maintenance à conserver : la modification du fichier texte **ne met pas automatiquement à jour** l'application. Pour ajouter une recette, compléter aussi `js/data.js` en utilisant `add(...)` et valider avec `node tests/test_logic.js`. Les identifiants existants ne doivent pas être renumérotés.
