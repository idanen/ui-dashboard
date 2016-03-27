(function () {
  angular.module('tabs')
    .service('authService', AuthService);

  AuthService.$inject = ['Ref', '$firebaseAuth', 'userService'];
  function AuthService(Ref, $firebaseAuth, userService) {
    this.authObj = $firebaseAuth(Ref);
    this.userService = userService;
  }

  AuthService.prototype = {
    login: function (provider, user, password) {
      switch (provider) {
        case 'google':
        case 'facebook':
        case 'twitter':
          return this.authObj.$authWithOAuthPopup(provider)
              .then(this.saveUser.bind(this));
          break;
        case 'password':
          return this.authObj.$authWithPassword({
            email: user,
            password: password
          });
          break;
        default:
          break;
      }
    },
    saveUser: function (authUserData) {
      return this.userService.saveUser(authUserData);
    }
  };
}());