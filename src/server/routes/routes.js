module.exports = function (app) {
    'use strict';

    var UIDashboardController = require('../controllers/controllers.js');
    var controller = new UIDashboardController();

    app.post('/addJob', controller.addNewJob.bind(controller));

    app.post('/updateJob', controller.updateJob.bind(controller));

    app.get('/loadJobs', controller.getAllJobs.bind(controller));

    app.get('/buildStatus/:buildName', controller.getBuildStatus.bind(controller));

    app.get('/buildTests/:buildName/:buildNumber', controller.getBuildTests.bind(controller));

    app.post('/updateStatus/:group', controller.updateStatus.bind(controller));
};
