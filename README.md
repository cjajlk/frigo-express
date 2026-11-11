# Frigo Express — V0.3.1 (correctif et recettes classiques)

Application française, gratuite et sans compte, créée pour CJAJLK. Thème sombre anthracite, touches orange gourmandes et vert frais.

## Fonctionnalités comprises

- **Mon frigo** : saisie libre (« Il me reste 3 œufs, 2 tomates et du fromage »), reconnaissance de 127 familles de produits, quantités en g, kg, ml, cl, l, pièce et tranche ; modification ou suppression des quantités. Les produits incompris restent visibles, pour être corrigés.
- **Recettes** : 326 recettes locales (51 petits-déjeuners, 47 entrées, 160 plats et 68 desserts), quantités et étapes. Filtres de recherche, durée, végétarien, végan indicatif, sans gluten indicatif, sans porc et sans four. Favoris et affichage des ingrédients disponibles, manquants ou à vérifier.
- **Menus** : génération de 7 jours × 1, 2 ou 3 repas, pour 1 à 12 personnes. Historique des menus proposés sur 14 jours pour limiter les répétitions. Possibilité d'ajouter une entrée et un dessert au midi/soir, de verrouiller un repas et de le remplacer individuellement. Priorité au contenu du frigo ou à la variété ou à la rapidité.
- **Courses** : regroupement des ingrédients nécessaires pour les recettes planifiées et soustraction des quantités **connues** du frigo. Pour les quantités non renseignées, l'application avertit « à vérifier » plutôt que de considérer le produit entièrement disponible. Cases à cocher, ajouts manuels, copie, partage natif du téléphone et impression A4 de la liste / du menu / des deux.
- **Nouveautés V0.3** : dictée vocale facultative (si le navigateur la prend en charge, parfois via un service en ligne), suggestions de produits pendant la saisie, dates DLC/DDM facultatives sur les aliments, priorité aux dates proches, exclusion des DLC dépassées du stock pris en compte, recherche indicative végan / sans gluten, pourcentage de quantités couvertes et partage Android de la liste.
- **Confidentialité** : stockage local via localStorage. Export/import JSON de sauvegarde. Sans serveur, API, abonnement, collecte ni connexion obligatoire pour le fonctionnement des recettes.

## Comment essayer tout de suite

### Option la plus simple sur PC (Windows 11)

Télécharge `Frigo_Express_V0.3.1_Autonome.html` et ouvre le fichier dans Edge ou Chrome. La version autonome contient tous les scripts et styles. Elle fonctionne même sans connexion. Attention : la sauvegarde dans le navigateur peut varier selon l'ouverture des fichiers `file://` ; exporte-la régulièrement (roue dentée > Exporter ma sauvegarde).

### Dossier complet sur PC

Décompresse `Frigo_Express_V0.3.1_Projet_Git.zip`. Ouvre `index.html` ou, pour un fonctionnement plus fiable en test, utilise **VS Code Live Server** sur le dossier : clique droit sur `index.html` > **Open with Live Server**. Les liens et les scripts sont relatifs : pas de chemin spécifique au PC.

### Utilisation sur ton Samsung

Pour installer l'application comme site web sur l'écran d'accueil et bénéficier du cache hors ligne, il faut publier le **contenu du dossier racine** sur un site HTTPS (par exemple GitHub Pages), puis ouvrir ce lien une première fois avec connexion et choisir *Ajouter à l'écran d'accueil*. La version autonome HTML est également utilisable après transfert sur le téléphone, mais l'installation PWA et la persistance de stockage y sont moins fiables.

### Publication GitHub Pages

1. Utiliser le dépôt existant `cjajlk/frigo-express`.
2. Placer `index.html`, `.nojekyll`, `manifest.webmanifest`, `sw.js` et les sous-dossiers `assets`, `css`, `js` **à la racine du dépôt**.
3. Paramètres GitHub > Pages > Deploy from a branch > branche `main`, dossier `/ (root)`.
4. Une fois le HTTPS disponible, ouvrir la page. Le service worker met en cache les fichiers essentiels après l'installation.

**Aucun dépôt GitHub n'a été modifié ni publié dans cette livraison.**

## Utilisation recommandée

