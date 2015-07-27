module.exports = function(app){

    var controllerFactory = require('../controllers/controllers.js').UIDashboardController;
    var controller = new controllerFactory();

    app.post('/save', controller.save);

    app.get('/fetch', controller.load);

    app.post('/updateJob', controller.getIt);

    app.get('/getJobs',controller.getAllJobs);

};