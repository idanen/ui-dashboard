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
      return this.auth.login('password', this.remember, this.email, this.password, this.displayName)
        .then(this.postLogin.bind(this))
        .catch(function (error) {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        }.bind(this));
    },
    loginWithProvider: function (provider) {
      return this.auth.login(provider, this.remember)
        .then(this.postLogin.bind(this))
        .catch(function (error) {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        }.bind(this));
    },
    postLogin: function (user) {
      this.model = angular.extend({}, user, {displayName: this.displayName});
      return this.userService.saveUser(this.model)
        .then(this.close.bind(this));
    },
    cancel: function () {
      this.$uibModalInstance.dismiss('cancel');
    },
    close: function () {
      this.$uibModalInstance.close(this.model);
    }
  };
}());