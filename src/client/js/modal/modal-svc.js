(function () {
  'use strict';

  angular.module('tabs')
    .service('modalService', ModalService);

  ModalService.$inject = ['$uibModal'];
  function ModalService($uibModal) {
    this.$uibModal = $uibModal;
  }

  ModalService.prototype = {
    open: function (options) {

    }
  };
}());
