(function (angular, Firebase) {
    'use strict';

    angular.module('tabs').factory("FirebaseService", ["$firebaseArray",
        function ($firebaseArray) {

            // create a reference to the database where we will store our data
            var ref = new Firebase("https://boiling-inferno-9766.firebaseio.com/");
            var queueRef = ref.child('queue');
            var membersRef = ref.child('members');
            var jobsRef = ref.child('jobs');

            return {
                getQueue: function () {
                    return $firebaseArray(queueRef);
                },
                getMembers: function () {
                    return $firebaseArray(membersRef);
                },
                getOrigRecord: function (origRecordKey) {
                    return $firebaseArray(membersRef).$loaded(function (data) {
                        return data.$getRecord(origRecordKey);
                    });
                },
		getJobs: function(){
                    return $firebaseArray(jobsRef);
                }
            };
        }
    ]);
})(window.angular, window.Firebase);
