(function (Firebase) {
    'use strict';

    angular
        .module('tabs')
        .constant('FB_URL', 'https://boiling-inferno-9766.firebaseio.com/')
        .service('Ref', ['FB_URL', Firebase]);
}(window.Firebase));
