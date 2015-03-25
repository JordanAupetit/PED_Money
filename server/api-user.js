module.exports = function(app, tool, userModel, jwt,nodemailer) {
    app.get('/api/user', getAllUsers) // TEST ONLY
    app.put('/api/user', editUser)
    app.post('/api/user', addUser)
    app.delete('/api/user', deleteUser)
    app.post('/api/authenticate', authenticate)
    app.post('/api/forgot', sendmail)
    app.post('/api/passchange/:token', change)

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
        }, function(err, userExist) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (userExist) {
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

    function change(req,res,next){
         userModel.findOne( {token: req.params.token} , function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                        });
            } else {

                user.password = req.body.psw;
                user.save();
                res.json({
                    type: true
                });
            }
        });
     }

     function sendmail(req, res, next){
        "use strict"
          userModel.findOne( {username: req.body.username, email : req.body.email} , function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                        var transporter2 = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'sahriyoussef159@gmail.com',
                                pass: 'Bordeaux14'
                            }
                        });
                        var mailOptions = {
                                        from: 'MyMoney <do.not.respond.money@gmail.com>',
                                        to: user.email, // list of receivers
                                        subject: 'Change password', // Subject line
                                        text: "to change your password please click here", // plaintext body
                                        html: '<p> http://localhost:8754/#/passchange/'+user.token+'<p>'// html body
                                    }
                                    console.info("sending email")
                                    transporter2.sendMail(mailOptions, function(error, info){
                                        if(error){
                                            console.log(error)
                                        }
                                    })               
                         res.json({type: true});
                } else {
                    res.json({
                        type: false,
                        data: "Incorrect username/password"
                    });
                }
            }

        });
    }
}