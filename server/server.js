// Module dependencies.
var application_root = __dirname,
	express = require('express'), //Web framework
	path = require('path'), //Utilities for dealing with file paths
	jwt  = require("jsonwebtoken"),
	bodyParser  = require('body-parser')
	


var database = require('./database')
var apiUser = require('./api-user')
var apiOperation = require('./api-operation')
var apiPeriod = require('./api-period')
// var apiTools = require('./api-tools')
// var apiOther = require('./api-other')
// var api = require('./api')
var oauthFacebook = require('./oauthFacebook')
var oauthGoogle = require('./oauthGoogle')

	

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




apiUser(app, database.getUserModel() , jwt)
apiOperation(app, database.getOperationModel())
apiPeriod(app, database.getPeriodModel())
oauthFacebook(app, database.getUserModel())
oauthGoogle(app, database.getUserModel())

