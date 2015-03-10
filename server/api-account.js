
module.exports = function (app, tool, accountModel, operationModel) {
    app.get('/api/account/debug', getDebug)
    app.get('/api/account/', getAllAccounts)
    app.get('/api/account/:id', getAccount)
    app.post('/api/account/', addAccount)    
    app.put('/api/account/', updateAccount)
    app.delete('/api/account/:id', deleteAccount)

    function getDebug(req, resp, next) {
        'use strict';
        accountModel.find( function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                next(err);
            }
        });
    }

    function getAllAccounts(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            accountModel.find({userId: userId}, '_id name type currency balance', function (err, coll) {
                if (!err) {
                    return resp.send(coll);
                } else {
                    next(err);
                }
            });
        }) 
    }

    function updateBalance(accountId, userId, next, callback){
        operationModel.find({accountId: accountId, userId: userId}, function (err, operations) {
            if (!err) {
                var balance = 0
                for(var i in operations){
                    balance = balance + operations[i].value
                }
                accountModel.findByIdAndUpdate(accountId, {'balance': balance}, function(err, res){
                    if(err)
                        next(err);
                    else{
                        callback()
                    }
                })
            } else {
                next(err);
            }
        })
    }

    function getAccount(req, resp, next) {
        'use strict';       

        tool.getUserId(req, next, function(userId){
            var accountId = req.params.id;

            updateBalance(accountId, userId, next, function(){
                accountModel.findOne({_id: accountId}, '_id name type currency balance', function (err, account) {
                    if (!err) {
                        return resp.send(account);
                    } else {
                        next(err);
                    }
                });
            })
        }) 
    }

    function addAccount(req, res, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            var account= req.body
            delete account._id // Security
            account.userId = userId
            // console.log(account)
            var newAccount = new accountModel(account);
            newAccount.save(function(e, results){
                if (e) return next(e);
                res.send(results);
            })
        })
    }

    function deleteAccount(req, res, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            var accountId = req.params.id ;
            accountModel.remove({_id: accountId},function (err, results) {
                if (err) return next(err);
                res.sendStatus(204);
            })
        })
    }

    function updateAccount(req, res, next) {
        tool.getUserId(req, next, function(userId){
            var account = req.body
            var accountId = account._id
            delete account._id

            accountModel.findByIdAndUpdate(accountId, {$set: account}, function (err, qcm) {
                if (err) return handleError(err);
                res.send(qcm);
            });
        })
    }



}