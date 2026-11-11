# Frigo Express V0.3.1 — corriger le nouveau dépôt GitHub

Le dépôt GitHub a été recréé. Ne copie pas un ancien dossier `.git` dans ce nouveau dépôt : leurs historiques peuvent être différents et déclencher des conflits.

## Méthode recommandée (GitHub Desktop)

1. Sur le Samsung, ouvrir Frigo Express > Réglages > Exporter ma sauvegarde JSON. Garder ce fichier.
2. Sur PC, dans GitHub Desktop, cloner le nouveau `cjajlk/frigo-express` dans un dossier neuf (ou utiliser la copie locale déjà rattachée au nouveau dépôt, à condition qu'elle ne soit pas en conflit).
3. Décompresser **Frigo_Express_V0.3.1_Publication_GitHub.zip** et copier **le contenu** à la racine de ce dossier, en remplaçant les fichiers existants : `index.html`, `css/style.css`, `js/app.js`, `js/data.js`, `sw.js`, documentation et autres fichiers.
4. Vérifier l'absence de `<<<<<<< HEAD`, `=======` ou `>>>>>>>` dans les fichiers ; vérifier que `index.html` est bien à la racine.
5. Dans GitHub Desktop : **Commit to main** puis **Push origin** (jamais Push force). Aucun ancien dossier `.git` ne doit être copié.
6. Ouvrir `https://cjajlk.github.io/frigo-express/`. Si l'ancien écran persiste, fermer l'onglet, rouvrir le site et actualiser ; le cache hors ligne change de nom en V0.3.1.

## Contrôles après publication

- Rechercher **Blanquette de veau** depuis Recettes, même avec le frigo vide : la fiche doit apparaître.
- Chercher **Bœuf bourguignon**, **Hachis parmentier**, **Gâteau marbré**.
- Ouvrir les détails et vérifier les étapes numérotées, les quantités selon 5 personnes et le choix des unités.
- Générer 7 / 14 / 21 repas, vérifier la liste de courses et son PDF.
- Vérifier que le stock, les menus et les favoris du téléphone sont conservés.

## Important

Ne pas uploader un ZIP tel quel : décompresser l'archive puis transférer son contenu. Le ZIP « Projet_Git » conserve un historique ancien pour archive/développement, mais **n'est pas à remplacer dans le nouveau dépôt GitHub**.
