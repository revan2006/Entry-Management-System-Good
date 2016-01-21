var express         = require('express'),
    bodyParser      = require("body-parser"),
    logger          = require("morgan"),
    passport        = require("passport"),
    cookieParser    = require("cookie-parser"),
    session         = require("cookie-session");

module.exports = function (app, config) {
    app.set("views", config.rootPath + "/server/views");
    app.set("view engine", "jade");
    app.use(logger("dev"));
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({secret: 'multi vision unicorns'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.rootPath + "/public"));
};