/**
 * Created by matarfa on 15/07/2015.
 */
(function (angular) {

    'use strict';

    /**
     * Filters out all duplicate items from an array by checking the specified key
     * @param [key] {string} the name of the attribute of each object to compare for uniqueness
     if the key is empty, the entire object will be compared
     if the key === false then no filtering will be performed
     * @return {array}
     */
    angular.module('ci-site')
        .service('ciStatusService', CiStatusService);

    CiStatusService.$inject = ['$http', '$q', 'Ref', '$firebaseObject', '$firebaseArray', 'ENV', 'DEFAULT_JOB_NAME'];
    function CiStatusService($http, $q, ref, $firebaseObject, $firebaseArray, ENV, DEFAULT_JOB_NAME) {
        this._jobsUrl = '//' + ENV.HOST + ':' + ENV.PORT;
        this._jobsRef = ref.child('allJobs');
        this._statusRef = ref.child('ciStatus');
        this._mastersRef = this._statusRef.child('masters');
        this._teamsRef = this._statusRef.child('teams');
        this.$http = $http;
        this.$q = $q;
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;
        this.DEFAULT_JOB_NAME = DEFAULT_JOB_NAME;
    }

    CiStatusService.prototype = {
        getJobs: function (group = 'masters') {
            var ref = (group !== 'masters') ? this._statusRef.child(group) : this._statusRef.child(group);
            return this.$firebaseArray(ref);
        },
        getLastBuildNumber: function (group = 'masters', buildName = this.DEFAULT_JOB_NAME) {
            return this.$q((resolve) => {
                this._statusRef.child(group).child(buildName)
                    .child('builds')
                    .orderByKey()
                    .limitToLast(2)
                    .once('value', function (snapshot) {
                      let buildNumber = 0;
                      snapshot.forEach(function (innerSnapshot) {
                        if (innerSnapshot.val().result !== 'running') {
                          buildNumber = innerSnapshot.key;
                        }
                      });
                      resolve(buildNumber);
                    });
            });
        },
        getJob: function (jobId, group) {
            if (group) {
                return this.$firebaseObject(this._statusRef.child(group).child(jobId));
            }

            return this.$firebaseObject(this._mastersRef.child(jobId));
        },
        getJobBuilds: function (jobId, group = 'masters', limit = 10) {
            var startRef = this._getRef(jobId, group);

            if (limit && angular.isNumber(limit)) {
                return this.$firebaseArray(startRef.child('builds').orderByKey().limitToLast(limit));
            }

            return this.$firebaseArray(startRef.child('builds'));
        },
        getJobSubBuilds: function (jobId, jobNumber, group) {
            var startRef = this._getRef(jobId, group);

            return this.$firebaseArray(startRef.child('builds').child(jobNumber).child('subBuilds'));
        },
        getRunningSubBuilds: function (jobId, jobNumber, group) {
            var buildRef = this._getRef(jobId, group);

            return this.$firebaseArray(buildRef.child('builds').child(jobNumber).child('subBuilds').orderByChild('result').equalTo('running'));
        },
        getDefaultBuild: function () {
          return this.$q((resolve) => {
            this._statusRef
                .child('masters')
                .child(this.DEFAULT_JOB_NAME)
                .child('builds')
                .orderByKey()
                .limitToLast(1)
                .once('child_added', (snap) => {
                  resolve({
                    group: 'masters',
                    name: this.DEFAULT_JOB_NAME,
                    number: snap.key
                  });
                });
          });
        },
        getJobByName: function (jobName) {
            return this.$firebaseObject(this._jobsRef.child(jobName));
        },
        addBuildNumber: function (buildName, newBuildNumber, group = 'masters') {
            var newBuild = {};
            newBuild[newBuildNumber] = {
                result: 'UNKNOWN',
                lastUpdate: Date.now()
            };
            return this.$q((resolve) => {
                this._statusRef.child(group).child(buildName).child('builds').update(newBuild, () => {
                    resolve(newBuild);
                });
            });
        },
        _getRef: function (jobId, group) {
            if (group) {
                return this._statusRef.child(group).child(jobId);
            }

            return this._mastersRef.child(jobId);
        }
    };

})(window.angular);
