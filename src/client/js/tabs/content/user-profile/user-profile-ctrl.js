(function () {
  'use strict';

  angular.module('ci-site')
      .controller('UserConfigsCtrl', UserConfigsController);

  UserConfigsController.$inject = ['userService', 'currentUser'];
  function UserConfigsController(userService, currentUser) {
    this.userService = userService;
    this.user = currentUser;
  }

  UserConfigsController.prototype = {

  };
}());

