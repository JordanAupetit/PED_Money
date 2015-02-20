
module.exports = function (app, accountModel) {
    app.get('/api/account/', getAllAccounts)
    app.get('/api/account/:id', getAccount)
    app.post('/api/account/', addAccount)
    
    // app.put('/api/operation/', getExpenseByTag)
    app.delete('/api/account/:id', deleteAccount)
    // app.post('/api/operation/:id', editOperation)


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
        // var userId = req.get('X-User-Id');
        var accountId = req.params.id;

        accountModel.findOne({_id: accountId}, function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });

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
        // var userId = req.get('X-User-Id');
        var accountId = req.params.id ;
        accountModel.remove({_id: accountId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }

    // TODO: UPDATE OPERATION
}