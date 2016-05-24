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
    updateBuildStatus: function (jobDetails, isHead) {
      var toUpdate;
      console.log('Updating build status: isHead: ' + isHead + ', jobDetails: ' + JSON.stringify(jobDetails));
      toUpdate = this.determineRefToUpdate(jobDetails, isHead);
      return this.updateStatusInDB(toUpdate);
    },
    determineRefToUpdate: function (buildStatus, isHead) {
      var buildName = buildStatus.name,
          buildParams = buildStatus.build.parameters,
          group, parentName, parentNumber, branchName;

      console.log('Updating ref of build named "' + buildName + '"');
      if (!buildParams || !buildParams.HEAD_JOB_NAME || !buildParams.HEAD_BUILD_NUMBER) {
        console.log('Canceled updating due to missing parameters');
        return;
      }

      parentName = buildParams.HEAD_JOB_NAME;
      parentNumber = buildParams.HEAD_BUILD_NUMBER;
      group = this.isMastersGroup(buildParams) ? 'masters' : 'teams';
      branchName = buildParams.GIT_BRANCH;
      // Paths with '.' cannot be saved to Firebase.
      // Replacing here
      parentName = parentName.replace(/.+/g, '_');
      console.log('with parent build named "' + parentName + '" and number "' + parentNumber + '", group "' + group + '" (branch = ' + branchName + ')');

      if (isHead) {
        console.log('HEAD of build -> updating "' + group + '/' + buildName + '"');
        return {
          isHead: true,
          ref: group + '/' + parentName + '/builds/' + parentNumber,
          phase: buildStatus.build.phase,
          result: buildStatus.build.status,
          branchName: branchName
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
          rootBuildUpdate, rootBuildUri, group;

      if (!toUpdate) {
        return Promise.resolve();
      }

      updateUri = toUpdate.ref;
      group = updateUri.split('/')[0];

      delete toUpdate.ref;
      toUpdate.lastUpdate = Date.now();

      rootBuildUpdate = Promise.resolve(toUpdate);

      if (toUpdate.phase === 'COMPLETED') {
        return Promise.resolve(toUpdate);
      }

      if (toUpdate.phase === 'STARTED') {
        toUpdate.result = 'running';
      }

      // When updating the parent build also update the result in the build's root
      if (toUpdate.isHead) {
        delete toUpdate.isHead;
        rootBuildUri = updateUri.replace(/\/builds\/\d+\/?$/, '');
        console.log('Updating HEAD ref "' + rootBuildUri + '" with data ' + JSON.stringify(toUpdate));
        rootBuildUpdate = this.firebase.update(rootBuildUri, {
          lastUpdate: toUpdate.lastUpdate,
          result: toUpdate.result,
          group: group
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
    },
    isMastersGroup: function (buildParams) {
      return buildParams && buildParams.GIT_BRANCH === 'master' || /generic$/i.test(buildParams.HEAD_JOB_NAME) || /^release-\d+.\d+$/i.test(buildParams.GIT_BRANCH);
    }
  };

  return StatusUpdater;
}());
