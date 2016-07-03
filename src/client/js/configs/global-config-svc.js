(function () {
  'use strict';

  angular.module('ci-site')
      .service('globalConfig', GlobalConfigService);

  GlobalConfigService.$inject = ['Ref', '$firebaseObject'];
  function GlobalConfigService(Ref, $firebaseObject) {
    this.configRef = Ref.child('config/global');
    this.$firebaseObject = $firebaseObject;
  }

  GlobalConfigService.prototype = {
    getGlobalConfig: function () {
      return this.$firebaseObject(this.configRef);
    }
  };
}());
