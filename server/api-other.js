module.exports = function (app, tool, categoryModel, userModel, accountModel, operationModel) {
	// TODO: UPDATE OPERATION
    //var phantom = require('phantom');
    var handlebars = require('handlebars');
    var fs = require('fs')
    var pdf = require('html-pdf')

    app.get('/api/account/:accountId/pdf', getPdf)

    function getPdf(req, res, next){
        var accountId = req.params.accountId
        var superdata = {}
        accountModel.findOne({_id: accountId}, '_id name currency userId', function(err, account){
            superdata.date = moment().format("MMM Do YYYY")
            superdata.url = req.protocol + '://' + req.get('host')
            superdata.account = account
            operationModel.find({accountId: account._id}, function(err, operations){
                var balance = 0
                for(var i in operations){
                    var value = operations[i].value
                    balance = value + balance
                    operations[i].dateOperationFormat = moment(operations[i].dateOperation).format('LL');
                    operations[i].datePrelevementFormat = moment(operations[i].datePrelevement).format('LL');
                    if(value>=0)
                        operations[i].credit = value
                    else
                        operations[i].debit = value*-1
                }
                superdata.account.balance = balance
                superdata.account.operations = operations

                userModel.findOne({_id: account.userId}, 'username lastName firstName', function(err, user){
                    superdata.owner = user.lastName + ' ' + user.firstName
                    superdata.username = user.username

                    var config = {
                        "directory": "./tmp",
                        "format": "A4",
                        "orientation": "portrait", 
                        "border": "1cm",
                        "type": "pdf",     
                        "timeout": 30000
                    }
                    fs.readFile('./server/template-pdf.hbs', function(err, data){
                        if (!err) {
                            var template = handlebars.compile(data.toString())
                            pdf.create(template(superdata), config).toBuffer(
                                function(err, file){
                                    res.header("Content-Type", "application/pdf");
                                    res.send(file)
                                }
                            );
                        }
                    })
                })
            })
        })
    }
}