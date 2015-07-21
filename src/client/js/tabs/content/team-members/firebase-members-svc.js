'use strict';

angular.module('tabs').factory("MembersService", ["$firebaseArray",
    function ($firebaseArray) {

        // create a reference to the database where we will store our data
        var ref = new Firebase("https://boiling-inferno-9766.firebaseio.com/");
        var profileRef = ref.child('members');

        return $firebaseArray(profileRef);
    }
]);