module.exports = function(app){

    var controllerFactory = require('./../../code/controllers/controllers.js').UIDashboardController;
    var controller = new controllerFactory();

    app.post('/save', controller.save);

    app.get('/fetch', controller.load);

};