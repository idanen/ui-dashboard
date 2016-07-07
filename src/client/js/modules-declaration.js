(function () {
    'use strict';

    angular.module('ci-site.filters', []);
    angular.module('ci-site', ['firebase', 'ngAnimate', 'ngSanitize', 'ngResource', 'ui.router', 'ui.select', 'ui.bootstrap', 'angular-ladda', 'ngclipboard', 'ci-site.filters', 'collapsiblePanel'])
        .constant('ENV', {
          PROTOCOL: 'http',
          HOST: 'cidashboard.hpe.guru',
          // HOST: 'localhost',
          PORT: '4000'
        })
        .constant('JENKINS_BASE_URL', 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/')
        .constant('DATE_FORMAT', 'HH:mm dd/MM/yyyy')
        .constant('DEFAULT_JOB_NAME', 'MaaS-SAW-USB-master')
        .constant('GENERIC_JOB_NAME', 'MaaS-SAW-USB-generic')
        .constant('IMAGE_GENERATOR_URL', 'https://robohash.org/')
        .constant('NAME_GENERATOR_URL', 'https://www.mockaroo.com/api/generate.json?key=921088f0')
        .constant('NotificationTags', {
          PUSH_Q: 'PushQueueNotification',
          BRANCH_UPDATES: 'NotificationTagMasterMerge',
          BRANCH_OWNER_Q: 'BranchOwnerNotification'
        })
        .config(config)
        .run(initApp);
    angular.module('ui', ['ci-site']);

    config.$inject = ['$uibTooltipProvider'];
    function config($uibTooltipProvider) {
      $uibTooltipProvider.options({
        placement: 'bottom', appendToBody: true
      });
    }

    initApp.$inject = ['$rootScope', '$q', '$window', 'ShoutOutsService', 'authService', 'mockData', 'userService'];
    function initApp($rootScope, $q, $window, shoutOutsService, authService, mockData, userService) {
      let unregisterAuthChanges = $window.firebase.auth().onAuthStateChanged(authData => {
        if (!authData) {
          authService.loginAnonymous()
              .then((authData) => {
                console.log('first timer logged in anonymously', authData);
                return $q.all([authData, mockData.getNameAndImg()]);
              })
              .then((userData) => {
                var user = _.extend({uid: userData[0].uid, anonymous: true}, userData[1]);
                return userService.saveAnonymousUser(user);
              });
        }

        unregisterAuthChanges();
      });

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
