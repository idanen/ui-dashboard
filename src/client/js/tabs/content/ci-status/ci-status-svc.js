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
    angular.module('tabs')
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

    CiStatusService.$inject = ['$http', 'Ref', '$firebaseObject', '$firebaseArray', '$stateParams', 'ENV'];
    function CiStatusService($http, ref, $firebaseObject, $firebaseArray, $stateParams, ENV) {
        this._jobsUrl = '//' + ENV.HOST + ':' + ENV.PORT;
        this._jobsRef = ref.child('allJobs');
        this._statusRef = ref.child('ciStatus');
        this._mastersRef = this._statusRef.child('masters');
        this._teamsRef = this._statusRef.child('teams');
        this.$http = $http;
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;
    }

    CiStatusService.prototype = {
        getJobs: function (group) {
            return this.$firebaseArray(group ? this._statusRef.child(group) : this._statusRef.child('masters'));
        },
        getJob: function (jobId, teamId) {
            if (teamId) {
                return this.$firebaseObject(this._teamsRef.child(teamId).child(jobId));
            }

            return this.$firebaseObject(this._mastersRef.child(jobId));
        },
        getJobByName: function (jobName) {
            return this.$firebaseObject(this._jobsRef.child(jobName));
        },
        addJob: function (toAdd) {
            return this.$http.post(this._jobsUrl + '/addJob', toAdd)
                .then(this._processResponse);
        },
        loadJobs: function () {
            return this.$http.get(this._jobsUrl + '/loadJobs')
                .then(this._processResponse);
        },
        _processResponse: function (response) {
            return response.data;
        }
    };

})(window.angular);
