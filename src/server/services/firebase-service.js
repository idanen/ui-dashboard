module.exports = (function () {
  var RestService = require('./rest-service.js'),
      consts = require('../config/consts.js');

  function FirebaseService() {
    this.rest = new RestService({
      baseUrl: consts.FIREBASE_URL_CI_STATUS + '/',
      params: {
        auth: consts.FIREBASE_AUTH_TOKEN
      }
    });
  }

  FirebaseService.prototype = {
    fetch: function (ref, params) {
      return this.rest.fetch((ref || '') + consts.FIREBASE_REST_SUFFIX, params);
    },
    update: function (ref, data, params) {
      return this.rest.save((ref || '') + consts.FIREBASE_REST_SUFFIX, data, RestService.WriteMethods.PATCH, params);
    }
  };

  return FirebaseService;
}());
