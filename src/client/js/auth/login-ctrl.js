(function () {
  'use strict';

  angular.module('ui')
    .controller('LoginCtrl', LoginController);

  LoginController.$inject = ['$uibModalInstance', 'authService', 'userService'];
  function LoginController($uibModalInstance, authService, userService) {
    this.$uibModalInstance = $uibModalInstance;
    this.auth = authService;
    this.userService = userService;
    this.innerTemplateUrl = '/js/auth/login-tmpl.html';
    this.title = 'Please login';
  }

  LoginController.prototype = {
    login: function () {
      return this.auth.login('password', this.email, this.password)
        .then(this.postLogin.bind(this))
        .catch((error) => {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        });
    },
    loginWithProvider: function (provider) {
      return this.auth.login(provider)
        .then(this.postLogin.bind(this))
        .catch((error) => {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        });
    },
    postLogin: function (user) {
      let profile = user.providerData[0];
      this.model = angular.extend({}, user, {
        displayName: this.displayName || profile.email,
        email: profile.email
      });
      return this.close();
    },
    cancel: function () {
      this.$uibModalInstance.dismiss('cancel');
    },
    close: function () {
      return this.$uibModalInstance.close(this.model);
    }
  };
}());