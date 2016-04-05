module.exports = (function () {
  var RestService = require('./rest-service.js'),
      consts = require('../config/consts.js');

  function JenkinsService() {
    this.rest = new RestService({
      baseUrl: consts.JENKINS_JOB_URL,
      headers: {
        Authorization: 'Basic ' + consts.JENKINS_CREDENTIALS
      }
    });
  }

  JenkinsService.prototype = {
    getBuild: function (buildName, buildNumber) {
      var url = buildName + (buildNumber ? '/' + buildNumber : '') + '/' + consts.JENKINS_JSON_SUFFIX;
      return this.rest.fetch(url);
    },
    getBuildType: function (buildName, buildType) {
      var url = buildName + '/' + buildType + '/' + consts.JENKINS_JSON_SUFFIX;
      return this.rest.fetch(url);
    }
  };

  JenkinsService.BuildTypes = {
    last: 'lastBuild',
    lastCompleted: 'lastCompletedBuild',
    lastSuccessful: 'lastSuccessfulBuild'
  };

  return JenkinsService;
}());
