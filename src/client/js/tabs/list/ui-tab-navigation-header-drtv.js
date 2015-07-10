
'use strict';

angular.module('tabs').directive('uiTabNavigationHeader', [function () {
    return {
        restrict: 'E',
        templateUrl: 'js/tabs/list/ui-tab-navigation-header-tmpl.html',
        link: function (scope) {

            // if this is the first tab - make it active
            if (scope.$index === 0) {

                // the element is not yet interpolated here, by now, from some reason
                scope.$applyAsync(function () {
                    scope.selectTab(0);
                });
            }
        }
    };
}]);