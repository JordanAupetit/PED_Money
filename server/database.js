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
mongoose.connect('mongodb://localhost/mymoney');
var db = mongoose.connection;

//Schemas
var Schema = mongoose.Schema;

var defaultCategories = [
    {
        name: "Shooping",
        id: 100,
        subCategories:[
            {
                name: "Food",
                id: 101
            },
            {
                name: "Clothes",
                id: 102
            },
            {
                name: "Gifts",
                id: 103
            // },
            // {
            //     name: "Shooping",
            //     id: 101
            }

        ]
    },
    {
        name: "Loisir",
        id: 200,
        subCategories:[
            {
                name: "Football",
                id: 201
            },
            {
                name: "Cinema",
                id: 202
            },
            {
                name: "Others",
                id: 299
            }
        ]
    },
    {   
        name: "Others",
        id: 300,
        subCategories:[
            {
                name: "Pets",
                id: 301
            // },
            // {
            //     name: "Clothes",
            //     id: 202
            // },
            // {
            //     name: "Gifts",
            //     id: 203
            }   
        ]
    }
]

var CategorySchema = new Schema({
    id: Number,
    name: String,
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
    categories: {type: [CategorySchema], default: defaultCategories}
})

var AccountSchema  = new Schema({
    name: String,
    type: Number,
    balance: Number,
    currency: String,
    userId: String,
    alerts: [{
        level: Number,
        message: String
    }]
})

var OperationSchema = new Schema({
    value: Number,
    thirdParty: String,
    description: String,
    type: String, // TODO rename in typeOpt due to {type: Boolean, default: false},
    checked: Boolean,
    dateOperation: String, /*{ type: Date, default: Date.now }*/
    datePrelevement: String,
    categoryId: Number/*,
    subOperations: []*/,
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
        dateOperation: String,
        datePrelevement: String,
        categoryId: String,
        accountId: String
    },
    opCreat: [], // list id of created operation
    isOver: {type: Boolean, default: false}
})



// ExpenseSchema.index( { user: 1 } )

//Models


var accountModel = mongoose.model('accountModel', AccountSchema);
var userModel = mongoose.model('userModel', UserSchema);
var operationModel = mongoose.model('operationModel', OperationSchema);
var categoryModel = mongoose.model('categoryModel', CategorySchema);
var periodModel = mongoose.model('periodModel', PeriodSchema);


// accountModel.collection.drop(); 
// userModel.collection.drop(); 
// operationModel.collection.drop(); 
// categoryModel.collection.drop(); 
// periodModel.collection.drop(); 
