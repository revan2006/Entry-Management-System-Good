var path        = require('path');
var rootPath    = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        //db: "mongodb://localhost/toan_thuy",
        db: "mongodb://duc.nguyen:054513108@ds047335.mongolab.com:47335/toanthuy",
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        db: "mongodb://duc.nguyen:054513108@ds047335.mongolab.com:47335/toanthuy",
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};