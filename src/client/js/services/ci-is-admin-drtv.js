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

        let offAdminChange = userService.onAdminChange(listener);
        $element.on('$destroy', offAdminChange);

        function listener(isAdmin) {
          let target = $element[0];
          if (operation === 'disable') {
            if (isAdmin) {
              $element.removeAttr('disabled');
              $element.removeAttr('title');
              target.disabled = false;
            } else {
              $element.attr('disabled', 'disabled');
              $element.attr('title', 'Not permitted');
              target.disabled = true;
            }
          } else {
            if (isAdmin) {
              target.style.display = '';
            } else {
              target.style.display = 'none';
            }
          }
        }
      }
    };
  }
}());
