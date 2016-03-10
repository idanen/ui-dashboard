var Promise = require('Promise'),
    moment = require('moment');

module.exports = (function () {
  var JENKINS_JOB_URL = 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/',
      jsonSuffix = 'api/json',
      FIREBASE_URL_CI_JOBS = 'https://boiling-inferno-9766.firebaseio.com/allJobs',
      FIREBASE_REST_SUFFIX = '.json';

  function StatusUpdater(interval) {
    var RestService = require('./rest-service.js');
    this.rest = new RestService();
    this.interval = interval || 1000 * 60 * 60;
    this.runningUpdates = {};
  }

  StatusUpdater.prototype = {
    startUpdater: function (jobName, jobNumber) {
      if (this.runningUpdates[jobName + '#' + jobNumber]) {
        this.stopUpdater(jobName, jobNumber);
      }
      this.runningUpdates[jobName + '#' + jobNumber] = setInterval(this.update(jobName, jobNumber).bind(this), this.interval);
      return this.runningUpdates[jobName + '#' + jobNumber];
    },
    update: function (jobName, jobNumber) {
      this.rest.fetch(JENKINS_JOB_URL + jobName + '/' + jobNumber + '/' + jsonSuffix)
          .then(function (jenkinsJob) {
            if (!jenkinsJob.building) {
              this.stopUpdater(jenkinsJob.name, jenkinsJob.number);
            }
            return this.rest.update(this.buildFirebaseURL(jenkinsJob.name), {
              building: jenkinsJob.building,
              result: jenkinsJob.result,
              duration: jenkinsJob.duration
            });
          }.bind(this));
    },
    getBuildState: function (job) {
      return this.rest.fetch(JENKINS_JOB_URL + job.name + '/lastBuild/' + jsonSuffix)
          .then(function (jenkinsJob) {
            if (jenkinsJob.building) {
              this.startUpdater(jenkinsJob.name, jenkinsJob.number);
            }
            return jenkinsJob;
          }.bind(this));
    },
    stopUpdater: function (jobName, jobNumber) {
      clearInterval(this.runningUpdates[jobName + '#' + jobNumber]);
      delete this.runningUpdates[jobName + '#' + jobNumber];
    },
    getBuildStatus: function (buildName) {
      return this.rest.fetch(JENKINS_JOB_URL + buildName + '/' + jsonSuffix)
          .then(this.getRelevantBuilds.bind(this))
          .catch(function (error) {
            return Promise.reject(error);
          });
    },
    getRelevantBuilds: function (buildDetails) {
      var promises = [];
      if (buildDetails.lastBuild.number !== buildDetails.lastCompletedBuild.number) {
        promises.push(this.rest.fetch(buildDetails.lastBuild.url + jsonSuffix));
      }
      promises.push(this.rest.fetch(buildDetails.lastCompletedBuild.url + 'api/json'));
      if (buildDetails.lastSuccessfulBuild.number !== buildDetails.lastCompletedBuild.number) {
        promises.push(this.rest.fetch(buildDetails.lastSuccessfulBuild.url + jsonSuffix));
      }
      return Promise.all(promises)
          .then(function (builds) {
            return this.processBuilds(builds, buildDetails);
          }.bind(this))
          .catch(function (error) {
            return Promise.reject(error);
          });
    },
    processBuilds: function (builds, parentDetails) {
      var buildsStatus = [];
      if (builds && Array.isArray(builds)) {
        builds.forEach(function (branchInfo) {
          var buildStatus = {},
              duration, durationMoment;
          buildStatus.name = branchInfo.fullDisplayName;
          buildStatus.url = branchInfo.url;
          if ((branchInfo.number === parentDetails.lastBuild.number) && parentDetails.lastBuild.number !== parentDetails.lastCompletedBuild.number) {
            buildStatus.status = parentDetails.color;
          } else {
            buildStatus.status = this._getStatus(branchInfo.result);
          }
          buildStatus.result = (branchInfo.building === true) ? 'RUNNING' : branchInfo.result;
          duration = branchInfo.building ? Date.now() - branchInfo.timestamp : branchInfo.duration;
          durationMoment = moment.duration(duration);
          buildStatus.duration = durationMoment.hours() + ':' + durationMoment.minutes() + ':' + durationMoment.seconds();
          buildsStatus.push(buildStatus);
        }, this);
      }
      return buildsStatus;
    },
    _getStatus: function(result) {
      if (result === "SUCCESS") {
        return 'blue';
      } else if (result === "FAILED") {
        return 'red';
      } else {
        return 'yellow';
      }
    },
    /**
     * Builds a URL to the Firebase REST API
     * @param {string} [jobName] An optional identifier to get specific job instead the whole list
     * @return {string} The resource URL
     */
    buildFirebaseURL: function (jobName) {
      var jobName = jobName ? '/' + jobName : '';
      return FIREBASE_URL_CI_JOBS + jobName + FIREBASE_REST_SUFFIX;
    }
  };

  return StatusUpdater;
}());
