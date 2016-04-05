module.exports = (function () {
  'use strict';

  var Promise = require('promise'),
      request = require('request-promise');

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
    fetch: function (uri) {
      var options = _.extend({}, this.options);
      options.uri = this.options.baseUrl + uri;
      options.qs = this.options.params;

      return request(options);
    },
    save: function (uri, data, newObject) {
      var options = _.extend({}, this.options);
      options.method = newObject ? 'POST' : 'PUT';
      options.uri = this.options.baseUrl + uri;
      options.qs = this.options.params;
      options.body = data;

      return request(options);
    }
  };

  return RestService;
}());
