var auth        = require('./auth'),
    users       = require('../controllers/users'),
    products     = require('../controllers/products'),
    manufactures     = require('../controllers/manufactures'),
    brands     = require('../controllers/brands'),
    importGoods     = require('../controllers/importGoods'),
    importDetails     = require('../controllers/importDetails'),
    router     = require('express').Router(),
    mongoose    = require('mongoose'),
    User        = mongoose.model('User');

module.exports = function(app, io) {

    router.route('/users')
        .get(users.getUser)
        .post(users.createUser(io))
        .put(auth.requireApiLogin(),users.updateUser(io))
        .patch(auth.requireRole('admin'),users.deleteUser(io));

    router.route('/products')
        .get(auth.requireApiLogin(),products.getData)
        .post(auth.requireApiLogin(),products.createData(io))
        .put(auth.requireRole('admin'),products.updateData(io))
        .patch(auth.requireRole('admin'),products.deleteData(io));

    router.route('/manufactures')
        .get(auth.requireApiLogin(),manufactures.getData)
        .post(auth.requireApiLogin(),manufactures.createData(io))
        .put(auth.requireRole('admin'),manufactures.updateData(io))
        .patch(auth.requireRole('admin'),manufactures.deleteData(io));

    router.route('/brands')
        .get(auth.requireApiLogin(),brands.getData)
        .post(auth.requireApiLogin(),brands.createData(io))
        .put(auth.requireRole('admin'),brands.updateData(io))
        .patch(auth.requireRole('admin'),brands.deleteData(io));

    router.route('/importgoods')
        .get(auth.requireApiLogin(),importGoods.getData)
        .post(auth.requireApiLogin(),importGoods.createData(io))
        .put(auth.requireRole('admin'),importGoods.updateData(io))
        .patch(auth.requireRole('admin'),importGoods.deleteData(io));

    router.route('/importdetails')
        .get(auth.requireApiLogin(),importDetails.getData)
        .post(auth.requireApiLogin(),importDetails.createData(io))
        .patch(auth.requireRole('admin'),importDetails.deleteData(io));


    app.use('/api', router);

    app.post('/login', auth.authenticate);
    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });

    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/'+req.params[0]);
    });
    app.all('/api/*', function (req, res) {
        res.send(404);
    });
    app.get('*', function (req, res) {
        res.render('index',{
            bootstrappedUser: req.user
        });
    });
};