module.exports = {
    getDB : function(){
        return db
    },
    getAccountModel: function(){
        return accountModel
    },
    getOperationModel: function(){
        return operationModel
    },
    getCategoryModel: function(){
        return categoryModel
    },
    getPeriodModel: function(){
        return periodModel
    },
    getUserModel: function(){
	 	return userModel
	}
}

var mongoose = require('mongoose')

var local_url = 'mongodb://localhost/mymoney'
var url_db = local_url

if(process.env.MONGO_URL !== undefined) {
    url_db = process.env.MONGO_URL
} else if(process.env.SCALINGO_MONGO_URL !== undefined) {
    url_db = process.env.SCALINGO_MONGO_URL
}

mongoose.connect(url_db);


var db = mongoose.connection;

//Schemas
var Schema = mongoose.Schema;

/*
    habitation
    travaux/brcolage
    elec/gaz eau
    import foncier
    impot habitation
    habitation secondaire
    loyer
    jardin
    assurance logement
    ménages/repassage
    ameublement/équipemment




    loisirs
    multimédio
    vacances
    animaux
    sport
    sorties
    cadeaux
    évements 
    jeux
    hôtels
    livres





    communication
    telephone
    internet/tv


    alimentation
    restaurant 
    cantine


    finances
    impot revenue
    épargne
    prets
    agios
    frais banquares
    assurance vie
    bourse
    retrait d'argent
    prêt relais


    santé/bien être
    soin du corps
    services à la personne
    mutuelle de santé
    pharmacie
    assurance santé
    aides à domicile
    coiffeur



    transport
    auto
    moto
    péage
    essence
    location véhicule
    assurance auto
    assurance moto
    parking


    habillement
    chaussures
    accessoires

    autres
    frais pro
    enfants
    assurance : autre
    amendes
    frais de justice
    frais de scolarité
    garde d'enfant
    dons
    impot : autre


    INCOME

    salaires 
    remboursement social
    rem pro
    autre
    revenu fonctier
    allocation
    sécurité social
    rente et pension
    dividendes et plus value
    cadeaux

*/

var defaultCategories = [
    {
        name: 'Home',
        id: 100,
        subCategories:[
            {
                name: 'Handiwork/DIY',
                id: 101
            },
            {
                name: 'Electricity / gas / water',
                id: 102
            },
            {
                name: 'Property tax',
                id: 103
            },
            {
                name: 'Residential tax',
                id: 104
            },
            {
                name: 'Secondary dwelling',
                id: 105
            },
            {
                name: 'Rent',
                id: 106
            },
            {
                name: 'Garden',
                id: 107
            },
            {
                name: 'Home insurance',
                id: 108
            },
            {
                name: 'Household / Ironing',
                id: 109
            },
            {
                name: 'Furniture / equipment',
                id: 110
            }
        ]
    },
    {
        name: 'Recreation',
        id: 200,
        subCategories:[
            {
                name: 'Multimedia',
                id: 201
            },
            {
                name: 'Holidays',
                id: 202
            },
            {
                name: 'Pets',
                id: 203
            },
            {
                name: 'Sport',
                id: 204
            },
            {
                name: 'Trip',
                id: 205
            },
            {
                name: 'Gifts',
                id: 206
            },
            {
                name: 'Events',
                id: 207
            },
            {
                name: 'Games',
                id: 208
            },
            {
                name: 'Hotels',
                id: 209
            },
            {
                name: 'Books',
                id: 210
            }
        ]
    },
    {
        name: 'Communication',
        id: 300,
        subCategories:[
            {
                name: 'Phone',
                id: 301
            },
            {
                name: 'Internet / tv',
                id: 302
            }
        ]
    },
    {
        name: 'Supply',
        id: 400,
        subCategories:[
            {
                name: 'Restaurant',
                id: 401
            },
            {
                name: 'Canteen',
                id: 402
            }
        ]
    },
    {
        name: 'Finances',
        id: 500,
        subCategories:[
            {
                name: 'Tax revenue',
                id: 501
            },
            {
                name: 'Saving',
                id: 502
            },
            {
                name: 'Loans',
                id: 503
            },
            {
                name: 'Agios',
                id: 504
            },
            {
                name: 'Bank charges',
                id: 505
            },
            {
                name: 'Life insurance',
                id: 506
            },
            {
                name: 'Stock market',
                id: 507
            },
            {
                name: 'Cash',
                id: 508
            },
            {
                name: 'Bridge loan',
                id: 509
            }
        ]
    },
    {
        name: 'Health / Wellness',
        id: 600,
        subCategories:[
            {
                name: 'Body care',
                id: 601
            },
            {
                name: 'Human Services',
                id: 602
            },
            {
                name: 'Mutual health',
                id: 603
            },
            {
                name: 'Pharmacy',
                id: 604
            },
            {
                name: 'Health insurance',
                id: 605
            },
            {
                name: 'Assistance at home',
                id: 606
            },
            {
                name: 'Hairdresser',
                id: 607
            }
        ]
    },
    {
        name: 'Transport',
        id: 700,
        subCategories:[
            {
                name: 'Car',
                id: 701
            },
            {
                name: 'Motorcycle',
                id: 702
            },
            {
                name: 'Toll',
                id: 703
            },
            {
                name: 'Gasoline',
                id: 704
            },
            {
                name: 'Car rental',
                id: 705
            },
            {
                name: 'Car Insurance',
                id: 706
            },
            {
                name: 'Motorcycle Insurance',
                id: 707
            },
            {
                name: 'Parking',
                id: 708
            }
        ]
    },
    {
        name: 'Clothing',
        id: 800,
        subCategories:[
            {
                name: 'Shoes',
                id: 801
            },
            {
                name: 'Accessories',
                id: 802
            }
        ]
    },
    {
        name: 'Other',
        id: 900,
        subCategories:[
            {
                name: 'Professional fees',
                id: 901
            },
            {
                name: 'Children',
                id: 902
            },
            {
                name: 'Insurance: Other',
                id: 903
            },
            {
                name: 'Penalty',
                id: 904
            },
            {
                name: 'Court fees',
                id: 905
            },
            {
                name: 'Tuition fees',
                id: 906
            },
            {
                name: 'Childcare',
                id: 907
            },
            {
                name: 'Gifts',
                id: 908
            },
            {
                name: 'Tax: Other',
                id: 909
            }
        ]
    }
]

