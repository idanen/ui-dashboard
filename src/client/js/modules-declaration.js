(function () {
    'use strict';

    angular.module('ci-site.filters', []);
    angular.module('ci-site', ['firebase', 'ngAnimate', 'ngSanitize', 'ngResource', 'ui.router', 'ui.select', 'ui.bootstrap', 'angular-ladda', 'ngclipboard', 'LocalStorageModule', 'ci-site.filters', 'collapsiblePanel'])
        .constant('ENV', {
          PROTOCOL: 'http',
          HOST: 'cidashboard.hpe.guru',
          //HOST: 'localhost',
          PORT: '4000'
        })
        .constant('JENKINS_BASE_URL', 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/')
        .constant('DATE_FORMAT', 'HH:mm dd/MM/yyyy')
        .constant('DEFAULT_JOB_NAME', 'MaaS-SAW-USB-master')
        .constant('MOCKAROO_API_KEY', '921088f0')
        .constant('NotificationTags', {
          PUSH_Q: 'PushQueueNotification',
          BRANCH_UPDATES: 'NotificationTagMasterMerge',
          BRANCH_OWNER_Q: 'BranchOwnerNotification'
        })
        .config(config)
        .run(initApp);
    angular.module('ui', ['ci-site']);

    config.$inject = ['$uibTooltipProvider', 'localStorageServiceProvider'];
    function config($uibTooltipProvider, localStorageServiceProvider) {
      $uibTooltipProvider.options({
        placement: 'bottom', appendToBody: true
      });
      localStorageServiceProvider
          .setPrefix('ciSite')
          .setStorageType('localStorage')
          .setNotify(false, false);
    }

    initApp.$inject = ['$rootScope', 'ShoutOutsService', 'localStorageService'];
    function initApp($rootScope, shoutOutsService, localStorageService) {
      let firstTimer = localStorageService.get('firstTimer');
      if (!firstTimer) {
        
      }
        shoutOutsService.init();

        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            console.log('$routeChangeError occurred', error);
            //event.preventDefault();
            //if (error === 'AUTH_REQUIRED') {
            //    $state.go('login');
            //}
        });
    }
})();
