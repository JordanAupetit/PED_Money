
module.exports = function (app, tool, categoryModel, userModel, accountModel, operationModel) {
    app.get('/api/category/:userid', getCategories)
    app.get('/api/category', getCategories)
    app.put('/api/category/:userid', updateCategories)

    /*

    54e4d019e6d52f98153df4c9

    */

    //app.get('/api/category/', getCategories)
    app.post('/api/category/', addCategory)
    app.get('/api/category/:id', getCategory)
    // app.put('/api/category/', getExpenseByTag)
    app.delete('/api/category/:id', deleteCategory)
    // app.post('/api/category/:id', editCategroy)


    function getCategories(req, res, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            userModel.findOne({_id: userId}, function (err, coll) {
                if (!err) {
                    return res.send(coll.categories);
                } else {
                    next(err);
                }
            })
        })
    }

    function updateCategories(req, res, next) {
        'use strict';
        var userid = req.params.userid;

        userModel.findOneAndUpdate({_id: userid}, {categories: req.body}, function(err, coll){
            if (!err) {
                return res.send(coll.categories);
            } else {
                console.log(err);
                next(err);
            }
        }) 
    }

    function getCategory(req, res, next) {
        'use strict';
        var categoryId = req.params.id;

        categoryModel.findOne({_id: categoryId}, function (err, coll) {
            if (!err) {
                return res.send(coll);
            } else {
                next(err);
            }
        });

    }

    function addCategory(req, res, next) {
        'use strict';
        var category = req.body
        delete category._id // Security
        // console.log(category)
        var newCategory = new categoryModel(category);
        newCategory.save(function(e, results){
            if (e) return next(e);
            res.send(results);
        })
    }

    function deleteCategory(req, res, next) {
        'use strict';
        var categoryId = req.params.id;

        categoryModel.remove({_id: categoryId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }

    // TODO: UPDATE OPERATION
    //var phantom = require('phantom');
    var handlebars = require('handlebars');
    var fs = require('fs')
    var pdf = require('html-pdf')

    app.get('/api/account/:accountId/pdf', getPdf)

    function getPdf(req, res, next){
        var accountId = req.params.accountId
        var superdata = {owner: 'à rajouter aux DATA', date: "today"}
        accountModel.findOne({_id: accountId}, '_id name currency', function(err, account){
            superdata.account = account
            operationModel.find({accountId: account._id}, function(err, operations){
                var balance = 0
                for(var i in operations){
                    var value = operations[i].value
                    balance = value + balance
                    if(value>=0)
                        operations[i].credit = value
                    else
                        operations[i].debit = value*-1
                }
                superdata.account.balance = balance
                superdata.account.operations = operations

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
    }
}