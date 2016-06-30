(function () {
  'use strict';

  angular.module('ci-site')
      .directive('ciIsAdmin', isAdminDirectiveFactory);

  isAdminDirectiveFactory.$inject = ['userService'];
  function isAdminDirectiveFactory(userService) {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        let operation = $attrs.ciIsAdmin;
        userService.listenToAdminChanges((isAdmin) => {
          if (operation === 'disable') {
            if (isAdmin) {
              $element.removeAttr('disabled');
              $element.removeAttr('title');
            } else {
              $element.attr('disabled', 'disabled');
              $element.attr('title', 'Not permitted');
            }
          } else {
            let target = $element[0];
            if (isAdmin) {
              target.style.display = '';
            } else {
              target.style.display = 'none';
            }
          }
        });
      }
    };
  }
}());
