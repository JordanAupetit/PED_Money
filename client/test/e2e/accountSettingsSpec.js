
describe('tests PED MONEY => account settings', function() {


    beforeEach(function() {
        //browser.get('http://localhost:8754/#/');

        /*
            INITIALISATION

            L'utilisateur doit avoir un compte et se connecter.
            Il doit ensuite avoir un compte et le sélectionner.
            Il doit se positionner sur la page des opérations
            Et cliquer sur le lien settings de l'account
        */
    });

    it('doit pouvoir editer le compte', function() {
        /*
            L'utilisateur doit changer les champs au niveau de l'édition
            Il peut choisir un nouveau nom, un nouveau type et une nouvelle currency
            Il clique ensuite sur le bouton save
            En revenant à la page du compte, le nom et les autres infos changées doivent etre prise
            en compte
        */
    });

    it('doit pouvoir re aligner la balance de son compte', function(){
        /*
            L'utilisateur doit pouvoir taper un nouveau solde du compte
            Il clique ensuite sur save
            En revenant sur la page d'accueil du compte, il doit s'assurer que
            le compte a bien la balance choisit et qu'une opération de rééquilibrage a été
            ajouté
        */
    })

    it('doit pouvoir ajouter une alerte à son compte', function(){
        /*
            L'utilisateur ajoute un nouveau level et un message associé dans la dernire ligne du tableau
            En cliquant sur le bouton ajouter, une nouvelle ligne s'ajoute au tableau
        */
    })

    it('doit pouvoir supprimer une alerte à son compte', function(){
        /*
            L'utilisateur clique sur le lien supprimer d'une alerte
            La ligne doit disparaitre du tableau
        */
    })

    it('doit recevoir des message d alerte', function(){
        /*
            L'utilisateur créer une alerte avec un montant inferieur avec son
            solde actuel
            L'utilisateur doit recevoir un mail d'alerte dans les 24h qui suivent
            (( Je ne pense pas que ce test soit réalisable ))
        */
    })

    it('doit pouvoir supprimer un compte', function(){
        /*
            En cliquant sur le bouton delete en bas de la page et en validant la boite
            de dialogue, l'utilisateur doit retourner à la page des accoutS et ne plus voir
            celui qu'il a supprimer dans la liste
        */
    })
});