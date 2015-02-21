
module.exports = function (app, operationModel) {
    app.get('/api/operation/', getAllOperations)
    app.post('/api/operation/', addOperation)
    app.get('/api/operation/:id', getOperation)
    // app.put('/api/operation/', getExpenseByTag)
    app.delete('/api/operation/:id', deleteOperation)
    // app.post('/api/operation/:id', editOperation)


    function getAllOperations(req, resp, next) {
        'use strict';
        // var userId = req.get('X-User-Id');

        operationModel.find(/*{user: userId},*/ function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });
    }


    function getOperation(req, resp, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var operationId = req.params.id;

        operationModel.findOne({_id: operationId}, function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });

    }

    function addOperation(req, res, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var operation = req.body
        delete operation._id // Security
        // console.log(operation)
        var newOperation = new operationModel(operation);
        newOperation.save(function(e, results){
            if (e) return next(e);
            res.send(results);
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

    // TODO: UPDATE OPERATION
}