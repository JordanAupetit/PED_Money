
module.exports = function (app, categoryModel) {
    app.get('/api/category/', getAllCategroys)
    app.post('/api/category/', addCategroy)
    app.get('/api/category/:id', getCategroy)
    // app.put('/api/category/', getExpenseByTag)
    app.delete('/api/category/:id', deleteCategroy)
    // app.post('/api/category/:id', editCategroy)


    function getAllCategroys(req, resp, next) {
        'use strict';
        // var userId = req.get('X-User-Id');

        categoryModel.find(/*{user: userId},*/ function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });
    }


    function getCategroy(req, resp, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var categoryId = req.params.id;

        categoryModel.findOne({_id: categoryId}, function (err, coll) {
            if (!err) {
                return resp.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });

    }

    function addCategroy(req, res, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var category = req.body
        delete category._id // Security
        // console.log(category)
        var newCategroy = new categoryModel(category);
        newCategroy.save(function(e, results){
            if (e) return next(e);
            res.send(results);
        })
    }

    function deleteCategroy(req, res, next) {
        'use strict';
        // var userId = req.get('X-User-Id');
        var categoryId = req.params.id;

        categoryModel.remove({_id: categoryId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }

    // TODO: UPDATE OPERATION
}