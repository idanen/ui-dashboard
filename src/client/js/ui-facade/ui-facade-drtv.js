(function (angular) {
    'use strict';

    angular.module('ui')
        .directive('uiFacade', uiFacadeDirectiveFactory);

    function uiFacadeDirectiveFactory() {
        return {
            restrict: 'E',
            templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
            controller: 'UiFacadeCtrl',
            controllerAs: 'facade'
        };
    }
})(window.angular);
