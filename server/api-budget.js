module.exports = function (app, tool, accountModel, operationModel) {
    app.get('/api/budget/debug', getDebug)
    app.get('/api/budget/', getAll)
    app.get('/api/budget/:year/:month', getAllByMonth)
    app.get('/api/budget/month', getByMonth)
    // app.get('/api/account/:id', getAccount)
    // app.post('/api/account/', addAccount)    
    // app.put('/api/account/', updateAccount)
    // app.delete('/api/account/:id', deleteAccount)

    var moment = require('moment')

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
        var month = req.params.month;

        operationModel.find({
                "dateOperation": {
                    "$gte": moment([year, month, 1, 23, 59, 59]).subtract(1, 'days').toDate(),
                    "$lt":  moment([year, month, 1]).add(1, 'months').toDate()
                }
            },
            function(err, coll) {
                if (!err) {
                    return resp.send(coll)
                } else {
                    next(err)
                }
            })
    }

    function getAll(req, resp, next) {
        'use strict';
        operationModel.find(function (err, coll) {
            if (!err) {
                return resp.send(coll)
            } else {
                next(err)
            }
        })
    }

    function getByMonth(req, resp, next) {
        'use strict';
        operationModel.aggregate({
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
        },
        function(err, res) {
            if (!err) {
                // console.log(res)
                return resp.send(res)
            } else {
                next(err)
            }
        })
    }

    

}