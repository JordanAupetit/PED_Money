module.exports = {
    getDB : function(){
        return db
    },
    getAccountModel: function(){
        return accountModel
    }
}


var mongoose = require('mongoose')

//Connect to database
mongoose.connect('mongodb://localhost/mymoney');
var db = mongoose.connection;


//Schemas
var Schema = mongoose.Schema;



/*var ExpenseSchema = new Schema({
	title: String,
	amount: Number,
	// from:[FriendLinkSchema],
	// to:[FriendLinkTrackSchema],
	date: Date,
	tags: [
		String
	],
	isEdit: Boolean,
	user: String
})*/

var AccountSchema  = new Schema({
	name: String,
	type: String,
	balance: Number,
	currency: String
})


// var CurrencySchema  = new Schema({
// 	id: String,
// 	symbole: String,
// 	libelle: String,
// 	CurrencyId: String,
// 	format: String
// }) 


console.log('init db end')

// ExpenseSchema.index( { user: 1 } )

//Models

// var userModel = mongoose.model('userModel', UserSchema);
// var expenseModel = mongoose.model('expenseModel', ExpenseSchema);
var accountModel = mongoose.model('accountModel', AccountSchema);