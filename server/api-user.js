module.exports = function(app, tool, userModel, jwt) {
    app.get('/api/user', getAllUsers) // TEST ONLY
    app.put('/api/user', editUser)
    app.post('/api/user', addUser)
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
                        username: req.body.name,
                        lastName: req.body.last,
                        firstName: req.body.first,
                        email: req.body.mail,
                        password: req.body.pass
                    }

                    var nouveauUser = new userModel(User);
                    nouveauUser.save(function(err, user) {
                        // console.log(user)
                        var tokenInfo = {
                            id: user._id,
                            username: user.username,
                            lastName: user.lastName,
                            firstName: user.firstName,
                            email: user.email
                        }

                        // console.log(tokenInfo)

                        user.token = jwt.sign(tokenInfo, tool.secretKey);
                        

                        // user.token = jwt.sign(user, user.email);
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
        userModel.findOne({
            username: req.body.username,
            password: req.body.password
        }, function(err, user) {
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
        userModel.findById(req.body._id,
            function (err, user1) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                userModel.findOne({username: req.body.username},function(err , exists)
                    {  console.log(user1.username
                        )
                        if(exists && user1.username !== req.body.username){
                            res.json({
                                type: false,
                                data: "User already exists!"
                    });
                        }else{
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
        /*userModel.findOne({
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
                        username: req.body.name,
                        lastName: req.body.last,
                        firstName: req.body.first,
                        email: req.body.mail,
                        password: req.body.pass
                    }

                    var nouveauUser = new userModel(User);
                    nouveauUser.save(function(err, user) {
                        user.token = jwt.sign(user, user.email);
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
        });*/
    }
}