var mongoose    = require('mongoose'),
    encrypt     = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: '{PATH} is required!',
        unique: true
    },
    email: {
        type: String,
        required: '{PATH} is required!',
        unique: true
    },
    fullName: {type: String, required: '{PATH} is required!'},
    telephone: {type: Number, required: '{PATH} is required!'},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    dateCreate: {type: Date, default: Date.now},
    dateModify: {type: Date, default: Date.now},
    allow: {type: Boolean, default: false},
    roles: [String]
});

userSchema.methods = {
    authenticate: function (passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
};

var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
    User.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, "admin");
            User.create({
                username: 'admin',
                email: 'ducnn.230288@gmail.com',
                fullName: 'Administrator',
                telephone: '0905629618',
                salt: salt,
                hashed_pwd: hash,
                allow: true,
                roles: ["admin"]
            });
        }
    });
}

exports.createDefaultUsers = createDefaultUsers;