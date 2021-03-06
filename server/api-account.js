
module.exports = function (app, tool, accountModel, operationModel) {
    // app.get('/api/account/debug', getDebug)
    app.get('/api/account/', getAllAccounts)
    app.get('/api/account/:id', getAccount)
    app.post('/api/account/', addAccount)    
    app.put('/api/account/', updateAccount)
    app.delete('/api/account/:id', deleteAccount)


    function getAllAccounts(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            accountModel.find({userId: userId}, function (err, accounts) {
                if (!err) {
                    resp.send(accounts)
                } else {
                    next(err);
                }
            });
        }) 
    }

    function getAccount(req, resp, next) {
        'use strict';

        tool.getUserId(req, next, function(userId){
            var accountId = req.params.id;

            accountModel.findOne({_id: accountId}, function (err, account) {
                if (!err) {
                    if(account !== null){
                        operationModel.find({accountId: accountId}, function (err, operations) {
                            if (!err) {
                                account.set('operations', operations, { strict : false })
                                return resp.send(account);
                            } else {
                                next(err);
                            }
                        })
                    }else{
                        return resp.sendStatus(204);
                    }
                } else {
                    next(err);
                }
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
                if (err) return next(err);
                res.send(qcm);
            });
        })
    }
}