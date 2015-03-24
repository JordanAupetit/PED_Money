module.exports = function (app, operationModel, accountModel) {
    app.get('/api/operation/', getAllOperations)
    app.post('/api/operation/', addOperation)
    app.get('/api/operation/:id', getOperation)
    app.put('/api/operation/', updateOperation)
    app.delete('/api/operation/:id', deleteOperation)

    app.get('/api/account/:accountId/operation/', getAllOperationsByAccount)


    function getAllOperationsByAccount(req, resp, next) {
        'use strict';

        var accountId = req.params.accountId

        operationModel.find({accountId: accountId}, function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                next(err);
            }
        });
    }

    function getAllOperations(req, resp, next) {
        'use strict';
        operationModel.find(/*{user: userId},*/ function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                next(err);
            }
        });
    }


    function getOperation(req, resp, next) {
        'use strict';
        var operationId = req.params.id;

        operationModel.findOne({_id: operationId}, function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                next(err);
            }
        });

    }


    function updateOperation(req, resp, next) {

        var updateOperation = new operationModel(req.body)
        var idOp = updateOperation._id
        delete updateOperation._id
        updateOperation._id = undefined

        operationModel.findByIdAndUpdate(idOp, {$set: updateOperation}, function (err, res) {
            if (err) return next(err);
            resp.send(res);
        });
    }

    function addOperation(req, res, next) {
        'use strict';
        var operation = req.body
        delete operation._id

        // console.log(operation)

        operation.dateOperation = new Date(operation.dateOperation)
        operation.datePrelevement = new Date(operation.datePrelevement)

        operationModel.create(operation, function(err, results){
            if(err){
                return next(err)
            } else {
                res.send(results);   
            }
        })
    }


    function deleteOperation(req, res, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var operationId = req.params.id;

        operationModel.remove({_id: operationId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }
}