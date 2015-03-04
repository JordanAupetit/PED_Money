
module.exports = function (app, accountModel, operationModel) {
    app.get('/api/account/', getAllAccounts)
    app.get('/api/account/:id', getAccount)
    app.post('/api/account/', addAccount)
    
    app.put('/api/account/', updateAccount)
    app.delete('/api/account/:id', deleteAccount)


    function getAllAccounts(req, resp, next) {
        'use strict';
        // var userId = req.get('X-User-Id');

        accountModel.find(/*{user: userId},*/ function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });
    }


    function getAccount(req, resp, next) {
        'use strict';       
        var accountId = req.params.id;

        operationModel.find({accountId: accountId}, function (err, operations) {
            if (!err) {
                var balance = 0
                for(var i in operations){
                    balance = balance + operations[i].value
                }
                accountModel.findByIdAndUpdate(accountId, {'balance': balance}, function(err, res){
                    if(err)
                        console.log(err)
                    else{
                        accountModel.findOne({_id: accountId}, function (err, account) {
                            if (!err) {
                                return resp.send(account);
                            } else {
                                console.log(err);
                                next(err);
                            }
                        });
                    }
                })
            } else {
                console.log(err);
            }
        })
    }

    function addAccount(req, res, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var account= req.body
        delete account._id // Security
        console.log(account)
        var newAccount = new accountModel(account);
        newAccount.save(function(e, results){
            if (e) return next(e);
            res.send(results);
        })
    }

    function deleteAccount(req, res, next) {
        'use strict';
        var accountId = req.params.id ;
        accountModel.remove({_id: accountId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }

    function updateAccount(req, res, next) {

        var account = new accountModel(req.body)
        var accountId = account._id
        delete account._id

        accountModel.findByIdAndUpdate(accountId, {$set: account}, function (err, qcm) {
            if (err) return handleError(err);
            res.send(qcm);
        });
    }



}