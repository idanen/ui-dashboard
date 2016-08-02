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
    linkToUser: function (isNew) {
      if (isNew) {
        this.$state.go('login', {newUser: true});
      } else {
        this.$state.go('login');
      }
    },
    logout: function () {
      this.authService.logout();
    }
  };
}());

