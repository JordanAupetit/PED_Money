module.exports = {
	getDB : function(){
		return db
	}
	// getUserModel: function(){
	// 	return userModel
	// },
	// getExpenseModel: function(){
	// 	return expenseModel
	// }
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

// var AccountSchema  = new Schema({
// 	id: String,
// 	name: String,
// 	type: String,
// 	solde: String,
// 	deviseId: String
// })


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