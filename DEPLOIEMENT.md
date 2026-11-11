# Publication Frigo Express V0.4 — dépôt GitHub déjà existant

1. Sur le téléphone : Réglages → **Exporter ma sauvegarde JSON**. Conserver le fichier.
2. Sur le PC : dans GitHub Desktop, ouvrir votre **dépôt local actuel** `cjajlk/frigo-express`. Vérifier que les changements précédents sont commités/synchronisés.
3. Décompresser **Frigo_Express_V0.4_Publication_GitHub.zip**.
4. **Copier l'ensemble des fichiers et dossiers contenus à la racine** (`index.html`, `js/`, `css/`, `assets/`, `sw.js`, etc.) dans le dépôt local existant. Remplacer les anciens fichiers. Ne **pas** copier le dossier `.git` d'un autre projet.
5. Vérifier les changements dans GitHub Desktop, créer un commit `Frigo Express V0.4 – recettes régionales et cuisines du monde`, puis `Push origin`.
6. Ouvrir **https://cjajlk.github.io/frigo-express/** et actualiser. Contrôler la nouvelle version après l'activation du service worker ; une ancienne page peut nécessiter une fermeture puis une réouverture de l'onglet.
7. Tester : Recettes → Tout découvrir → Espagne → « Paella familiale au poulet » ; France → Nord → « Flamiche aux poireaux du Nord » ; rechercher « Gâteau express à la vanille ». Générer une semaine et vérifier les courses.
8. Vérifier que le stock, les favoris et les menus déjà enregistrés n'ont pas disparu. Sinon, réimporter le JSON exporté.

**Attention** : l'archive `Projet_Git` sert de copie de travail et contient un **historique Git local distinct**. Pour mettre à jour votre dépôt existant, utilisez l'archive de **publication**. Éviter `git push --force`.

Aucune publication automatique depuis ChatGPT n'a été effectuée.
