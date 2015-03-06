// Module dependencies.
var application_root = __dirname,
	express = require('express'), //Web framework
	path = require('path'), //Utilities for dealing with file paths
	jwt  = require("jsonwebtoken"),
	bodyParser  = require('body-parser');

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

	

//Create server
var app = express();

// Configure server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client')));
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

apiAccount(app, accountModel, operationModel)
apiUser(app, userModel, jwt)
apiOperation(app, operationModel, accountModel)
apiPeriod(app, database.getPeriodModel())
apiCategory(app, database.getCategoryModel(), userModel)

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
*	choisir la ligne a commenter, la permiere lance un tache une fois par jour à 1h30 
*	du matin, la seconde en lance une toute les secondes
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