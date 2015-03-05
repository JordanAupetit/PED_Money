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
    // getUserModel: function(){
    //  return userModel
    // },
    // getExpenseModel: function(){
    //  return expenseModel
    // }

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
        subCategories:[
            "Food",
            "Clothes",
            "Gifts"
        ]
    },
    {
        name: "Loisir",
        subCategories:[
            "Football",
            "Cinema",
            "Others"
        ]
    },
    {   
        name: "Others",
        subCategories:[
            "Pets"
        ]
    }
]

var CategorySchema = new Schema({
    id: String,
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
	token: String,
    categories: {type: [CategorySchema], default: defaultCategories}
})

var AccountSchema  = new Schema({
    name: String,
    type: String,
    balance: Number,
    currency: String,
    userId: String
})

var OperationSchema = new Schema({
    value: Number,
    thirdParty: String,
    description: String,
    type: String, // TODO rename in typeOpt due to {type: Boolean, default: false},
    checked: Boolean,
    /*dateOperation: Date,
    datePrelevement: Date,*/
    dateOperation: String,
    datePrelevement: String,
    categoryId: String/*,
    subOperations: []*/,
    accountId: String
})

// var PeriodSchema = new Schema({
//     name: String,
//     amount: Number,
//     dateBegin: Date,
//     nbRepeat: Number,
//     step: Number,
//     accountId: String,
//     intervalType: String
// })

var PeriodSchema = new Schema({
    name: String,
    dateBegin: String,
    nbRepeat: Number,
    step: Number,
    intervalType: String,
    accountId: String,
    // operation: [OperationSchema],
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
// var userModel = mongoose.model('userModel', UserSchema);
// var expenseModel = mongoose.model('expenseModel', ExpenseSchema);
var periodModel = mongoose.model('periodModel', PeriodSchema);


// periodModel.collection.drop(); 
