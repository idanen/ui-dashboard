(function (Firebase) {
    'use strict';

    angular
        .module('tabs')
        .constant('FB_URL', 'https://boiling-inferno-9766.firebaseio.com/')
        .factory('Ref', refFactory);

    refFactory.$inject = ['FB_URL'];
    function refFactory(FB_URL) {
        return new Firebase(FB_URL);
    }
}(window.Firebase));
