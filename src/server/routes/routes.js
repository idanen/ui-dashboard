module.exports = function (app) {
    'use strict';

    var UIDashboardController = require('../controllers/controllers.js');
    var controller = new UIDashboardController();

    app.get('/buildStatus/:buildName', controller.getBuildStatus.bind(controller));

    app.get('/buildTests/:buildName/:buildNumber/:onlyFailed?', controller.getBuildTests.bind(controller));

    app.post('/stability/:buildName/:buildCount', controller.getTestsStability.bind(controller));

    app.post('/updateStatus/:group', controller.updateStatus.bind(controller));
};
