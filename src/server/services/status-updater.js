var Promise = require('Promise'),
    Firebase = require('firebase'),
    consts = require('../config/consts.js'),
    JenkinsService = require('./jenkins-service.js'),
    RestService = require('./rest-service.js');

module.exports = (function () {
  'use strict';

  function StatusUpdater(interval) {
    this.jenkins = new JenkinsService();
    this.interval = interval || 1000 * 60 * 60;
    this.rest = new RestService();
    this.firebaseRef = new Firebase(consts.FIREBASE_URL_CI_STATUS);
    this.statusToColor = {
      SUCCESS: 'blue',
      FAILED: 'red',
      'default': 'yellow'
    };
  }

  StatusUpdater.prototype = {
    getAvailableGroups: function () {
      return this.rest.fetch(consts.FIREBASE_URL_CI_STATUS + consts.FIREBASE_REST_SUFFIX).then(function (data) {
        return Object.keys(data);
      });
    },
    getBuildStatus: function (buildName, buildNumber) {
      return this.jenkins.getBuild(buildName, buildNumber)
          .then(this.getRelevantBuilds.bind(this))
          .then(this.writeToDB.bind(this))
          .catch(function (error) {
            return Promise.reject(error);
          });
    },
    validateGroup: function (group) {
      return this.getAvailableGroups()
          .then(function (groups) {
            if (groups.indexOf(group) < 0) {
              return Promise.reject('Group "' + group + '" is not tracked');
            }
            return groups;
          });
    },
    updateBuildStatus: function (group, jobStatus) {
      console.log('group: ' + group);
      console.log('jobStatus: ' + jobStatus);
      if (!group) {
        return Promise.reject('No group was supplied');
      }
      return this.validateGroup(group)
          .then(function () {
            console.log(groups);
            if (groups.indexOf(group) < 0) {
              return Promise.reject('Group "' + group + '" is not tracked');
            }
            return groups;
          })
          .then();
    },
    getRelevantBuilds: function (buildDetails) {
      var promises = [];
      promises.push(this.jenkins.getBuildType(buildDetails.name, JenkinsService.BuildTypes.lastCompleted));
      if (buildDetails[JenkinsService.BuildTypes.last].number !== buildDetails[JenkinsService.BuildTypes.lastCompleted].number) {
        promises.push(this.jenkins.getBuildType(buildDetails.name, JenkinsService.BuildTypes.last));
      }
      if (buildDetails[JenkinsService.BuildTypes.lastSuccessful].number !== buildDetails[JenkinsService.BuildTypes.lastCompleted].number) {
        promises.push(this.jenkins.getBuildType(buildDetails.name, JenkinsService.BuildTypes.lastSuccessful));
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
          buildStatus.number = branchInfo.number;
          if ((branchInfo.number === parentDetails[JenkinsService.BuildTypes.last].number) && parentDetails[JenkinsService.BuildTypes.last].number !== parentDetails[JenkinsService.BuildTypes.lastCompleted].number) {
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
    updateStatusInDB: function (group, status) {
      var groupRef = this.firebaseRef.child(group),
          updateTime = Date.now();


    },
    writeToDB: function (builds) {
      var mastersRef = this.firebaseRef.child('masters'),
          updateTime = Date.now(),
          updatePromises, buildRef;

      if (!builds || !builds.length) {
        return;
      }

      updatePromises = [];
      buildRef = mastersRef.child(builds[0].name);
      builds.forEach(function (build) {
        var buildForDB = {
          icon: build.status,
          result: build.result,
          running: build.building || false,
          duration: build.duration,
          lastUpdate: updateTime
        };
        var updatePromise = buildRef.child('builds').child(build.number).set(buildForDB)
          .then(function (error) {
            if (error) {
              return Promise.reject(error);
            }
            return buildForDB;
          });

        updatePromises.push(updatePromise);
      }, this);
      // Update lastUpdated field
      updatePromises.push(buildRef.child('lastUpdate').set(updateTime));
      return Promise.all(updatePromises);
    }
  };

  return StatusUpdater;
}());
