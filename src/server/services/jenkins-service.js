module.exports = (function () {
  var RestService = require('./rest-service.js'),
      consts = require('../config/consts.js');

  function JenkinsService() {
    this.rest = new RestService('aWRhbi5lbnRpbkBocGUuY29tOjJ3c3gjRURD');
  }

  JenkinsService.prototype = {
    getBuild: function (buildName, buildNumber) {
      var url = consts.JENKINS_JOB_URL + buildName + (buildNumber ? '/' + buildNumber : '') + '/' + consts.JENKINS_JSON_SUFFIX;
      return this.rest.fetch(url);
    },
    getBuildType: function (buildName, buildType) {
      var url = consts.JENKINS_JOB_URL + buildName + '/' + buildType + '/' + consts.JENKINS_JSON_SUFFIX;
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
