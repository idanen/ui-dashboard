(function () {
  'use strict';

  angular.module('tabs')
    .service('authService', AuthService);

  AuthService.$inject = ['Ref', '$firebaseAuth', 'userService'];
  function AuthService(Ref, $firebaseAuth, userService) {
    this.authObj = $firebaseAuth(Ref);
    this.userService = userService;
  }

  AuthService.prototype = {
    login: function (provider, remember, user, password, displayName) {
      switch (provider) {
        case 'google':
        case 'facebook':
        case 'twitter':
          return this.authObj.$authWithOAuthPopup(provider, remember ? 'default' : 'sessionOnly')
              .then(this.saveUser.bind(this));
        case 'password':
          return this.authObj.$authWithPassword({
            displayName: displayName || user,
            email: user,
            password: password,
            remember: remember ? 'default' : 'sessionOnly'
          });
        default:
          return this.authObj.$authAnonymously();
      }
    },
    saveUser: function (authUserData) {
      return this.userService.saveUser(authUserData);
    },
    logout: function () {
      return this.authObj.$unauth();
    },
    getLoggedUser: function () {
      return this.authObj.$getAuth();
    }
  };
}());