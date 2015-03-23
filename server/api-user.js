module.exports = function(app, tool, userModel, jwt) {
    app.get('/api/user', getAllUsers) // TEST ONLY
    app.put('/api/user', editUser)
    app.post('/api/user', addUser)
    app.delete('/api/user', deleteUser)
    app.post('/api/authenticate', authenticate)
    

    function getAllUsers(req, resp, next) {
        'use strict';
            userModel.find(function (err, coll) {
                if (!err) {
                    return resp.send(coll);
                } else {
                    next(err);
                }
            })
    }

    function deleteUser(req, resp, next) {
        'use strict';
        tool.getUserId(req, next, function(userId){
            userModel.remove({_id: userId}, function (err, results) {
                if (err) return next(err)
                resp.sendStatus(204)
            })
        })
    }



    function addUser(req, res, next) {
        'use strict';
        userModel.findOne({
            username: req.body.name
        }, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    var User = {
                        username: req.body.username,
                        lastName: req.body.lastName,
                        firstName: req.body.firstName,
                        email: req.body.email,
                        password: req.body.password
                    }

                    var nouveauUser = new userModel(User);
                    nouveauUser.save(function(err, user) {
                        var tokenInfo = {
                            id: user._id,
                            username: user.username,
                            lastName: user.lastName,
                            firstName: user.firstName,
                            email: user.email
                        }

                        user.token = jwt.sign(tokenInfo, tool.secretKey);

                        user.save(function(err, user1) {
                            res.json({
                                type: true,
                                data: user1,
                                token: user1.token
                            });
                        });
                    })
                }

            }
        });
    }

    function authenticate(req, res, next) {
        //console.log(req)
        var data = {}
        data.username = req.body.username
        if(req.body.token !== undefined){
            data.tokentiers = req.body.token
        }
        else{
            data.password = req.body.password
        }

        userModel.findOne(data, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: true,
                        data: user,
                        token: user.token
                    });
                } else {
                    res.json({
                        type: false,
                        data: "Incorrect username/password"
                    });
                }

            }

        });
    }


    function editUser(req, res, next) {
        'use strict';
        userModel.findById(req.body._id, function (err, user1) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else if(user1 !== null) {
                userModel.findOne({username: req.body.username},function(err , exists)
                {
                    if(exists && user1.username !== req.body.username){
                        res.json({
                            type: false,
                            data: "User already exists!"
                        });
                    } else {
                        userModel.findByIdAndUpdate(user1._id,req.body,function(err,user){
                            res.json({
                                type: true,
                                data: user
                            });
                        });
                    }
                });
            }
        });
    }
}