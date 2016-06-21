(function () {
  'use strict';

  angular.module('ci-site')
      .service('userConfigs', UserConfigs);

  UserConfigs.$inject = ['Ref', '$firebaseObject', '$firebaseAuth', '$q'];
  function UserConfigs(Ref, $firebaseObject, $firebaseAuth, $q) {
    this.$firebaseObject = $firebaseObject;
    this.globalConfigRef = Ref.child('config/global');
    this.configsRef = Ref.child('config');
    this.$q = $q;
    this.configsChangesListeners = [];

    $firebaseAuth().$onAuthStateChanged((authState) => {
      if (authState) {
        this.userId = authState.uid;
        this.configsRef = Ref.child('config').child(this.userId);
      } else {
        this.userId = null;
        this.configsRef = null;
      }
      this.publishConfigsChanged();
    });
  }

  UserConfigs.prototype = {
    getGlobalConfig: function () {
      return this.$firebaseObject(this.globalConfigRef);
    },
    getUserConfig: function (configName) {
      if (!this.configsRef) {
        return;
      }

      if (!configName || !_.isString(configName)) {
        return this.$firebaseObject(this.configsRef);
      }

      return this.$firebaseObject(this.configsRef.child(configName));
    },
    registerForConfigsChanges: function (listener) {
      this.configsChangesListeners.push(listener);
    },
    publishConfigsChanged: function () {
      this.configsChangesListeners.forEach((listener) => {
        if (_.isFunction(listener)) {
          listener(this.userId);
        }
      });
    }
  };
}());
