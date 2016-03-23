var Promise = require('Promise'),
    Firebase = require('firebase'),
    consts = require('../config/consts.js'),
    JenkinsService = require('./jenkins-service.js');

module.exports = (function () {
  'use strict';

  function StatusUpdater() {
    this.jenkins = new JenkinsService();
    this.firebaseRef = new Firebase(consts.FIREBASE_URL_CI_STATUS);
    this.statusToColor = {
      SUCCESS: 'blue',
      FAILED: 'red',
      'default': 'yellow'
    };
  }

  StatusUpdater.prototype = {
    getAvailableGroups: function () {
      return new Promise(function (resolve, reject) {
        this.firebaseRef.once('value', function (snap) {
          var data = snap.val();
          if (data) {
            resolve(Object.keys(snap.val()));
          }

          resolve([]);
        }, function (error) {
          reject(error);
        });
      }.bind(this));
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
              return Promise.reject(new Error('Group "' + group + '" is not tracked'));
            }
            return true;
          });
    },
    updateBuildStatus: function (group, jobDetails) {
      console.log('group: ' + group);
      console.log('jobDetails: ' + jobDetails);
      if (!group) {
        return Promise.reject(new Error('No group was supplied'));
      }
      return this.validateGroup(group)
          .then(function (valid) {
            console.log(valid);
            if (!valid) {
              return Promise.reject(new Error('Group "' + group + '" is not tracked'));
            }
            return group;
          })
          .then(function () {
            return jobDetails;
          });
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
