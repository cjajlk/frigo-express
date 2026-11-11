# Historique des versions — Frigo Express

## V0.3.0 — 10 novembre 2026

- Catalogue : **303 recettes**, réparties en 51 petits-déjeuners, 47 entrées, 157 plats et 48 desserts. Les 144 identifiants initiaux sont conservés ; une recette existante (gratin dauphinois) a reçu des instructions plus détaillées.
- **124 produits** reconnus ; nouvelles familles (aubergine, lentilles corail, olives, lait de coco, etc.).
- Menus : préférence pour les aliments dont la date indiquée approche et historique des recettes proposées lors des régénérations sur les 14 derniers jours, pour limiter les répétitions.
- Stock : dates facultatives de consommation (DLC ou DDM), avertissements visuels ; les DLC dépassées sont exclues du calcul de disponibilité et des déductions de courses.
- Saisie : reconnaissance vocale facultative selon le navigateur, et propositions d'ingrédients pendant la frappe ; validation manuelle avant enregistrement.
- Recettes : affichage de la couverture approximative des quantités, nouveaux conseils de cuisson, recherche alimentaire par indicateurs végan / sans gluten à **vérifier**.
- Courses : partage natif par le téléphone lorsqu'il est disponible, sinon copie.
- Présentation : photo culinaire originale supplémentaire pour les spaghetti bolognaise (3 visuels locaux au total) ; autres recettes avec pictogrammes.
- Compatibilité : clé locale `frigo-express-v01` inchangée ; sauvegardes antérieures importables.
- PWA : nouvelle version de cache pour les fichiers hors ligne.

### Limites

Les 303 recettes et leurs temps sont indicatifs et ne remplacent pas une validation culinaire de chaque fiche. La reconnaissance vocale peut nécessiter Internet ; aucune synchronisation entre appareils n'est proposée. Les filtres alimentaires ne constituent pas des garanties d'absence d'allergènes. Les 300 visuels restants seront à créer progressivement. Les tests d'interface navigateur ont été empêchés par la politique d'administration de Chromium dans l'environnement de préparation.

## V0.2

Gestion des unités, équipements de cuisine, planning 7/14/21 repas, impression compacte, confirmation de suppression avec restauration, deux photos culinaires.
