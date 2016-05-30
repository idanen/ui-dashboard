(function (angular) {
    'use strict';

    angular.module('ui')
        .directive('uiFacade', uiFacadeDirectiveFactory);

    function uiFacadeDirectiveFactory() {
        return {
            restrict: 'E',
            templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
            controller: 'UiFacadeCtrl',
            controllerAs: 'facade',
            link: function ($scope, $element, $attrs, $ctrl) {
              $scope.$on('$stateChangeSuccess', $ctrl.closeDrawer.bind($ctrl));
            }
        };
    }
})(window.angular);
