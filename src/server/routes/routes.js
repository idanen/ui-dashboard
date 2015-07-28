module.exports = function(app){

    var controllerFactory = require('../controllers/controllers.js').UIDashboardController;
    var controller = new controllerFactory();

    app.post('/save', controller.save);

    app.get('/fetch', controller.load);

    app.post('/addJob', controller.addNewJob);

    app.get('/loadJobs',controller.getAllJobs);

};