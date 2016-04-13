(function () {
  'use strict';

  angular.module('tabs')
    .service('modalService', ModalService);

  ModalService.$inject = ['$uibModal'];
  function ModalService($uibModal) {
    this.$uibModal = $uibModal;

    this.defualts = {
      templateUrl: '/js/modal/modal-tmpl.html',
      bindToController: true,
      controllerAs: 'modalCtrl'
    };
  }

  ModalService.prototype = {
    open: function (pOptions) {
      var options = angular.extend({}, this.defualts, pOptions);

      return this.$uibModal.open(options);
    }
  };
}());
