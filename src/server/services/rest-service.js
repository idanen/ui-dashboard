module.exports = (function () {
  var Promise = require('promise'),
      request = require('request');

  function RestService() {
  }

  RestService.prototype = {
    fetch: function (url) {
      return new Promise(function (resolve, reject) {
        request.get(url, function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        });
      });
    },
    update: function (url, data) {
      return new Promise(function (resolve, reject) {
        request.patch({
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