1. **Mon frigo** : saisir les ingrédients. Si tu connais la quantité, précise-la en grammes, millilitres, pièces ou tranches. Exemple : `3 œufs, 2 tomates, 500 g de pommes de terre, 2 tranches de jambon, 25 cl de lait`.
2. **Recettes** : choisir « Avec mon frigo » ou « Tout découvrir ». Ouvrir une fiche pour consulter les étapes, changer les portions, ajouter aux favoris ou affecter au planning.
3. **Ma semaine** : choisir le nombre de personnes et les préférences, puis *Générer ma semaine*. Les menus sont enregistrés. Tu peux verrouiller un repas (🔒) pour le conserver lors des prochaines générations.
4. **Mes courses** : retrouver les manquants par rayon. Cocher les articles achetés, ajouter des produits et imprimer la feuille A4.
5. **Réglages** : exporter les données régulièrement, notamment avant de changer de navigateur ou de téléphone.

## Points importants / limites de cette première version

- Les recettes V0.3 sont des fiches rédigées pour Frigo Express ; il n’y a **pas d’import automatisé ni de recopie massive de sites tiers**. Le catalogue de 326 fiches est un jalon vers un objectif plus large.
- Le moteur est **déterministe**, pas une IA générative. Il associe ingrédients et recettes de manière locale. Les formulations très libres ou des produits inconnus peuvent être mal compris : corriger la saisie si nécessaire.
- Les quantités des ingrédients sont des indications culinaires pour des portions standard ; ajuster à vos habitudes. Certaines préparations entières (tartes, quiches et gâteaux) peuvent fournir des restes.
- Pas de prix en euros, pas de comparaison entre magasins ni de mise à jour automatique du catalogue.
- Trois photos gourmandes locales (mousse au chocolat, gâteau au yaourt et spaghetti bolognaise) sont intégrées ; les autres recettes utilisent encore des pictogrammes en attendant davantage de photos.
- Pas de synchronisation automatique entre PC et Samsung, ni de suivi automatique de la consommation effective des produits du frigo. La sauvegarde/import JSON permet de transférer les données manuellement.
- La gestion fine des DLC/DDM et des allergies, les stocks complexes (paquets partiellement consommés et conversions de pièces en poids) et la gestion avancée des restes restent à approfondir.
- Les filtres végétarien / sans porc sont des filtres d'ingrédients principaux, pas des garanties d'absence de traces d'allergènes. Vérifier les emballages et les cuissons (notamment poulet, poisson, œufs crus et restes de riz).
- Impression : le bouton ouvre la fonction *Imprimer* du navigateur. Sur certains téléphones, choisir une imprimante ou « Enregistrer au format PDF ».

## Tests

- `node --check js/data.js`
- `node --check js/app.js`
- `node tests/test_logic.js`

Ces tests de logique couvrent la reconnaissance des ingrédients, les conversions, les recettes, le planning, les courses, les verrouillages et l'import. Le parcours mobile a été vérifié avec Playwright en chargeant directement le HTML dans Chromium (saisie, confirmation et restauration du stock, menus 7/14/21, images, réglages). La navigation vers des URL est bloquée dans l'environnement de test : les tests complets de déploiement GitHub Pages et les gestes réels sur Samsung restent **à valider physiquement**. Deux rendus PDF ont été contrôlés dans un moteur de mise en page : 21 repas sur 1 page, 49 recettes sur 2 pages. La pagination exacte peut varier selon l'imprimante.

## Structure

```
index.html
css/style.css
js/data.js       # 127 ingrédients, 326 recettes
js/app.js        # interfaces, logique, sauvegarde, impression
assets/icon.svg
assets/recipes/*.webp
manifest.webmanifest
sw.js
.nojekyll
tests/test_logic.js
tests/test_app.py
```

Version initiale : 9 novembre 2026. Licence : code personnel CJAJLK, à définir pour une diffusion ultérieure.

## V0.3 : améliorations

