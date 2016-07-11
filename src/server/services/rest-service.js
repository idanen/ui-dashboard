module.exports = (function () {
  'use strict';

  var Promise = require('promise'),
      request = require('request-promise'),
      _ = require('lodash');

  function RestService(pOptions) {
    var options = {
      baseUrl: '',
      params: {},
      headers: {},
      json: true
    };
    this.options = _.extend(options, pOptions);
  }

  RestService.prototype = {
    fetch: function (uri, params) {
      var options = _.extend({}, this.options);
      options.uri = this.options.baseUrl + uri;
      options.qs = this.options.params;
      if (params) {
        options.qs = _.extend({}, options.qs, params);
      }

      delete options.baseUrl;

      return request(options);
    },
    save: function (uri, data, method, params) {
      var options = _.extend({}, this.options);
      options.method = RestService.WriteMethods[method.toUpperCase()] || 'PUT';
      options.uri = this.options.baseUrl + uri;
      options.qs = this.options.params;
      if (params) {
        options.qs = _.extend({}, options.qs, params);
      }
      options.body = data;

      delete options.baseUrl;

      return request(options);
    }
  };

  RestService.WriteMethods = {
    PUT: 'PUT',
    PATCH: 'PATCH',
    POST: 'POST'
  };

  return RestService;
}());
