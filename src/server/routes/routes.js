module.exports = function(app){

    var UIDashboardController = require('../controllers/controllers.js');
    var controller = new UIDashboardController();

    app.post('/addJob', controller.addNewJob);

    app.post('/updateJob', controller.updateJob);

    app.get('/loadJobs', controller.getAllJobs);

    app.get('/buildStatus/:buildName', controller.getBuildStatus);

    app.get('/startMonitoring', controller.startMonitoring);
};
