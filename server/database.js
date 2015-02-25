module.exports = {
    getDB : function(){
        return db
    },
    getOperationModel: function(){
        return operationModel
    },
    getPeriodModel: function(){
        return periodModel
    },
    getUserModel: function(){
	 	return userModel
	}
}


var mongoose = require('mongoose')

//Connect to database
mongoose.connect('mongodb://localhost/mymoney');
var db = mongoose.connection;


//Schemas
var Schema = mongoose.Schema;

var PeriodSchema = new Schema({
	name: String,
	amount: Number,
	dateBegin: Date,
	nbRepeat: Number,
	step: Number,
	accountId: String,
	intervalType: String
})

var UserSchema  = new Schema({
	clientID: Number,
	username: String,
	lastName: String,
	firstName: String,
	email: String,
	password: String,
	token: String
})

var OperationSchema = new Schema({
    value: Number,
    thirdParty: String,
    description: String,
    type: String,
    checked: Boolean,
    /*dateOperation: Date,
    datePrelevement: Date,*/
    dateOperation: String,
    datePrelevement: String,
    categoryId: String/*,
    subOperations: []*/
})


//Models
var userModel = mongoose.model('userModel', UserSchema);
var operationModel = mongoose.model('operationModel', OperationSchema);
var periodModel = mongoose.model('periodModel', PeriodSchema);
