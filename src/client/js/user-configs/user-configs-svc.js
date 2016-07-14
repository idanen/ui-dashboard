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
    getGlobalConfig: function (configKey) {
      return this._getConfig(configKey, 'user');
    },
    getUserConfig: function (configKey) {
      return this._getConfig(configKey, 'user');
    },
    _getConfig: function (configKey, which = 'global') {
      let ref;
      switch (which) {
        case 'user':
          ref = this.configsRef;
          break;
        default:
          ref = this.globalConfigRef;
          break;
      }

      if (!configKey || !_.isString(configKey)) {
        return this.$firebaseObject(ref);
      }

      return this.$firebaseObject(this.configsRef.child(configKey));
    },
    registerForConfigsChanges: function (listener) {
      this.configsChangesListeners.push(listener);
    },
    getUnboundConfig: function (configKey) {
      if (configKey) {
        return this.$q.resolve(
            this.globalConfigRef
                .child(configKey)
                .once('value')
                .then(function (snap) {
                  return snap.val();
                })
        );
      }

      return this.$q.resolve(
          this.globalConfigRef
              .once('value')
              .then(function (snap) {
                return snap.val();
              })
      );
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
