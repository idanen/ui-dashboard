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
        .filter('unique', function () {
            return function (items, filterOn) {

                if (filterOn === false) {
                    return items;
                }

                if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                    var newItems = [];

                    var extractValueToCompare = function (item) {
                        if (angular.isObject(item) && angular.isString(filterOn)) {
                            return item[filterOn];
                        } else {
                            return item;
                        }
                    };

                    angular.forEach(items, function (item) {
                        var isDuplicate = false;

                        for (var i = 0; i < newItems.length; i++) {
                            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate) {
                            newItems.push(item);
                        }

                    });
                    items = newItems;
                }
                return items;
            };
        })
        .service('ciStatusService', CiStatusService);

    CiStatusService.$inject = ['$http', '$q', 'Ref', '$firebaseObject', '$firebaseArray', 'ENV'];
    function CiStatusService($http, $q, ref, $firebaseObject, $firebaseArray, ENV) {
        this._jobsUrl = '//' + ENV.HOST + ':' + ENV.PORT;
        this._jobsRef = ref.child('allJobs');
        this._statusRef = ref.child('ciStatus');
        this._mastersRef = this._statusRef.child('masters');
        this._teamsRef = this._statusRef.child('teams');
        this.$http = $http;
        this.$q = $q;
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;
    }

    CiStatusService.prototype = {
        getJobs: function (group = 'masters') {
            var ref = (group !== 'masters') ? this._statusRef.child(group) : this._statusRef.child(group);
            return this.$firebaseArray(ref);
        },
        getLastBuildNumber: function (group = 'masters', buildName = 'MaaS-SAW-USB-master') {
            return this.$q((resolve) => {
                this._statusRef.child(group).child(buildName)
                    .child('builds')
                    .orderByKey()
                    .limitToLast(2)
                    .once('value', function (snapshot) {
                      let buildNumber = 0;
                      snapshot.forEach(function (innerSnapshot) {
                        if (innerSnapshot.val().result !== 'running') {
                          buildNumber = innerSnapshot.key();
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
                .child('MaaS-SAW-USB-master')
                .child('builds')
                .orderByKey()
                .limitToLast(1)
                .once('child_added', (snap) => {
                  resolve({
                    group: 'masters',
                    name: 'MaaS-SAW-USB-master',
                    number: snap.key()
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
        addJob: function (toAdd) {
            return this.$http.post(this._jobsUrl + '/addJob', toAdd)
                .then(this._processResponse);
        },
        loadJobs: function () {
            return this.$http.get(this._jobsUrl + '/loadJobs')
                .then(this._processResponse);
        },
        getBuildStatus: function (buildName) {
            return this.$http.get(`${this._jobsUrl}/buildStatus/${buildName}`)
                .then(this._processResponse);
        },
        _processResponse: function (response) {
            return response.data;
        },
        _getRef: function (jobId, group) {
            if (group) {
                return this._statusRef.child(group).child(jobId);
            }

            return this._mastersRef.child(jobId);
        }
    };

})(window.angular);
