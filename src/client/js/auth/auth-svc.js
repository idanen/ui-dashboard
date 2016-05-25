(function () {
  'use strict';

  angular.module('tabs')
      .constant('GOOGLE_AUTH_SCOPES', 'profile,email,https://www.googleapis.com/auth/plus.login,https://www.googleapis.com/auth/plus.profile.emails.read')
      .service('authService', AuthService);

  AuthService.$inject = ['Ref', '$firebaseAuth', 'userService', 'GOOGLE_AUTH_SCOPES'];
  function AuthService(Ref, $firebaseAuth, userService, GOOGLE_AUTH_SCOPES) {
    this.authObj = $firebaseAuth(Ref);
    this.userService = userService;
    this.GOOGLE_AUTH_SCOPES = GOOGLE_AUTH_SCOPES;
  }

  AuthService.prototype = {
    login: function (provider, remember, user, password, displayName) {
      switch (provider) {
        case 'google':
          return this.authObj.$authWithOAuthPopup(provider, {
              remember: remember ? 'default' : 'sessionOnly',
              scope: this.GOOGLE_AUTH_SCOPES
            })
              .then(this.saveUser.bind(this));
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
            })
              .then(this.saveUser.bind(this));
        default:
          return this.authObj.$authAnonymously();
      }
    },
    saveUser: function (authUserData) {
      authUserData.email = authUserData[authUserData.provider].email;
      authUserData.displayName = authUserData[authUserData.provider].displayName || authUserData.email;
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