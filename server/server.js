// Module dependencies.
var application_root = __dirname,
	express = require('express'), //Web framework
	path = require('path'), //Utilities for dealing with file paths
	jwt  = require('jsonwebtoken'),
	bodyParser  = require('body-parser'),
	methodOverride = require('method-override'),
	CronJob = require('cron').CronJob,
	nodemailer = require('nodemailer'),
	compress = require('compression'),
	moment = require('moment'),
	fs = require('fs')
	handlebars = require('handlebars');
	


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

var oauthFacebook = require('./oauthFacebook')
var oauthGoogle = require('./oauthGoogle')

	

//Create server
var app = express();
var oneDay = 86400000;

// Configure server
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client')));
//app.use(express.static(path.join(application_root ,'../client'), { maxAge: oneDay }));
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
apiPeriod(app, tool, database.getPeriodModel())

oauthFacebook(app, userModel)
oauthGoogle(app, userModel)


/**
 * START Error manager block
 */
app.use(logErrors);
app.use(clientErrorHandler);
// app.use(errorHandler);

function logErrors(err, req, res, next) {
	if(err.hasOwnProperty('number')){
		// Nothing
		console.log('UserError::'+err.message)
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

var periodParam ={
	dateFormat: 'YYYY-MM-DD',
	dateNow: undefined,
	dateNowPlusOne: undefined,
	setDate: function(){
		this.dateNow = moment().millisecond(0).second(0).minute(0).hour(0);
		this.dateNowPlusOne = this.dateNow.clone().add(1, 'days');
	}
}

function getProjection(periodParam, period){
	var projection = undefined

	var date = moment(period.dateBegin, periodParam.dateFormat)
	var dateNow = periodParam.dateNow
	var dateNowPlusOne = periodParam.dateNowPlusOne

	// Set the first operation
	var proj = {
		 accountId: period.operation.accountId,
		 value: period.operation.value,
		 thirdParty: period.operation.thirdParty,
		 description: period.operation.description,
		 typeOpt: period.operation.typeOpt,
		 checked: period.operation.checked,
		 dateOperation: period.operation.dateOperation,
		 datePrelevement: period.operation.datePrelevement,
		 categoryId: period.operation.categoryId,
		}
	proj.dateOperation = date.clone().format(periodParam.dateFormat)
	proj.datePrelevement = proj.dateOperation
	if(date.isSame(dateNow) || date.isBetween(dateNow, dateNowPlusOne)){
		projection = proj
	}else{
		if (period.nbRepeat === -1) {
			// If the operation is infinite show the first 12 operation
			while(projection === undefined 
				&& date.isBefore(dateNowPlusOne) ) {
				proj = period.operation
				proj.dateOperation = date.add(1 * period.step, period.intervalType).clone().format(periodParam.dateFormat)
				proj.datePrelevement = proj.dateOperation
				if(date.isSame(dateNow) || date.isBetween(dateNow, dateNowPlusOne)){
					projection = proj
				}
			}
		} else {
			for (var i = 1; 
				i < period.nbRepeat 
				&& projection === undefined 
				&& date.isBefore(dateNowPlusOne); 
				i++) {
				proj = period.operation
				proj.dateOperation = date.add(1 * period.step, period.intervalType).clone().format(periodParam.dateFormat)
				proj.datePrelevement = proj.dateOperation
				if(date.isSame(dateNow) || date.isBetween(dateNow, dateNowPlusOne)){
					projection = proj
				}
			}
		}
	}
	
	return projection
}

function addOperation(operation){
	console.log(operation)
	var newOperation = new operationModel(operation);
    newOperation.save(function(err, results){
        if(err){
            console.log(err)
            return false 
        }else{
            return true 
        }
    })
}

var Timer = (function(){
	var times = {}
	return {
		start: function(name){
			times[name] = new Date().getTime();
		},
		stop: function(name){
			if(name in times){
				times[name] = new Date().getTime() - times[name]
				console.log('Execution time "'+name+'": ' + times[name]+'ms');
			}
		}
	}
})()


var jobPeriod = new CronJob('00 00 00 * * *', function(){ // Each day at midnight
// var jobPeriod = new CronJob('*/10 * * * * *', function(){
	console.info('CronJob Period starting')
	periodParam.setDate()

	userModel.find({},'_id', function (err, users) { 
	    if(err){
	        console.log(err)
	    }else{
	    	var periodModel = database.getPeriodModel()

	    	for (var i in users) { // For each user
	    		console.log('UserId: '+users[i]._id)
	    		accountModel.find({userId: users[i]._id}, '_id', function (err, accounts) {
					if (!err) {
						for (var accountPos in accounts) { // For each account
							periodModel.find({'operation.accountId': accounts[accountPos]._id}, function (err, periods) {
								if (!err) {
									for (var periodPos in periods) {
										// Timer.start('One period')
										var operation = getProjection(periodParam, periods[periodPos])
										console.log(operation)
										if(operation !== undefined){
											// addOperation(operation)
										}
										// Timer.stop('One period')
									}
								} else {
									console.log(err)
								}
							})
						}
					} else {
						console.log(err)
					}
				})
	    	}
	    }
	})
	}, function () {
    // This function is executed when the job stops
    console.log('CronJob Period End')
  },
  false /* Start the job right now */,
  'Europe/Paris' /* Time zone of this job. */
)

jobPeriod.start();










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
	console.info("starting cron task")
	fs.readFile('./server/template-alert.hbs', function(err, data){
		var template = handlebars.compile(data.toString())
		userModel.find(function (err, users) {
			/**
			*	Pour tous les users
			*/
			for(var i in users){
				var user = users[i]
				if(user.allowAlert === true){
					accountModel.find({userId: user._id}, '_id alerts name', function(err, accounts){
						/**
						* Pour tous les account du user
						*/
						for(var j in accounts){
							var account = accounts[j]
							operationModel.find({accountId: account._id}, 'value', function (err, operations) {
								var balance = 0
								/**
								*	On calcule la balance actuelle de l'account
								*/
								for(var k in operations){
									var operation = operations[k]
									balance = operation.value + balance
								}

								var alertsRaised = []

								/**
								*	Pour chaque seuil d'alert
								*/
								for(var l in account.alerts){
									var alert = account.alerts[l]
									/**
									*	Si la balance est plus petite que le seuil on stocke le message
									*/
									if(balance < alert.level){
										alertsRaised.push(alert)
									}
								}

								/**
								*	Si au moins une alerte a été levée, on envoie un mail
								*/
								if(alertsRaised.length>0){
									var superdata = {
										owner: user.firstName + ' ' + user.lastName, 
										username: user.username, 
										account: account,
										alertsRaised: alertsRaised
									}
									superdata.date = new Date()
									var mailOptions = {
										from: 'MyMoney <do.not.respond.money@gmail.com>',
										to: user.email, // list of receivers
										subject: 'MyMoney ALERT', // Subject line
										//text: mytext, // plaintext body
										html: template(superdata) // html body
									}
									console.info("sending email")
									transporter.sendMail(mailOptions, function(error, info){
										if(error){
											console.log(error)
										}
									})
								}
							}) // end operationModel find
						} // end for accounts
					}) // end accountModel find
				} // end if allow alert
			} // end for users
		}) // end userModel Find
	}) // end fs read
}, function () {}, true /* Start the job right now */, "Europe/Paris");



// Only for test (mandatory)
module.exports = app

