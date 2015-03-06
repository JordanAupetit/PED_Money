
describe('tests PED MONEY => categorie', function() {


    beforeEach(function() {
        //browser.get('http://localhost:8754/#/');

        /*
            INITIALISATION

            L'utilisateur doit avoir un compte et se connecter.
            Il doit ensuite avoir un compte et le sélectionner.
            Il doit se positionner sur la page des opérations
            Et cliquer sur le bouton pour faire apparaitre le formulaire
            d'ajout d'operation
        */
    });

    it('doit creer une categorie de niveau 1', function() {
        /*
            L'utilisateur doit cliquer dans le champs entrer un nom
            Taper le nom qu'il souhaite
            Cliquer sur Create
            Une nouvelle categorie doit apparaitre à droite
        */
    });

    it('doit creer une categorie de niveau 2 (sous categorie)', function() {
        /*
            Il faut qu'une catégorie soit préalablement créée.
            L'utilisateur doit cliquer dans le champs entrer un nom
            Taper le nom qu'il souhaite
            Il doit cocher le case "nest categorie under" puis dans la liste en dessous
            choisir la categorie qu'il souhaite
            Cliquer sur Create
            Une nouvelle categorie doit apparaitre à droite sous celle choisie avant
        */
    });

    it('doit supprimer une categorie', function() {
        /*
            Il faut qu'une catégorie soit préalablement créée.
            L'utilisateur positionne son curseur au dessus de la catégorie afin de faire apparaitre
            les actions possible sur celle-ci.
            L'utilisateur clique sur le bouton "poubelle"
            La catégorie doit avoir disparu de la liste
        */
    });

    it('doit sauvegarder les modifications', function() {
        /*
            Il faut ajouter une nouvelle categorie comme précédement
            Cliquer sur le bouton "Save changes"
            Attendre que la boite de dialogue se ferme
            Vérifier que dans la liste, des catégories, la nouvelle est bien présente
        */
    })
});