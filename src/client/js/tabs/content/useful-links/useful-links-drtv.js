(function (angular) {
    'use strict';

    angular.module('ci-site')
        .directive('usefulLinks', function () {
            return {
                restrict: 'E',
                controllerAs: 'usefulLinksCtrl',
                controller: 'UsefulLinksCtrl',
                templateUrl: 'js/tabs/content/useful-links/useful-links-tmpl.html'
            };
        });
})(window.angular);
