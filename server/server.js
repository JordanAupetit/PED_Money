// Module dependencies.
var application_root = __dirname,
	express = require('express'), //Web framework
	path = require('path'), //Utilities for dealing with file paths
	jwt  = require("jsonwebtoken"),
	bodyParser  = require('body-parser'),
	methodOverride = require('method-override')
	


var database = require('./database')
var apiAccount = require('./api-account')
var apiUser = require('./api-user')
var apiOperation = require('./api-operation')

var apiCategory = require('./api-category')
// var apiExpense = require('./api-expense')

var apiPeriod = require('./api-period')

// var apiTools = require('./api-tools')
// var apiOther = require('./api-other')
// var api = require('./api')

var Cookies = require('cookies')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var config = require('./oauth.js')

var oauthFacebook = require('./oauthFacebook')

//var oauthGoogle = require('./oauthGoogle')

	

//Create server
var app = express();
var oneDay = 86400000;

// Configure server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client'), { maxAge: oneDay }));
//Show all errors in development
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));*



var db = database.getDB()

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	//Start server
	var port = 8754;
	app.listen(port, function () {
		'use strict';
		console.log('Express server listening on port %d in %s mode', port, app.settings.env);
		console.log('application_root is %s',path.join(application_root ,'./client'));
	});
})



var userModel = database.getUserModel()
var accountModel = database.getAccountModel()
var operationModel = database.getOperationModel()


function getUserId(req, next, callback, callbackError) {
	try {
		var decoded = jwt.verify(req.get('X-User-Token'), this.secretKey)
		// console.log(decoded)
		if (callback !== undefined) {
			callback(decoded.id)
		}
	} catch (error) {
		// console.log(error)
		next(new tool.ApiError('AUTH : Invalid token', 450));
		if(callbackError !== undefined){
			callbackError()
		}
	}

		// userModel.findOne({
    //     token: req.get('X-User-Token')
    // }, function(err, user) {
    //     if (err) {
    //     	next(new tool.ApiError('AUTH : Internal Error', 1));
    //     } else {
    //         if (user) {
    //         	if(callback !== undefined){
    //         		callback(user._id)
    //         	}
    //         } else {
    //         	next(new tool.ApiError('AUTH : Invalid token', 450));
    //         	if(callbackError !== undefined){
    //         		callbackError()
    //         	}
    //         }
    //     }
    // })
}

function getUserIdFromToken(token, callback) {
    userModel.findOne({
        token: token
    }, function(err, user) {
        if (err) {
            callback()
        } else {
            if (user) {
                 callback(user._id)
            } else {
                 callback()
            }
        }
    })
}

/**
 * Custom error
 */
function ApiError(message, number) {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = 'ApiError'

    this.number = number | 'Not set'
    this.stack = tmp.stack
    this.message = tmp.message
}
ApiError.prototype = new Error()


/**
 * Shared function
 * Required due to isolation of modules
 * TODO find better way ?
 */
var tool = {
	getUserId : getUserId,
	ApiError: ApiError,
	secretKey: 'm8hHb0Xr8UyhZZH1oxGLOQ7bfRxVh1VCohbfemzF34KRlalpUpFhCVoFqbQPVCS1pjM26bdPLoKyOiCi5dhFt46Day5VEYR8Curq5yJHqYsS5DH60RjDOpUlTZBeG7aryQCkF1hpFNsN5qIPhZyK07AJksfqjUVhkxlyEB7hJQnuhmCojRsCLWRrGZELmhJBqbAHebnv2UEX7v9hBe5HsciyYZ3h0V9gKjdOn1ZZGFdyaLim'

}


apiUser(app, tool, userModel, jwt)
apiCategory(app, tool, database.getCategoryModel(), userModel, accountModel, operationModel)
apiAccount(app, tool, accountModel, operationModel)
apiOperation(app, operationModel, accountModel)
apiPeriod(app, database.getPeriodModel())



/**
 * START Error manager block
 */
app.use(logErrors);
app.use(clientErrorHandler);
// app.use(errorHandler);

function logErrors(err, req, res, next) {
	if(err.hasOwnProperty('number')){
		// Nothing
		console.log("UserError::"+err.message)
	}else{
		console.error(err.stack);
	}
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({
			error: 'Something blew up!'
		});
	} else {
		if(err.hasOwnProperty('number')){
			// console.log(err)
			res.status(500).send({
				error: err.message
			});
		}else{
			res.status(500).send({
				error: 'Unknown error'
			});
		}
		// next(err);
		
	}
}

// function errorHandler(err, req, res, next) {
// 	console.log('test')
// 	res.status(500);
// 	res.render('error', {
// 		error: err
// 	});
// }

/**
 * END Error manager block
 */




//CRON TASK

var CronJob = require('cron').CronJob;

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'do.not.respond.money@gmail.com',
        pass: 'ped-money'
    }
});


/**
 * Choisir la ligne a commenter, la permiere lance un tache une fois par jour à 1h30 
 * du matin, la seconde en lance une toute les secondes
 **/
var job = new CronJob('00 30 01 * * *', function(){
// var job = new CronJob('* * * * * *', function(){
    
    console.info("CronJob starting")
	userModel.find(function (err, users) {
	    if(err){
	        console.log(err)
	    }else{
	        for(var i in users){
	        	if(users[i].allowAlert === true){
	        		accountModel.find(function(err, accounts){
	        			if(err){
	        				console.log(err)
	        			}else{
	        				for(var j in accounts){
	        					if(accounts[j].balance < accounts[j].alert){
	        						var account = accounts[j]
	        						console.log("it should send an email for " + accounts[j].name + " to " + users[i].email)
	        						var mytext = "You have " + account.balance + " " +account.currency + " in your account " 
	        						+ accounts[j].name + ". Visite MyMoney.com to fix this issue"
	        						var mailOptions = {
									    from: 'MyMoney <do.not.respond.money@gmail.com>',
									    to: users[i].email, // list of receivers
									    subject: 'Account balance below your alert level', // Subject line
									    text: mytext, // plaintext body
									    html: "<b>"+ mytext + "</b>" // html body
									};
									
									transporter.sendMail(mailOptions, function(error, info){
									    if(error){
									        console.log(error);
									    }
									})
										
	        					}
	        				}
	        			}
	        		})
	        	}
	        }
	    }
	});
  }, function () {
    // This function is executed when the job stops
  },
  true /* Start the job right now */,
  "Europe/Paris" /* Time zone of this job. */
);



// Only for test (mandatory)
module.exports = app

// Example

// module.exports = function (app, expenseModel) {
// 	app.get('/api/expense/', getAllExpenses)
// 	app.post('/api/expense/', addExpense)
// 	app.get('/api/expense/:id', getExpense)
// 	app.put('/api/expense/', getExpenseByTag)
// 	app.delete('/api/expense/:id', deleteExpense)
// 	app.post('/api/expense/:id', editExpense)


// 	function getAllExpenses(req, resp , next) {
// 		'use strict';
// 		var userId = req.get('X-User-Id');

// 		expenseModel.find({user: userId}, function (err, coll) {
// 			if (!err) {
// 				return resp.send(coll);
// 			} else {
// 				console.log(err);
// 				next(err);
// 			}
// 		});
// 	}
// }
