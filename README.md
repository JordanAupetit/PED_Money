# PED_Money [![Build Status](https://travis-ci.org/JordanAupetit/PED_Money.svg?branch=master)](https://travis-ci.org/JordanAupetit/PED_Money) [![Build Status](https://david-dm.org/JordanAupetit/PED_Money.svg)](https://david-dm.org/JordanAupetit/PED_Money)

PED_Money est un clone de MS Money qui permet à un particulier de gérer ses comptes bancaires.


##Fonctionnalités :
 - Ajouter un compte
 - Gérer un compte (ajouter opération au débit ou au crédit)
 - Rapporter un compte (c’est-à-dire de l’aligner avec un relevé bancaire)
 - Générer des états (graphiques et statistiques) sur les comptes



##Installation :

> npm install


##Lancement :

####windows
> npm run startallw
ou 
> npm run start:all:w

####linux/mac
> npm run startalll
ou 
> npm run start:all:l

##Tests

Tous
> npm test

Client
> npm run test:client

Serveur
> npm run test:server

Serveur (en les relancant à chaque modification)
> npm run test:server:watch

##Autre commandes

Lancer seulement la bdd
> npm run db 

Lancer seulement le serveur
> npm run start 

Vérifier le code JS client
> npm run jshint 

Vérifier le code JS server
> npm run jshints 

Lancer le watcher des tests
> npm run karma 

NB: Pour utiliser karma il est recomandé d'installer karma-cli
> npm install -g karma-cli

##Contribution

You can only make pull request only if you agree to give all your right to the originals authors.


License
-------

    Copyright 2015 Jordan Aupetit, Abdessamad Essaydi,
    Etienne Grandier-Vazeille, Dimitri Ranc, Youssef Sahri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


---
