var Promise = require('promise'),
    Firebase = require('firebase'),
    FirebaseService = require('./firebase-service.js'),
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
    this.firebase = new FirebaseService();
    //this.firebaseRef.authWithCustomToken(consts.FIREBASE_AUTH_TOKEN).then(function (error, authData) {
    //  if (error) {
    //    console.error(error);
    //  } else {
    //    console.log('Auth success: ' + authData);
    //  }
    //});
  }

  StatusUpdater.prototype = {
    getBuildStatus: function (buildName, buildNumber) {
      return this.jenkins.getBuild(buildName, buildNumber)
          .then(this.getRelevantBuilds.bind(this))
          .then(this.writeToDB.bind(this))
          .catch(function (error) {
            return Promise.reject(error);
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
    updateBuildStatus: function (group, jobDetails, isHead) {
      console.log('group: ' + group);
      console.log('jobDetails: ' + JSON.stringify(jobDetails));
      console.log('isHead: ' + isHead);
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
          .then(this.determineRefToUpdate.bind(this, group, jobDetails, isHead))
          .then(this.updateStatusInDB.bind(this));
    },
    determineRefToUpdate: function (group, buildStatus, isHead) {
      var buildName = buildStatus.name,
          buildParams = buildStatus.build.parameters,
          parentName, parentNumber;

      console.log('Updating ref of build named "' + buildName + '"');
      if (!buildParams || !buildParams.HEAD_JOB_NAME || !buildParams.HEAD_BUILD_NUMBER) {
        console.log('Canceled updating due to missing parameters');
        return;
      }

      parentName = buildParams.HEAD_JOB_NAME;
      parentNumber = buildParams.HEAD_BUILD_NUMBER;
      console.log('with parent build named "' + parentName + '" and number "' + parentNumber + '"');

      if (isHead) {
        console.log('HEAD of build -> updating "' + group + '/' + buildName + '"');
        return {
          isHead: true,
          ref: group + '/' + parentName + '/builds/' + parentNumber,
          phase: buildStatus.build.phase,
          result: buildStatus.build.status
        };
      }

      return {
        ref: group + '/' + parentName + '/builds/' + parentNumber + '/subBuilds/' + buildName,
        phase: buildStatus.build.phase,
        result: buildStatus.build.status
      };
    },
    updateStatusInDB: function (toUpdate) {
      var // firebaseRef = this.firebaseRef.child(toUpdate.ref),
          updateUri,
          rootBuildUpdate, rootBuildUri;

      if (!toUpdate) {
        return Promise.resolve();
      }

      updateUri = toUpdate.ref;

      delete toUpdate.ref;
      toUpdate.lastUpdate = Date.now();

      rootBuildUpdate = Promise.resolve(toUpdate);

      if (toUpdate.phase === 'COMPLETED') {
        return toUpdate;
      }

      if (toUpdate.phase === 'STARTED') {
        toUpdate.result = 'running';
      }

      // When updating the parent build also update the result in the build's root
      if (toUpdate.isHead) {
        delete toUpdate.isHead;
        rootBuildUri = updateUri.replace(/\/builds\/\d+\/?$/, '');
        rootBuildUpdate = this.firebase.update(rootBuildUri, {
          lastUpdate: toUpdate.lastUpdate,
          result: toUpdate.result
        });
      }

      console.log('Updating ref "' + updateUri + '" with data ' + JSON.stringify(toUpdate));
      return rootBuildUpdate
        .then(this.firebase.update.bind(this.firebase, updateUri, toUpdate));
      //return firebaseRef.update(toUpdate)
      //    .then(function (error) {
      //      if (error) {
      //        return Promise.reject(error);
      //      }
      //      return toUpdate;
      //    });
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
    },
    getAvailableGroups: function () {
      return this.firebase.fetch()
          .then(function (groups) {
            return Object.keys(groups);
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
    }
  };

  return StatusUpdater;
}());
