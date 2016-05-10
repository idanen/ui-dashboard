var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Promise = require('promise'),
    _ = require('lodash');

module.exports = (function () {
  'use strict';

  var mockTests = [{
    "_id": "56f7e7765144e267196966a1",
    "testFailed": true,
    "buildId": 1142,
    "branchName": "master",
    "category": "gate-keeper serial-test km social saw-sd ess-sh saw-il saw-il-jbehave ppm-sh saw-sh",
    "testClassName": "com.hp.ess.client.junit.tests.E2E.sanity.sacm.VendorManagementSanityTest",
    "exceptionStacktrace": "org.openqa.selenium.WebDriverException: Error communicating with the remote browser. It may have died.\nBuild info: version: '2.49.0', revision: '3d17e9b', time: '2016-02-11 13:53:54'\nSystem info: host: 'c578ed4b4c40', ip: '172.17.0.94', os.name: 'Linux', os.arch: 'amd64', os.version: '3.18.0-1.el6.elrepo.x86_64', java.version: '1.7.0_91'\nDriver info: driver.version: EventFiringWebDriver\nSession ID: caf4a8c8c934a46066542f457894fd4e\nCapabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]\nCommand duration or timeout: 257 milliseconds\nBuild info: version: '2.49.1', revision: '808c23b0963853d375cbe54b90bbd052e2528a54', time: '2016-01-21 09:37:52'\nSystem info: host: 'mydtbld0126', ip: '16.44.48.115', os.name: 'Linux', os.arch: 'amd64', os.version: '2.6.32-504.el6.x86_64', java.version: '1.7.0_10'\nSession ID: 534c2bbe-7636-40f7-91a6-cf37ae5c2e1d\nDriver info: com.hp.maas.platform.ui.test.selenium.wd.WebDriverFactory$ScreenshootingRemoteWebDriver\nCapabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, webdriver.remote.sessionid=534c2bbe-7636-40f7-91a6-cf37ae5c2e1d, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]\n",
    "testDuration": 0.2370000034570694,
    "errorMessage": "Error communicating with the remote browser. It may have died. Build info: version: '2.49.0', revision: '3d17e9b', time: '2016-02-11 13:53:54' System info: host: 'c578ed4b4c40', ip: '172.17.0.94', os.name: 'Linux', os.arch: 'amd64', os.version: '3.18.0-1.el6.elrepo.x86_64', java.version: '1.7.0_91' Driver info: driver.version: EventFiringWebDriver Session ID: caf4a8c8c934a46066542f457894fd4e Capabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}] Command duration or timeout: 257 milliseconds Build info: version: '2.49.1', revision: '808c23b0963853d375cbe54b90bbd052e2528a54', time: '2016-01-21 09:37:52' System info: host: 'mydtbld0126', ip: '16.44.48.115', os.name: 'Linux', os.arch: 'amd64', os.version: '2.6.32-504.el6.x86_64', java.version: '1.7.0_10' Session ID: 534c2bbe-7636-40f7-91a6-cf37ae5c2e1d Driver info: com.hp.maas.platform.ui.test.selenium.wd.WebDriverFactory$ScreenshootingRemoteWebDriver Capabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, webdriver.remote.sessionid=534c2bbe-7636-40f7-91a6-cf37ae5c2e1d, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]",
    "exceptionType": "org.openqa.selenium.WebDriverException",
    "testName": "VendorManagementSanity",
    "jobName": "MaaS-SAW-USB-master",
    "insertionTime": "2016-03-27T14:00:22.789Z"
  }, {
    "_id": "56f7e7765144e267196966a2",
    "testFailed": true,
    "buildId": 1142,
    "branchName": "master",
    "category": "gate-keeper serial-test km social saw-sd ess-sh saw-il saw-il-jbehave ppm-sh saw-sh",
    "testClassName": "com.hp.ess.client.junit.tests.E2E.sanity.sacm.VendorManagementSanityTest",
    "exceptionStacktrace": "org.openqa.selenium.WebDriverException: Error communicating with the remote browser. It may have died.\nBuild info: version: '2.49.0', revision: '3d17e9b', time: '2016-02-11 13:53:54'\nSystem info: host: 'c578ed4b4c40', ip: '172.17.0.94', os.name: 'Linux', os.arch: 'amd64', os.version: '3.18.0-1.el6.elrepo.x86_64', java.version: '1.7.0_91'\nDriver info: driver.version: EventFiringWebDriver\nSession ID: caf4a8c8c934a46066542f457894fd4e\nCapabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]\nCommand duration or timeout: 321 milliseconds\nBuild info: version: '2.49.1', revision: '808c23b0963853d375cbe54b90bbd052e2528a54', time: '2016-01-21 09:37:52'\nSystem info: host: 'mydtbld0126', ip: '16.44.48.115', os.name: 'Linux', os.arch: 'amd64', os.version: '2.6.32-504.el6.x86_64', java.version: '1.7.0_10'\nSession ID: 534c2bbe-7636-40f7-91a6-cf37ae5c2e1d\nDriver info: com.hp.maas.platform.ui.test.selenium.wd.WebDriverFactory$ScreenshootingRemoteWebDriver\nCapabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, webdriver.remote.sessionid=534c2bbe-7636-40f7-91a6-cf37ae5c2e1d, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]\n",
    "testDuration": 0,
    "errorMessage": "Error communicating with the remote browser. It may have died. Build info: version: '2.49.0', revision: '3d17e9b', time: '2016-02-11 13:53:54' System info: host: 'c578ed4b4c40', ip: '172.17.0.94', os.name: 'Linux', os.arch: 'amd64', os.version: '3.18.0-1.el6.elrepo.x86_64', java.version: '1.7.0_91' Driver info: driver.version: EventFiringWebDriver Session ID: caf4a8c8c934a46066542f457894fd4e Capabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}] Command duration or timeout: 321 milliseconds Build info: version: '2.49.1', revision: '808c23b0963853d375cbe54b90bbd052e2528a54', time: '2016-01-21 09:37:52' System info: host: 'mydtbld0126', ip: '16.44.48.115', os.name: 'Linux', os.arch: 'amd64', os.version: '2.6.32-504.el6.x86_64', java.version: '1.7.0_10' Session ID: 534c2bbe-7636-40f7-91a6-cf37ae5c2e1d Driver info: com.hp.maas.platform.ui.test.selenium.wd.WebDriverFactory$ScreenshootingRemoteWebDriver Capabilities [{platform=LINUX, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=/tmp/.com.google.Chrome.Ghy5if}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, webdriver.remote.sessionid=534c2bbe-7636-40f7-91a6-cf37ae5c2e1d, version=47.0.2526.106, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]",
    "exceptionType": "org.openqa.selenium.WebDriverException",
    "testName": "com.hp.ess.client.junit.tests.E2E.sanity.sacm.VendorManagementSanityTest",
    "jobName": "MaaS-SAW-USB-master",
    "insertionTime": "2016-03-27T14:00:22.789Z"
  }];

  function TestsRetriever(mongoUrl) {
    var testSchema = new Schema({
      _id: mongoose.Schema.Types.ObjectId,
      jobName: String,
      buildId: Number,
      branchName: String,
      testFailed: Boolean,
      testClassName: String,
      testName: String,
      errorMessage: String,
      exceptionType: String,
      exceptionStackTrace: String,
      insertionTime: Date,
      testDuration: Number,
      category: String
    });
    console.log('Trying to connect to ' + mongoUrl);
    mongoose.connect(mongoUrl);
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function() {
      console.log('Connected to mongoDB :)');
    }.bind(this));

    this.TestResult = mongoose.model('reports', testSchema);
  }

  TestsRetriever.prototype = {
    fetchFailed: function (buildName, buildNumber, onlyFailed, pageSize, page) {
      //return this._promisize('find', {jobName: buildName, buildId: buildNumber, testFailed: true});
      console.log('buildName: \"' + buildName + '", buildNumber: ' + buildNumber);
      var aggregations = [
        {
          $match: {
            jobName: buildName,
            buildId: buildNumber,
            testFailed: !!onlyFailed
          }
        },
        {
          $sort: {
            category: 1,
            testClassName: 1
          }
        },
        {
          $group: {
            _id: {
              testClassName: '$testClassName',
              category: '$category'
            },
            tests: { $push: '$$ROOT' }
          }
        }
      ];
      if (pageSize) {
        aggregations.push({
          $skip: pageSize * (page || 0)
        });
        aggregations.push({
          $limit: pageSize
        });
      }
      return this._promisize('aggregate', aggregations);
      //return Promise.resolve(mockTests);
    },
    fetchStability: function (buildName, tests, buildCount) {
      console.log('buildName: \"' + buildName + '", buildCount: ' + buildCount + ', tests: ', tests);
      var classesAndMethods;
      classesAndMethods = _.transform(tests, function (result, value) {
        result.classes.push(value.testClass);
        result.methods = result.methods.concat(value.methods);
      }, { classes: [], methods: [] });
      return this._promisize('aggregate', [
        {
          $sort: {
            buildId: -1
          }
        },
        {
          $match: {
            jobName: buildName,
            testClassName: {
              $in: classesAndMethods.classes
            },
            testName: {
              $in: classesAndMethods.methods
            }
          }
        },
        {
          $project: {
            jobName: 1,
            buildId: 1,
            testClassName: 1,
            testName: 1,
            failedCount: { $cond: ['$testFailed', 1, 0] }
          }
        },
        {
          $limit: 10 * classesAndMethods.methods.length
        },
        {
          $group: {
            _id: {
              testClassName: '$testClassName',
              testName: '$testName'
            },
            stability: { $avg: '$failedCount' },
            failed: { $sum: '$failedCount' },
            buildIds: { $push: '$buildId' }/*,
            tests: {$push: '$$ROOT'}*/
          }
        }
      ]);
    },
    fetchSpecific: function (buildName, buildNumber, tests, pageSize, page) {
      console.log('fetchSpecific: buildName: \"' + buildName + '", buildNumber: ' + buildNumber + ', tests: ', tests);
      var classesAndMethods, aggregations;
      classesAndMethods = _.transform(tests, function (result, value) {
        result.classes.push(value.testClass);
        result.methods = result.methods.concat(value.methods);
      }, { classes: [], methods: [] });
      aggregations = [
        {
          $match: {
            jobName: buildName,
            buildId: buildNumber,
            testClassName: {
              $in: classesAndMethods.classes
            },
            testName: {
              $in: classesAndMethods.methods
            }
          }
        },
        {
          $sort: {
            category: 1,
            testClassName: 1
          }
        },
        {
          $group: {
            _id: {
              testClassName: '$testClassName',
              category: '$category'
            },
            tests: { $push: '$$ROOT' }
          }
        }
      ];
      if (pageSize) {
        aggregations.push({
          $skip: pageSize * (page || 0)
        });
        aggregations.push({
          $limit: pageSize
        });
      }
      return this._promisize('aggregate', aggregations);
    },
    _promisize: function (method, data) {
      return new Promise(function (resolve, reject) {
        this.TestResult[method](data, function (err, results) {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        });
      }.bind(this));
    }
  };

  return TestsRetriever;
}());
