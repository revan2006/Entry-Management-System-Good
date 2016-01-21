var User    = require('mongoose').model('User'),
    encrypt = require('../utilities/encryption');

exports.getUser = function (req, res) {
    if(!req.isAuthenticated()||req.user.roles.indexOf('admin')=== -1){
        User.find({},{"_id": 1,"username": 1,"email":1 }).exec(function (err, collection) {
            return res.send({data: collection});
        })
    }else {
        User.find({roles: []},{"_id": 1,"username": 1,"email":1,"fullName":1,"telephone":1,"dateCreate":1,"dateModify":1,"allow":1 }).exec(function (err, collection) {
            return res.send({data: collection});
        })
    }
};

exports.createUser = function(io) {
    return function(req, res, next) {
        var userData = req.body;
        userData.username = userData.username.toLowerCase();
        userData.salt = encrypt.createSalt();
        userData.hashed_pwd = encrypt.hashPwd(userData.salt,userData.password);
        User.create(userData, function(err, user) {
            if(err){
                if(err.toString().indexOf('E11000') > -1)
                    err = new Error('Đã có người sử dụng Tên tài khoản hoặc Email này');
                return res.status(400).send({reason: err.toString()});
            }
            io.emit('createUserServer', user);
            io.emit('createUserServerOnly', {_id: user._id,username: user.username,email: user.email });
            return res.send();
        })
    };
};

exports.updateUser = function (io) {
    return function (req, res, next) {
        if(req.body.getUser){
            User.find({},{"_id": 1,"fullName":1}).exec(function (err, collection) {
                io.emit('getUserServer', collection);
            })
        }else {
            var userUpdates = req.body;

            if (req.user._id != userUpdates._id && !req.user.hasRole('admin'))
                return res.status(403).end();

            req.user.username = userUpdates.username.toLowerCase();
            req.user.email = userUpdates.email.toLowerCase();
            req.user.fullName = userUpdates.fullName;
            req.user.telephone = userUpdates.telephone;
            req.user.dateModify = Date.now();

            if (userUpdates.password && userUpdates.password.length > 0) {
                req.user.salt = encrypt.createSalt();
                req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
            }

            req.user.save(function (err, user) {
                if (err) {
                    if(err.toString().indexOf('E11000') > -1)
                        err = new Error('Đã có người sử dụng Tên tài khoản hoặc Email này');
                    return res.status(400).send({reason: err.toString()});
                }
                io.emit('updateUserServer', user);
                io.emit('updateUserServerOnly', {_id: user._id,username: user.username,email: user.email });
                return res.send(req.user);
            })
        }
    };
};
exports.deleteUser = function(io) {
    return function(req, res, next) {
        User.findById(req.body._id, function (err, user) {
            if(err) return res.status(400).send({reason: err.toString()});
            if(req.body.allow !== user.allow) {
                user.allow = req.body.allow;
                user.dateModify = Date.now();

                user.save(function(err) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('allowUser', user);
                    return res.send(user);
                })
            }else {
                user.remove(function (err){
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('deleteUser', user);
                    io.emit('deleteUserServerOnly',user._id);
                    return res.send();
                });
            }
        });
    };
};