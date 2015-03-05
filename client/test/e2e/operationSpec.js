
describe('tests PED MONEY => operation', function() {


    beforeEach(function() {
        //browser.get('http://localhost:8754/#/');

        /*
            INITIALISATION

            L'utilisateur doit avoir un compte et se connecter.
            Il doit ensuite avoir un compte et le sélectionner.
            Il doit se positionner sur la page des opérations

        */
    });

    it('doit creer une operation simple', function() {
        /*
            L'utilisateur doit cliquer sur le "cercle rouge" en bas à droite de l'écran afin de 
            faire apparaitre le formulaire d'ajout d'opération.
            L'utilisateur doit remplir un montant dans le champ associé.
            L'utilisateur clique sur "Add" et constate l'ajout de son opération dans la liste.
        */
    });

    it('doit creer une operation avancee avec une catégorie', function() {
        /*
            L'utilisateur doit cliquer sur le "cercle rouge" en bas à droite de l'écran afin de 
            faire apparaitre le formulaire d'ajout d'opération.
            L'utilisateur doit remplir un montant dans le champ associé.
            L'utilisateur clique sur le bouton des catégories à côté du champ associé, une fenêtre s'ouvre.
            Il saisit le nom de la catégorie qu'il désire et valide.
            Il selectionne la catégorie qu'il vient de créer dans la champ associé.
            L'utilisateur clique sur "Advanced" pour faire apparaitre tous les champs supplémentaires.
            L'utilisateur saisit les informations restantes de l'opération.
            L'utilisateur clique sur "Add" et constate l'ajout de son opération dans la liste.
        */
    });

    
    it('doit creer une operation periodique', function() {
        /*
            L'utilisateur doit cliquer sur le "cercle rouge" en bas à droite de l'écran afin de 
            faire apparaitre le formulaire d'ajout d'opération.
            L'utilisateur doit remplir un montant dans le champ associé.
            L'utilisateur clique sur "Advanced" pour faire apparaitre tous les champs supplémentaires.
            L'utilisateur saisit les informations restantes de l'opération.
            L'utilisateur clique sur "Periodic" pour faire apparaitre les champs supplémentaires.
            L'utilisateur saisit les informations relatives à l'opération périodique.
            L'utilisateur clique sur "Add" et constate l'ajout de son opération dans la liste des opérations périodiques.
        */
    });


    it('doit supprimer une opération', function() {
        /*
            Il faut qu'une opération soit préalablement créée.
            L'utilisateur positionne son curseur au dessus de l'opération afin de faire apparaitre
            les actions possible sur celle-ci.
            L'utilisateur clique sur le bouton rouge avec une croix et constate la suppression de l'opération.
        */
    });


    it('doit mettre à jour les informations d\'une operation', function() {
        /*
            Il faut qu'une opération soit préalablement créée.
            L'utilisateur positionne son curseur au dessus de l'opération afin de faire apparaitre
            les actions possible sur celle-ci.
            L'utilisateur clique sur le bouton "Edit", des champs apparaissent afin de pouvoir modifier 
            toutes les informations de l'opération.
            L'utilisateur modifie les informations voulues.
            L'utilisateur clique sur le bouton "Save" et constate que ses modifications ont bien 
            été prises en compte.
        */
    });

    it('doit regrouper les operations puis afficher les operations des groupes', function() {
        /*
            Il faut que plusieurs opérations soient préalablement créée.
            L'utilisateur clique sur le menu déroulant "select", au dessus de la liste des opérations 
            et il sélectionne "Grouped by Date".
            Il constate alors, si des opérations avaient la meme date, quelles ont été regroupées par
            date.
            L'utilisateur clique sur l'un des groupes afin d'afficher la liste des opérations le 
            composant.
            L'utilisateur clique à nouveau sur le menu déroulant pour sélectionne "Not grouped".
            Il peut alors constater que la liste des opérations est affiché comme auparavant.
        */
    });

    it('doit regrouper les operations puis doit supprimer une des operations des groupes', function() {
        /*
            Il faut que plusieurs opérations soient préalablement créée.
            L'utilisateur clique sur le menu déroulant "select", au dessus de la liste des opérations 
            et il sélectionne "Grouped by Date".
            Il constate alors, si des opérations avaient la meme date, quelles ont été regroupées par
            date.
            L'utilisateur clique sur l'un des groupes afin d'afficher la liste des opérations le 
            composant.
            L'utilisateur positionne son curseur au dessus de l'une des opérations du groupe 
            afin de faire apparaitre les actions possible sur celle-ci.
            L'utilisateur clique alors sur le bouton de suppression de l'opération.
            Il constate alors, si le groupe contenait plusieurs opérations, que sa valeur a été
            mise à jour.
        */
    });
});