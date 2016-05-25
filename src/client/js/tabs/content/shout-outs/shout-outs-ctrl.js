(function () {
  'use strict';

  angular.module('ci-site').controller('ShoutOutsCtrl', ShoutOutsController);

  ShoutOutsController.$inject = ['ShoutOutsService', 'DATE_FORMAT'];

  function ShoutOutsController(ShoutOutsService, DATE_FORMAT) {
    this.toShout = '';
    this.service = ShoutOutsService;
    this.shouts = ShoutOutsService.shoutouts;
    this.dateFormat = DATE_FORMAT;
  }

  ShoutOutsController.prototype = {
    shout: function () {
      if (this.toShout) {
        this.service.addShout(this.toShout);
        this.toShout = '';
      }
    }
  };
})();
