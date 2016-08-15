var Promise = require('promise'),
    FirebaseService = require('./firebase-service.js'),
    consts = require('../config/consts.js'),
    JenkinsService = require('./jenkins-service.js');

module.exports = (function () {
  'use strict';

  function StatusUpdater() {
    this.jenkins = new JenkinsService();
    this.statusToColor = {
      SUCCESS: 'blue',
      FAILED: 'red',
      'default': 'yellow'
    };
    this.firebase = new FirebaseService();
  }

  StatusUpdater.prototype = {
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
      parentName = parentName.replace(/\.+/g, '_');
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

      buildName = buildName.replace(/\.+/g, '_');
      return {
        ref: group + '/' + parentName + '/builds/' + parentNumber + '/subBuilds/' + buildName,
        phase: buildStatus.build.phase,
        result: buildStatus.build.status
      };
    },
    updateStatusInDB: function (toUpdate) {
      var updateUri,
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
    fetchOldBuildsIds: function (group, buildName, threshold) {
      return this.firebase.fetch(group + '/' + buildName + '/builds', {
          shallow: true
        })
          .then(this._cutOldBuilds.bind(this, threshold));
    },
    deleteBuildStatuses: function (group, buildName, buildIdsToDelete) {
      var deletionPatch = {};
      buildIdsToDelete.map(function (buildId) {
        deletionPatch[buildId] = null;
      });

      return this.firebase.update(group + '/' + buildName + '/builds', deletionPatch);
    },
    _cutOldBuilds: function (threshold, builds) {
      var buildIds;

      if (!builds) {
        return Promise.resolve([]);
      }

      buildIds = Object.keys(builds);
      if (buildIds.length < threshold) {
        return Promise.resolve([]);
      }

      return buildIds.slice(0, buildIds.length - (threshold || 100));
    },
    isMastersGroup: function (buildParams) {
      return buildParams && buildParams.GIT_BRANCH === 'master' || /generic$/i.test(buildParams.HEAD_JOB_NAME) || /^release-\d+.\d+$/i.test(buildParams.GIT_BRANCH);
    }
  };

  return StatusUpdater;
}());
