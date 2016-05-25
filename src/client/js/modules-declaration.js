(function () {
    'use strict';

    angular.module('tabs', ['firebase', 'ngAnimate', 'ngSanitize', 'ngResource', 'ui.router', 'ui.select', 'ui.bootstrap', 'angular-ladda', 'ngclipboard', 'ui-dash.filters', 'collapsiblePanel'])
        .constant('ENV', {
            HOST: 'myd-vm08383.hpswlabs.adapps.hp.com',
            //HOST: 'localhost',
            PORT: '4000'
        })
        .constant('JENKINS_BASE_URL', 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/')
        .constant('DATE_FORMAT', 'HH:mm dd/MM/yyyy')
        .constant('NotificationTags', {
          PUSH_Q: 'PushQueueNotification',
          BRANCH_OWNER_Q: 'BranchOwnerNotification'
        })
        .config(config)
        .run(initApp);
    angular.module('ui', ['tabs']);

    config.$inject = ['$uibTooltipProvider'];
    function config($uibTooltipProvider) {
      $uibTooltipProvider.options({
        placement: 'bottom', appendToBody: true
      });
    }

    initApp.$inject = ['$rootScope', '$state', 'ShoutOutsService'];
    function initApp($rootScope, $state, shoutOutsService) {
        shoutOutsService.init();

        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            console.log(error);
            //event.preventDefault();
            //if (error === 'AUTH_REQUIRED') {
            //    $state.go('login');
            //}
        });
    }
})();
