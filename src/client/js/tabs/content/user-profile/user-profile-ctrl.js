(function () {
  'use strict';

  angular.module('ci-site')
      .controller('UserConfigsCtrl', UserConfigsController);

  UserConfigsController.$inject = ['$state', 'userService', 'authService', 'currentUser'];
  function UserConfigsController($state, userService, authService, currentUser) {
    this.$state = $state;
    this.userService = userService;
    this.authService = authService;
    this.user = currentUser;
    this.isAnon = true;
    this.loginOpen = false;

    this.userService.onUserChange(user => {
      if (!user) {
        this.user = null;
        this.isAnon = false;
      } else {
        this.user = this.userService.getUser(user.uid);
        this.userService.isAnonymousUser(user.uid)
            .then(isAnonymous => this.isAnon = isAnonymous);
      }
    });
  }

  UserConfigsController.prototype = {
    login: function () {
      this.loginOpen = true;
    },
    logout: function () {
      this.authService.logout();
    },
    closeLogin: function () {
      this.loginOpen = false;
    }
  };
}());

