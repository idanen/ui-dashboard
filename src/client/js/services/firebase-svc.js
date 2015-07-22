(function (angular, Firebase) {
    'use strict';

    angular.module('tabs').factory("FirebaseService", ["$firebaseArray",
        function ($firebaseArray) {

            // create a reference to the database where we will store our data
            var ref = new Firebase("https://boiling-inferno-9766.firebaseio.com/");
            var queueRef = ref.child('queue');
            var membersRef = ref.child('members');

            return {
                getQueue: function () {
                    return $firebaseArray(queueRef);
                },
                getMembers: function () {
                    return $firebaseArray(membersRef);
                }
            };
        }
    ]);
})(window.angular, window.Firebase);
