(function (angular) {
    'use strict';

    angular.module('ci-site')
        .directive('shoutOuts', function () {
            return {
                restrict: 'E',
                controllerAs: 'shouter',
                controller: 'ShoutOutsCtrl',
                templateUrl: 'js/tabs/content/shout-outs/shout-outs-tmpl.html'
            };
        });
})(window.angular);