function getDefaultBudget(){
    var res = JSON.parse(JSON.stringify(defaultCategories))
    // for(groupCat in defaultCategories){

    // }
    res.forEach(function(groupCat){
        groupCat.spread = [
            {
                month: 0,
                value: 0
            },{
                month: 1,
                value: 0
            },{
                month: 2,
                value: 0
            },{
                month: 3,
                value: 0
            },{
                month: 4,
                value: 0
            },{
                month: 5,
                value: 0
            },{
                month: 6,
                value: 0
            },{
                month: 7,
                value: 0
            },{
                month: 8,
                value: 0
            },{
                month: 9,
                value: 0
            },{
                month: 10,
                value: 0
            },{
                month: 11,
                value: 0
            },{
                month: 12, //All year
                value: 0
            }
        ]
        groupCat.subCategories.forEach(function(cat){
            cat.spread = [
                {
                    month: 0,
                    value: 0
                },{
                    month: 1,
                    value: 0
                },{
                    month: 2,
                    value: 0
                },{
                    month: 3,
                    value: 0
                },{
                    month: 4,
                    value: 0
                },{
                    month: 5,
                    value: 0
                },{
                    month: 6,
                    value: 0
                },{
                    month: 7,
                    value: 0
                },{
                    month: 8,
                    value: 0
                },{
                    month: 9,
                    value: 0
                },{
                    month: 10,
                    value: 0
                },{
                    month: 11,
                    value: 0
                },{
                    month: 12, //All year
                    value: 0
                }
            ]
        })
    })
    return res
}

// console.log(getDefaultBudget())

var defaultAlerts = [
    {
        level: 0,
        message : "Your balance is under 0 !"
    }
]


var CategorySchema = new Schema({
    id: Number,
    name: String,
    subCategories:[]
})

var AlertSchema = new Schema({
    level: Number,
    message: String
})

var SpreadBudgetSchema = new Schema({
    month: Number,
    value: Number
})

var CategoryBudgetSchema = new Schema({
    id: Number,
    name: String,
    spread: [SpreadBudgetSchema],
    subCategories:[]
})

var UserSchema  = new Schema({
	clientID: Number,
	username: String,
	lastName: String,
	firstName: String,
	email: String,
	password: String, // TODO Add salt ??
    allowAlert: {type: Boolean, default: true},
	token: String,
    tokentiers: String,
    categories: {type: [CategorySchema], default: defaultCategories},
    budget: {type: [CategoryBudgetSchema], default: getDefaultBudget()}
})

var AccountSchema  = new Schema({
    name: String,
    type: Number,
    currency: String,
    userId: String,
    alerts: {type :[AlertSchema], default: defaultAlerts}
})

var OperationSchema = new Schema({
    value: Number,
    thirdParty: String,
    description: String,
    type: String, // TODO rename in typeOpt due to {type: Boolean, default: false},
    checked: Boolean,
    dateOperation: Date, /*{ type: Date, default: Date.now }*/
    datePrelevement: Date,
    categoryId: Number,
    categoryId: Number,
    subOperations: [],
    accountId: String
})

var PeriodSchema = new Schema({
    name: String,
    dateBegin: String,
    nbRepeat: Number,
    step: Number,
    intervalType: String,
    accountId: String,
    operation: {
        value: Number,
        thirdParty: String,
        description: String,
        typeOpt: String,
        checked: {type: Boolean, default: false},
        dateOperation: Date,
        datePrelevement: Date,
        categoryId: String,
        accountId: String
    },
    opCreat: [], // list id of created operation
    isOver: {type: Boolean, default: false}
})



// ExpenseSchema.index( { user: 1 } )

//Models


var accountModel = mongoose.model('account', AccountSchema);
var userModel = mongoose.model('user', UserSchema);
var operationModel = mongoose.model('operation', OperationSchema);
var categoryModel = mongoose.model('category', CategorySchema);
var periodModel = mongoose.model('perio', PeriodSchema);


// accountModel.collection.drop(); 
// userModel.collection.drop(); 
// operationModel.collection.drop(); 
// categoryModel.collection.drop(); 
// periodModel.collection.drop(); 
