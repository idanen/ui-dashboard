module.exports = (function () {
  'use strict';

  var Promise = require('promise'),
      request = require('request');

  function RestService(credentials) {
    this.credentials = credentials;
  }

  RestService.prototype = {
    fetch: function (url) {
      return new Promise(function (resolve, reject) {
        var options = {
          url: url
        };
        if (this.credentials) {
          options.headers = {
            Authorization: 'Basic ' + this.credentials
          };
        }
        request.get(options, handleResponse);

        function handleResponse(error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        }
      }.bind(this));
    },
    update: function (url, data) {
      return new Promise(function (resolve, reject) {
        request.put({
          headers: {'content-type': 'application/json'},
          url: url,
          body: JSON.stringify(data)
        }, function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        });
      });
    }
  };

  return RestService;
}());
