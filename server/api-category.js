
module.exports = function (app, categoryModel, userModel) {
    app.get('/api/category/:userid', getCategories)
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
        var userid = req.params.userid;
        userModel.findOne({_id: userid}, function (err, coll) {
            if (!err) {
                return res.send(coll.categories);
            } else {
                console.log(err);
                next(err);
            }
        });
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
        /*
        var category = req.body
        delete category._id // Security
        // console.log(category)
        var newCategory = new categoryModel(category);
        newCategory.save(function(e, results){
            if (e) return next(e);
            res.send(results);
        })
        */
    }

    function getCategory(req, res, next) {
        'use strict';
        // var userid = req.get('X-User-Id');
        var categoryId = req.params.id;

        categoryModel.findOne({_id: categoryId}, function (err, coll) {
            if (!err) {
                return res.send(coll);
            } else {
                console.log(err);
                next(err);
            }
        });

    }

    function addCategory(req, res, next) {
        'use strict';
        // var userid = req.get('X-User-Id');
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
        // var userid = req.get('X-User-Id');
        var categoryId = req.params.id;

        categoryModel.remove({_id: categoryId},function (err, results) {
            if (err) return next(err);
            res.sendStatus(204);
        })
    }

    // TODO: UPDATE OPERATION
}