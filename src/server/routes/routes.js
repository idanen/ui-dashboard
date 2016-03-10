module.exports = function(app){

    var UIDashboardController = require('../controllers/controllers.js');
    var controller = new UIDashboardController();
    console.log(UIDashboardController.prototype);

    app.post('/save', controller.save);

    app.get('/fetch', controller.load);

    app.post('/addJob', controller.addNewJob);

    app.post('/updateJob', controller.updateJob);

    app.get('/loadJobs', controller.getAllJobs);

    app.get('/startMonitoring', controller.startMonitoring);

    app.get('/startUpdating', controller.startUpdating)
};
