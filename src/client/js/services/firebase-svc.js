(function (angular, Firebase) {
    'use strict';

    angular.module('tabs').factory('FirebaseService', ['$firebaseArray', '$firebaseObject', '$q',
        function ($firebaseArray, $firebaseObject, $q) {

            // create a reference to the database where we will store our data
            var ref = new Firebase("https://boiling-inferno-9766.firebaseio.com/"),
                queueRef = ref.child('queue'),
                membersRef = ref.child('members'),
                jobsRef = ref.child('allJobs'),
                linksRef = ref.child('usefulLinks'),
                shoutoutsRef = ref.child('shoutouts'),
                masterArrRef = ref.child('master'),
                boundMasterArr = $firebaseArray(masterArrRef),
                boundMasterStatus = {};

            return {
                getQueue: function () {
                    return $firebaseArray(queueRef);
                },
                getMembers: function () {
                    return $firebaseArray(membersRef);
                },
                getLinks: function () {
                    return $firebaseArray(linksRef);
                },
                getOrigRecord: function (origRecordKey) {
                    return $firebaseArray(membersRef).$loaded(function (data) {
                        return data.$getRecord(origRecordKey);
                    });
                },
                getShoutOuts: function () {
                    return $firebaseArray(shoutoutsRef);
                },
                getJobs: function () {
                    return $firebaseObject(jobsRef);
                },
                getMaterStatus: function () {
                    if ('lastUpdateTime' in boundMasterStatus) {
                        return boundMasterStatus;
                    }
                    return $q(function (resolve, reject) {
                        $q.when(boundMasterArr.$loaded())
                            .then(function (arr) {
                                if (arr.length === 0) {
                                    return $q.when(boundMasterArr.$add({
                                        lastUpdateTime: new Date(1970, 0, 1).getTime()
                                    }));
                                }
                                return arr.$ref().child(arr[0].$id);
                            })
                            .then(function (ref) {
                                //var id = ref.key();
                                //console.log('master status object is created with id: ' + id);
                                boundMasterStatus = $firebaseObject(ref);
                                return boundMasterStatus;
                            })
                            .then(function (boundMasterStatus) {
                                return $q.when(boundMasterStatus.$loaded());
                            })
                            .then(function (loadedMasterStatus) {
                                boundMasterStatus = loadedMasterStatus;
                                return loadedMasterStatus;
                            })
                            .then(function (resolvedData) {
                                resolve(resolvedData);
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                    });
                }
            };
        }
    ]);
})(window.angular, window.Firebase);
