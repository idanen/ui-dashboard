(function (angular) {
    'use strict';

    angular.module('tabs')
        .directive('usefulLinks', function () {
            return {
                restrict: 'E',
                controllerAs: 'shouter',
                controller: 'ShoutOutsCtrl',
                templateUrl: 'js/tabs/content/shout-outs/shout-outs-tmpl.html'
            };
        });
})(window.angular);
