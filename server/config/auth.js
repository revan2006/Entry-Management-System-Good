var passport = require('passport');

exports.authenticate = function(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    passport.authenticate('local', function (err, user) {
        if (err) return next(err);
        if (!user) return res.send({success: false, reason: 'Tài khoản/Mật khẩu không đúng'});
        if (user && user.allow === false) return res.send({success: false, reason: 'Tài khoản của bạn chưa được kích hoạt'});
        req.logIn(user, function (err) {
            if (err) return next(err);
            res.send({success: true, user: user, reason: 'Bạn đã đăng nhập thành công'});
        })
    })(req, res, next);
};

exports.requireApiLogin = function() {
    return function(req, res, next) {
        if(!req.isAuthenticated()) res.status(403).end();
        else next();
    };
};

exports.requireRole = function(role) {
    return function(req, res, next) {
        if(!req.isAuthenticated()||req.user.roles.indexOf(role)=== -1)
            res.status(403).end();
        else next();
    };

};