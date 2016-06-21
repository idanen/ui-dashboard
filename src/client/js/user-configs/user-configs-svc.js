(function () {
  'use strict';

  angular.module('ci-site')
      .service('userConfigs', UserConfigs);

  UserConfigs.$inject = ['Ref', '$firebaseObject', '$firebaseAuth'];
  function UserConfigs(Ref, $firebaseObject, $firebaseAuth) {
    this.$firebaseObject = $firebaseObject;
    this.globalConfigRef = Ref.child('config/global');
    this.configsRef = Ref.child('config');
    this.authChangeListeners = [];

    $firebaseAuth().$onAuthStateChanged((authState) => {
      if (authState) {
        this.configsRef = Ref.child('config').child(authState.uid);
      } else {
        this.configsRef = null;
      }
      this.authChangeListeners.forEach((listener) => {
        if (_.isFunction(listener)) {
          listener(this.configsRef);
        }
      });
    });
  }

  UserConfigs.prototype = {
    getGlobalConfig: function () {
      return this.$firebaseObject(this.globalConfigRef);
    },
    getUserConfig: function () {
      if (this.configsRef) {
        return this.$firebaseObject(this.configsRef);
      }

      return null;
    },
    registerForAuthChange: function (listener) {
      this.authChangeListeners.push(listener);
    }
  };
}());
