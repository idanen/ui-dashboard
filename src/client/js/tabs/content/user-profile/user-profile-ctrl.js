(function () {
  'use strict';

  angular.module('ci-site')
      .controller('UserConfigsCtrl', UserConfigsController);

  UserConfigsController.$inject = ['$state', 'userService', 'authService', 'currentUser', '$scope'];
  function UserConfigsController($state, userService, authService, currentUser, $scope) {
    this.$state = $state;
    this.userService = userService;
    this.authService = authService;
    this.user = currentUser;
    this.$scope = $scope;
    this.isAnon = true;
    this.loginOpen = false;

    this.loginOptions = [
      {
        name: 'Log In',
        value: 'login'
      },
      {
        name: 'Sign Up',
        value: 'signup'
      },
      {
        name: 'Log In with Google',
        value: 'google'
      }
    ];
    this.selectedLoginOption = this.loginOptions[0].value;

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
      console.log('logging in');
    },
    loginWithProvider: function () {
      console.log('logging in with provider');
    },
    signup: function () {
      console.log('signing up');
    },
    logout: function () {
      this.authService.logout();
    },
    openLogin: function () {
      this.loginOpen = true;
    },
    closeLogin: function () {
      this.loginOpen = false;
    },
    changeLoginOption: function (loginOption) {
      this.$scope.$applyAsync(() => this.selectedLoginOption = loginOption);
      console.log(this.selectedLoginOption);
    }
  };
}());

