(function (angular) {
    'use strict';

    angular.module('tabs')
        .directive('usefulLinks', function () {
            return {
                restrict: 'E',
                controllerAs: 'usefulLinksCtrl',
                controller: 'UsefulLinksCtrl',
                templateUrl: 'js/tabs/content/useful-links/useful-links-tmpl.html'
            };
        });
})(window.angular);
