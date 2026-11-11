# Frigo Express — V0.4.0

Application de cuisine gratuite et locale, adaptée aux téléphones Android, tablettes et PC. Thème sombre anthracite, orange et vert.

## Nouvelles fonctions V0.4

- **379 recettes** (51 petits-déjeuners, 49 entrées, 194 plats, 85 desserts) et **158 produits** identifiés.
- **53 nouvelles fiches originales** : 16 desserts simples, 9 spécialités ou inspirations régionales françaises et 28 recettes inspirées de cuisines du monde.
- **Filtre « Cuisine et origine »** dans Recettes : Italie, Espagne, Maroc, Inde, Sénégal, Afrique de l’Ouest, Japon, Chine, Thaïlande, Mexique, Portugal, Liban, Maghreb, France et Cuisine du quotidien.
- **Filtre « Région française »** quand France est sélectionnée : Nord, Bretagne, Alsace, Provence, etc. Les recettes existantes qui peuvent être identifiées de manière raisonnable sont également classées.
- Les nouvelles recettes ont des **quantités pour deux personnes ajustables**, au moins cinq étapes, et peuvent intégrer le planning et la liste de courses.
- Tous les **326 identifiants précédents** sont conservés. Même clé locale `frigo-express-v01` pour les sauvegardes, favoris et menus.

## Ce qui existe toujours

- **Mon frigo** : saisie libre, reconnaissance locale des aliments, quantités en grammes, kilogrammes, litres, pièces et paquets, DLC/DDM facultatives, dictée vocale selon le navigateur.
- **Recettes** : mode avec mon frigo, catalogue complet et favoris ; recherche par nom ou ingrédient ; filtres par catégorie, temps, régimes indicatifs, origine et région ; détails et proportions ajustées.
- **Ma semaine** : préparation de 7/14/21 repas pour 1 à 12 personnes, options entrée/dessert, verrouillage et remplacement des repas, préférence anti-répétition.
- **Mes courses** : liste d’ingrédients manquants par rayon, ajout manuel, partage, impression PDF/papier avec message écologique.
- Fonctionnement sans serveur et hors ligne après installation/caching sur GitHub Pages.

## Installer ou tester

Pour publier, décompresser `Frigo_Express_V0.4_Publication_GitHub.zip` et **copier tout son contenu dans la racine de votre copie actuelle du dépôt**, en remplaçant les fichiers. **Ne jamais remplacer le dossier `.git` du dépôt local**. Utiliser GitHub Desktop pour committer puis pousser les modifications. GitHub Pages doit utiliser `main` et `/ (root)`.

Adresse prévue : https://cjajlk.github.io/frigo-express/

Pour tester sans déployer : ouvrir `Frigo_Express_V0.4_Autonome.html` sur un PC ou utiliser un serveur local comme VS Code Live Server pour servir `index.html`.

**Avant mise à jour :** dans l'application actuelle, exporter une sauvegarde JSON (Réglages → Exporter ma sauvegarde). La mise à jour du site ne doit pas effacer les données, mais une sauvegarde est une précaution recommandée.

## Sources culinaires et précautions

Les nouvelles fiches ont été rédigées pour Frigo Express à partir de techniques et de plats connus ; elles ne reproduisent pas des textes ou photos de sites tiers. Certaines recettes sont des **adaptations familiales**, pas des reproductions authentiques : leurs notes le précisent. Toutes les cuissons restent indicatives : vérifier les températures et la cuisson complète, ainsi que les allergies (arachides, noix, œufs, lactose, gluten, etc.). Les filtres végan / sans gluten sont indicatifs et ne garantissent pas une absence d'allergènes ou de contaminations.

**Photos** : 3 photographies existantes hors ligne. Les autres recettes utilisent des pictogrammes provisoires. Aucun site externe n'est nécessaire pour les voir.

## Développement et validation

- Catalogue : `js/data.js` (local, sans API).
- Interface : `index.html`, `css/style.css`, `js/app.js`.
- Web App : `manifest.webmanifest`, `sw.js`, `assets`.
- Tests logiques : `node tests/test_logic.js`.
- Tests mobiles navigateur : `python tests/test_app.py` avec `FRIGO_BASE=http://127.0.0.1:8765/index.html` (avec serveur lancé).
- Générateur HTML autonome : `python build_standalone.py`.

Les tests Node ont réussi. La politique du navigateur Chromium de l'environnement a empêché les essais graphiques automatisés, à confirmer sur Samsung. Aucun push distant n'a été réalisé.