- Le stock conserve les quantités de base (grammes, millilitres, pièces, tranches), tout en permettant la sélection de kg/g, L/cl/ml et paquets avec contenance explicite. Les anciennes sauvegardes `frigo-express-v01` restent compatibles et ne sont pas effacées.
- Le menu peut couvrir 7, 14 ou 21 repas, avec affichage et liste de courses adaptés ; les repas non sélectionnés sont conservés en mémoire sans compter dans les courses.
- Le matériel de cuisine est configurable (four, plaques, micro-ondes, gaufrier, friteuse, raclette, crêpière). Quatre recettes supplémentaires ont été ajoutées.
- Le stock se vide après confirmation intégrée, et une restauration est disponible en bas d’écran tant que la page reste ouverte.
- L’impression A4 a été compactée ; l’option « Enregistrer en PDF » se choisit dans le dialogue d’impression Android ou du navigateur. La consultation mobile reste prioritaire.
- Les produits achetés à la pièce sont arrondis à l’entier supérieur dans les courses (les recettes conservent leurs quantités théoriques).
- Les photos culinaires ne sont pas encore générées pour la totalité du catalogue : le remplacement progressif doit intégrer des fichiers locaux optimisés.

**Publication :** ne pas déposer le dossier `.git` dans GitHub Pages. Déposer à la racine `index.html`, `css`, `js`, `assets`, `manifest.webmanifest`, `sw.js` et `.nojekyll` ; `index.html` doit être à la racine du dépôt.


## Migration de V0.2 vers V0.3

La clé de sauvegarde reste `frigo-express-v01`. Les 144 identifiants de recettes existants n'ont pas été renumérotés. Le nouveau format ajoute de manière facultative `expires` / `dateType` au stock et `history` à l'historique ; les anciennes sauvegardes restent lisibles. **Exporter une sauvegarde JSON avant toute mise à jour reste recommandé.**

Lors de la première visite après déploiement, une connexion est nécessaire pour récupérer les nouveaux fichiers, dont `sw.js`. Fermer puis rouvrir la page si le navigateur affiche encore V0.2.

### Dates et sécurité alimentaire

La date renseignée doit être celle du produit ; l'application n'en invente aucune. `DLC` et `DDM` ont des implications différentes : la DLC dépassée est exclue des quantités utilisables, tandis qu'une DDM dépassée signale un contrôle nécessaire. Ne pas considérer l'application comme garantie de salubrité. Les filtres « sans gluten » et « végan » reposent seulement sur les ingrédients répertoriés, pas sur des certifications ni sur les contaminations croisées.

### Limitations actuelles

- Les images culinaires locales sont intégrées sur **3 recettes** seulement ; les autres affichent des pictogrammes. L'enrichissement iconographique des 326 fiches reste à faire.
- La dictée vocale dépend du navigateur, peut nécessiter Internet et transmettre la voix au fournisseur de reconnaissance. Elle ne sauvegarde jamais directement le contenu dicté sans validation de l'utilisateur.
- L'historique des 14 jours concerne les **repas proposés lors des régénérations** et ne prétend pas savoir ce qui a été réellement cuisiné.
- Pas de synchronisation entre appareils, pas de prix inventés, pas de serveur ni de compte.
- La mise en page d'impression A4 reste celle de V0.2 et n'a pas été revérifiée sur imprimante physique pour cette version.

## Correctif V0.3.1 — 11 novembre 2026

- Suppression des marqueurs de conflit Git : aucun fichier livré ne contient `<<<<<<< HEAD`, `=======` ou `>>>>>>>` en début de ligne.
- **326 recettes / 127 produits** : blanquette de veau, bœuf bourguignon, bœuf-carottes et 20 desserts/gâteaux faciles supplémentaires.
- **Hachis Parmentier** : deux recettes déjà présentes ont reçu des explications détaillées, sans changement de leur identifiant pour conserver les favoris et les menus.
- **Recherche plus intuitive** : entrer le nom d'une recette parcourt tout le catalogue, même depuis l'onglet « Avec mon frigo » ; une abréviation comme « hachi parmentier » est acceptée.
- Cache hors ligne renouvelé pour accélérer la prise en compte de la mise à jour.
- **Dépôt recréé :** sur le nouveau dépôt GitHub, **ne remplace jamais le dossier `.git`** avec celui d'une ancienne archive. Pour publier, utiliser l'archive `Frigo_Express_V0.3.1_Publication_GitHub.zip`, en remplaçant les fichiers du dépôt existant via GitHub Desktop ou l'interface GitHub. Ce ZIP ne contient aucun `.git`.
- **Sauvegarde :** même clé de stockage local `frigo-express-v01` et mêmes IDs des 303 recettes initiales. Par précaution, exporter une sauvegarde JSON avant publication.
