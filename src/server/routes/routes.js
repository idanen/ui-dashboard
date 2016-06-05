module.exports = function (app) {
    'use strict';

    var UIDashboardController = require('../controllers/controllers.js');
    var controller = new UIDashboardController();

    app.get('/buildStatus/:buildName', controller.getBuildStatus.bind(controller));

    app.get('/buildTests/:buildName/:buildNumber/:onlyFailed?', controller.getBuildTests.bind(controller));

    app.get('/failedOfLastBuilds/:buildName/:buildCount/:startFromNumber', controller.getFailedOfLast.bind(controller));

    app.get('/compareBuildTests/:buildName/:buildNumber/:toBuildName/:toBuildNumber', controller.getCompareTests.bind(controller));

    app.get('/stability/:buildName/:buildCount/:startFromNumber', controller.getTestsStability.bind(controller));

    app.post('/buildTests/:buildName/:buildNumber', controller.getSpecificBuildTests.bind(controller));

    app.post('/stability/:buildName/:buildCount/:startFromNumber', controller.getTestsStability.bind(controller));

    app.post('/updateStatus/:group', controller.updateStatus.bind(controller));
};
