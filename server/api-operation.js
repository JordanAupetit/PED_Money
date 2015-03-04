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
                console.log(err);
                next(err);
            }
        });
    }

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


    function updateOperation(req, resp, next) {

        var updateOperation = new operationModel(req.body)
        var idOp = updateOperation._id
        delete updateOperation._id

        operationModel.findByIdAndUpdate(idOp, {$set: updateOperation}, function (err, res) {
            if (err) return handleError(err);
            resp.send(res);
        });

        /*var updatedRecipe = new qcmModel(req.body);

        // Même une réponse simultané ne permettrais pas de valider des réponses en trop
        if(updatedRecipe.answeredQCM > updatedRecipe.answerToEnd) {

            console.log("Le QCM est deja fermé.");
            res.send("Le QCM est deja fermé.");
        } else {

            var updateData = {
                $set: {
                    isOpen: updatedRecipe.isOpen,
                    answeredQCM: updatedRecipe.answeredQCM,
                    goodAnswer: updatedRecipe.goodAnswer,
                    badAnswer: updatedRecipe.badAnswer
                }
            }

            qcmModel.findByIdAndUpdate(updatedRecipe._id, updateData, function (err, qcm) {
              if (err) return handleError(err);
              res.send(qcm);
            });
        }*/
    }

    function addOperation(req, res, next) {
        'use strict';
        var operation = req.body
        delete operation._id

        var newOperation = new operationModel(operation);
        newOperation.save(function(e, results){
            if(e){
                return next(e)
            }else{
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