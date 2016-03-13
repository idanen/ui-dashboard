var Promise = require('Promise'),
    moment = require('moment');
require("moment-duration-format");

module.exports = (function () {
  var JENKINS_JOB_URL = 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/',
      jsonSuffix = 'api/json',
      FIREBASE_URL_CI_JOBS = 'https://boiling-inferno-9766.firebaseio.com/allJobs',
      FIREBASE_URL_CI_STATUS = 'https://boiling-inferno-9766.firebaseio.com/ciStatus',
      FIREBASE_REST_SUFFIX = '.json';

  function StatusUpdater(interval) {
    var RestService = require('./rest-service.js');
    this.rest = new RestService();
    this.interval = interval || 1000 * 60 * 60;
    this.runningUpdates = {};
    this.statusToColor = {
      SUCCESS: 'blue',
      FAILED: 'red',
      'default': 'yellow'
    };
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
          .then(this.writeToDB.bind(this))
          .catch(function (error) {
            return Promise.reject(error);
          });
    },
    getRelevantBuilds: function (buildDetails) {
      var promises = [];
      if (buildDetails.lastBuild.number !== buildDetails.lastCompletedBuild.number) {
        promises.push(this.rest.fetch(buildDetails.lastBuild.url + jsonSuffix));
      }
      promises.push(this.rest.fetch(buildDetails.lastCompletedBuild.url + jsonSuffix));
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
          var buildStatus = {};
          buildStatus.name = parentDetails.displayName;
          buildStatus.url = branchInfo.url;
          if ((branchInfo.number === parentDetails.lastBuild.number) && parentDetails.lastBuild.number !== parentDetails.lastCompletedBuild.number) {
            buildStatus.status = parentDetails.color;
          } else {
            buildStatus.status = this.statusToColor[branchInfo.result] || this.statusToColor.default;
          }
          buildStatus.result = (branchInfo.building === true) ? 'RUNNING' : branchInfo.result;
          buildStatus.duration = branchInfo.building ? Date.now() - branchInfo.timestamp : branchInfo.duration;
          buildsStatus.push(buildStatus);
        }, this);
      }
      return buildsStatus;
    },
    writeToDB: function (builds) {
      var buildsObj = this.buildsArrayToObject(builds);
      return this.rest.fetch(FIREBASE_URL_CI_STATUS + '/masters' + FIREBASE_REST_SUFFIX)
          .then(function (masterBuilds) {
            if (masterBuilds) {
              Object.keys(masterBuilds).forEach(function (buildStateId) {
                var masterBuild = masterBuilds[buildStateId];
                var updatedBuild = buildsObj[masterBuild.name];
                if (updatedBuild) {
                  masterBuild.status = updatedBuild.status;
                  masterBuild.result = updatedBuild.result;
                  masterBuild.duration = updatedBuild.duration;
                  masterBuild.status = updatedBuild.status;
                  masterBuild.lastUpdate = Date.now();
                }
              });
            }
            return masterBuilds;
          }.bind(this))
          .then(function (updatedBuilds) {
            var updatePromises;

            if (!updatedBuilds) {
              return updatedBuilds;
            }

            updatePromises = [];
            Object.keys(updatedBuilds).forEach(function (buildStateId) {
              updatePromises.push(this.rest.update(FIREBASE_URL_CI_STATUS + '/masters/' + buildStateId + FIREBASE_REST_SUFFIX, updatedBuilds[buildStateId]));
            }.bind(this));

            return Promise.all(updatePromises);
          }.bind(this));
    },
    buildsArrayToObject: function (buildsArray) {
      var result = {};
      buildsArray.forEach(function (build) {
        result[build.name] = build;
      });
      return result;
    },
    _formatTime: function (aMoment) {
      function prefixWithZero(value) {
        var prefix = value < 10 ? '0' : '';
        return prefix + value
      }

      return prefixWithZero(aMoment.hours()) + ':' + prefixWithZero(aMoment.minutes()) + ':' + prefixWithZero(aMoment.seconds());
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
