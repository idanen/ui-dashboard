(function () {
  'use strict';

  angular.module('ci-site')
      .directive('ngTap', ngTapFactory);

  function ngTapFactory() {
    return {
      restrict: 'A',
      scope: {
        'ngTap': '&'
      },
      link: linkFn
    };

    function linkFn($scope, $element) {
      let toAttach = [
        {
          event: 'tap',
          element: $element[0],
          listener: e => {
            $scope.$applyAsync(() => $scope.ngTap(e));
          }
        }
      ];
      toAttach.forEach(attach => {
        attach.element.addEventListener(attach.event, attach.listener);
      });

      $element.on('$destroy', () => toAttach.forEach(attach => attach.element.removeEventListener(attach.event, attach.listener)));
    }
  }
})();
