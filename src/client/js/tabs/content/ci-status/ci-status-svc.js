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

    CiStatusService.$inject = ['$http', 'FirebaseService', 'ENV'];
    function CiStatusService($http, FirebaseService, ENV) {
        this._jobsUrl = '//' + ENV.HOST + ':' + ENV.PORT;
        this._jobsRef = FirebaseService.getJobs();
        this.$http = $http;
    }

    CiStatusService.prototype = {
        getJobs: function () {
            return this._jobsRef;
        },
        getJobByName: function (jobName) {
            return this._jobsRef[jobName];
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
