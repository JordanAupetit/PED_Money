module.exports = function (app, tool, accountModel, operationModel, userModel) {
    app.get('/api/budget/debug', getDebug)
    app.get('/api/expense/', getAll)
    app.get('/api/expense/:year/:month', getAllByMonth)
    app.get('/api/budget/month', getByMonth)
    app.get('/api/budget/', getBudget)
    app.put('/api/budget/:catId/:value', setBudget)
   

    var moment = require('moment')


    function getBudget(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            userModel.findOne({'_id': userId}, 'budget',function(err, coll) {
                if (!err) {
                    return resp.send(coll.budget);
                } else {
                    next(err);
                }
            })
        })
    }

    function setBudget(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            var catId = parseInt(req.params.catId);
            var isGroupCat = catId%100 === 0;
            var value = parseInt(req.params.value);
            if(isGroupCat){
                userModel.findOne({'_id': userId/*, 'budget.id': catId*/},function(err, budget) {
                    if (!err) {

                        var posg = -1
                        for(var ig =0;ig < budget.budget.length && posg < 0;ig++){
                            if(catId == budget.budget[ig].id){
                                posg = ig
                            }
                        }
                        budget.budget[posg].spread[12].value = value
                        budget.markModified('budget');

                        budget.save(function (err, docs) {
                            if (!err) {
                                return resp.send(docs);
                            } else {
                                next(err);
                            }
                        })

                    } else {
                        next(err);
                    }
                })
            }else{
                var groupCat = catId - catId%100
                userModel.findOne({'_id': userId},function(err, budget) { /*, 'budget.subCategories.id': catId*/
                    if (!err) {
                        var posg = -1
                        var posc = -1
                        for(var ig =0;ig < budget.budget.length && posg < 0;ig++){
                            if(groupCat == budget.budget[ig].id){
                                 for(var ic =0;ic < budget.budget[ig].subCategories.length && posc < 0;ic++){
                                    if(catId == budget.budget[ig].subCategories[ic].id){
                                        posg = ig
                                        posc = ic
                                    }
                                 }
                            }
                        }


                        budget.budget[posg].subCategories[posc].spread[12].value = value
                        budget.markModified('budget');

                        budget.save(function (err, docs) {
                            if (!err) {
                                return resp.send(docs);
                            } else {
                                next(err);
                            }
                        })

                    } else {
                        next(err);
                    }
                })
            }
        })
    }

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


    function getAllByMonth(req, resp, next) {
        'use strict';
        var year = req.params.year;
        var month = req.params.month-1;
        tool.getUserId(req, next, function(userId){
            getAccountListUser(resp, next, userId, function(accountList) {
                if (month === 12) { // All year
                    operationModel.find({
                            "dateOperation": {
                                "$gte": moment([year, 0, 1, 23, 59, 59]).subtract(1, 'days').toDate(),
                                "$lt": moment([year, 11, 1]).add(1, 'months').toDate()
                            },
                            "value": {"$lt": 0},
                            "accountId": { $in: accountList.map(function(id){ return id+''  }) }
                        },
                        function(err, coll) {
                            if (!err) {
                                return resp.send(coll)
                            } else {
                                next(err)
                            }
                        })
                } else {
                    operationModel.find({
                            "dateOperation": {
                                "$gte": moment([year, month, 1, 23, 59, 59]).subtract(1, 'days').toDate(),
                                "$lt": moment([year, month, 1]).add(1, 'months').toDate()
                            },
                            "value": {"$lt": 0},
                            "accountId": { $in: accountList.map(function(id){ return id+''  }) }
                        },
                        function(err, coll) {
                            if (!err) {
                                return resp.send(coll)
                            } else {
                                next(err)
                            }
                        })
                }
            })
        })
    }

    function getAllOperationUser(resp, next,userId, callback){
        accountModel.find({userId: userId}, function (err, accounts) {
            if (!err) {
                var res = []
                accounts.forEach(function(account){
                    operationModel.find({accountId: account._id}, function (err, operations) {
                        if (!err) {
                            operations.forEach(function(operation){
                                res.push(operation)
                            })
                        } else {
                            next(err);
                        }
                    })
                })
                callback(res);
            } else {
                next(err);
            }
        });
    }

    function getAccountListUser(resp, next, userId, callback){
        accountModel.find({userId: userId}, function (err, accounts) {
            if (!err) {
                var res = []
                if(accounts.length > 0){
                 accounts.forEach(function(account){
                    res.push(account._id)     
                })
                   
                }
                callback(res);
            } else {
                next(err);
            }
        });
    }

    function getAll(req, resp, next) {  
        'use strict';
        tool.getUserId(req, next, function(userId){
            getAllOperationUser(resp, next, userId, function(res){
                return resp.send(res)
            })
        })
    }

    function getByMonth(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            getAccountListUser(resp, next, userId, function(accountList) {
                operationModel.aggregate([{
                        $match: {
                           value: { $lt: 0},
                           accountId: { $in: accountList.map(function(id){ return id+''  }) }
                        }
                    },{
                        $group: {
                            _id: {
                                year: {
                                    $year: "$dateOperation"
                                },
                                month: {
                                    $month: "$dateOperation"
                                }
                            },
                            count: {
                                $sum: 1
                            },
                            total: {
                                $sum: '$value'
                            }
                        }
                    }]
                ,
                function(err, res) {
                    if (!err) {
                        //console.log(res)
                        return resp.send(res)
                    } else {
                        next(err)
                    }
                })
                // .match({ accountId: { $in: [ accountList ] } });
            })
        })
        
    }

    

}