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
      // console.log('buildName: \"' + buildName + '", buildNumber: ' + buildNumber);
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
    },
    fetchFailedOfLastBuilds: function (buildName, buildCount, startFromNumber) {
      var buildIdsRange = this._arrayWithReverse(buildCount, startFromNumber);
      return this._promisize('aggregate', [
        {
          $sort: {
            buildId: -1
          }
        },
        {
          $match: {
            jobName: buildName,
            buildId: {
              $in: buildIdsRange
            },
            testFailed: true
          }
        },
        {
          $group: {
            _id: {
              testClassName: '$testClassName',
              testName: '$testName'
            },
            tests: { $push: '$$ROOT' }
          }
        }
      ]);
    },
    fetchStability: function (buildName, buildCount, startFromNumber, branchName) {
      // console.log('buildName: \"' + buildName + '", buildCount: ' + buildCount + ', tests: ', tests);
      var buildIdsRange = Promise.resolve(this._arrayWithReverse(buildCount, startFromNumber));
      if (branchName) {
        buildIdsRange = this._promisize('aggregate', [
          {
            $match: {
              jobName: buildName,
              branchName: branchName
            }
          },
          {
            $group: {
              _id: {
                buildId: '$buildId'
              }
            }
          },
          {
            $sort: {
              "_id.buildId": -1
            }
          },
          {
            $limit: buildCount
          }
        ])
            .then(function (results) {
              var buildIds = [];

              if (results) {
                buildIds = results.map(function (aggregated) {
                  return aggregated._id.buildId;
                });
              }

              return buildIds;
            });
      }
      return buildIdsRange.then(function (buildIds) {
        return this._promisize('aggregate', _buildStabilityAggregator(buildName, buildIds))
            .then(this.fetchStabilitySuccessTests.bind(this, buildName, buildIds));
      }.bind(this));
    },
    fetchStabilitySuccessTests: function (buildName, buildIdsRange, stabilityResults) {
      var classesAndMethods, aggregations;
      classesAndMethods = _.transform(stabilityResults, function (result, value) {
        result.classes.push(value._id.testClassName);
        result.methods.push(value._id.testName);
      }, { classes: [], methods: [] });
      classesAndMethods.classes = _.uniq(classesAndMethods.classes);
      classesAndMethods.methods = _.uniq(classesAndMethods.methods);
      aggregations = [
        {
          $sort: {
            buildId: -1
          }
        },
        {
          $match: {
            jobName: buildName,
            buildId: {
              $in: buildIdsRange
            },
            testClassName: {
              $in: classesAndMethods.classes
            },
            testName: {
              $in: classesAndMethods.methods
            },
            testFailed: false
          }
        },
        {
          $project: {
            jobName: 1,
            buildId: 1,
            testClassName: 1,
            testName: 1,
            testFailed: 1,
            markedUnstable: 1,
            testReportUrl: 1,
            exceptionType: 1,
            errorMessage: 1,
            successCount: { $cond: ['$testFailed', 0, 1] }
          }
        },
        {
          $group: {
            _id: {
              testClassName: '$testClassName',
              testName: '$testName'
            },
            stability: { $avg: '$successCount' },
            succeeded: { $sum: '$successCount' },
            buildIds: {
              $push: {
                buildId: '$buildId',
                testFailed: '$testFailed',
                markedUnstable: '$markedUnstable'
              }
            },
            tests: {$push: '$$ROOT'}
          }
        }
      ];
      return this._promisize('aggregate', aggregations)
          .then(this.addSuccessTestsToStability.bind(this, stabilityResults));
    },
    addSuccessTestsToStability: function (stabilityResults, complementingData) {
      _.forEach(complementingData, function (successTest) {
        var stabilityResult = _.find(stabilityResults, function (stabilityResult) {
          return stabilityResult._id.testClassName === successTest._id.testClassName && stabilityResult._id.testName === successTest._id.testName;
        });

        if (stabilityResult) {
          stabilityResult.buildIds = stabilityResult.buildIds.concat(successTest.buildIds);
          stabilityResult.tests = stabilityResult.tests.concat(successTest.tests);
          stabilityResult.succeeded = successTest.succeeded;
          stabilityResult.stability = stabilityResult.failed / ((stabilityResult.failed + successTest.succeeded) || 1);
        }
      });

      return stabilityResults;
    },
    fetchSpecific: function (buildName, buildNumber, tests, pageSize, page) {
      // console.log('fetchSpecific: buildName: \"' + buildName + '", buildNumber: ' + buildNumber + ', tests: ', tests);
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
    fetchCompare: function (buildName, buildNumber, toBuildName, toBuildNumber, pageSize, page) {
      var aggregations;
      aggregations = [
        {
          $match: {
            $or: [
              {
                jobName: buildName,
                buildId: buildNumber,
                testFailed: true
              },
              {
                jobName: toBuildName,
                buildId: toBuildNumber,
                testFailed: true
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              jobName: '$jobName',
              buildId: '$buildId'
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
      //console.log(JSON.stringify(aggregations));
      return this._promisize('aggregate', aggregations)
          //.then(this.groupTests)
          .then(this.addComplementingTests.bind(this, buildName, buildNumber, toBuildName, toBuildNumber))
          .then(this.fetchComplementingTests.bind(this, buildName, buildNumber, toBuildName, toBuildNumber));
    },
    groupTests: function (aggregated) {
      if (aggregated) {
        return aggregated.map(function (testsWrap) {
          return _.groupBy(testsWrap.tests, 'testClassName');
        });
      }
      return aggregated;
    },
    addComplementingTests: function (buildName, buildNumber, toBuildName, toBuildNumber, failedOfBoth) {
      var toReturn = {},
          leftIdx = 0,
          rightIdx = 1,
          leftTests,
          rightTests,
          addToLeft,
          addToRight;

      if (failedOfBoth[0] && failedOfBoth[0].tests && failedOfBoth[0].tests[0] && failedOfBoth[0].tests[0].jobName === toBuildName && failedOfBoth[0].tests[0].buildId === toBuildNumber) {
        leftIdx = 1;
        rightIdx = 0;
      } else if (failedOfBoth[1] && failedOfBoth[1].tests && failedOfBoth[1].tests[0] && failedOfBoth[1].tests[0].jobName === buildName && failedOfBoth[1].tests[0].buildId === buildNumber) {
        leftIdx = 1;
        rightIdx = 0;
      }
      leftTests = failedOfBoth[leftIdx] && failedOfBoth[leftIdx].tests || [];
      rightTests = failedOfBoth[rightIdx] && failedOfBoth[rightIdx].tests || [];

      addToLeft = _.differenceWith(rightTests, leftTests, _testEquals);
      addToRight = _.differenceWith(leftTests, rightTests, _testEquals);

      addToLeft = _.map(addToLeft, function (test) {
        return _.extend({alien: true}, test);
      });
      addToRight = _.map(addToRight, function (test) {
        return _.extend({alien: true}, test);
      });
      leftTests = leftTests.concat(addToLeft);
      rightTests = rightTests.concat(addToRight);

      toReturn[buildName + buildNumber] = leftTests;
      toReturn[toBuildName + toBuildNumber] = rightTests;

      return toReturn;
    },
    fetchComplementingTests: function (buildName, buildNumber, toBuildName, toBuildNumber, allTests) {
      var leftAlienTests = _.filter(allTests[buildName + buildNumber], { alien: true }),
          rightAlienTests = _.filter(allTests[toBuildName + toBuildNumber], { alien: true }),
          aggregations, orCondition = [];

      if (!leftAlienTests.length && !rightAlienTests.length) {
        return allTests;
      }

      var classesAndMethods = _.transform(leftAlienTests, function (result, value) {
        if (!_.includes(result.classes, value.testClassName)) {
          result.classes.push(value.testClassName);
        }
        if (!_.includes(result.methods, value.testName)) {
          result.methods.push(value.testName);
        }
        return result;
      }, { classes: [], methods: [] });
      classesAndMethods = _.transform(rightAlienTests, function (result, value) {
        if (!_.includes(result.classes, value.testClassName)) {
          result.classes.push(value.testClassName);
        }
        if (!_.includes(result.methods, value.testName)) {
          result.methods.push(value.testName);
        }
        return result;
      }, classesAndMethods);

      orCondition.push({
        jobName: buildName,
        buildId: buildNumber,
        testClassName: {
          $in: classesAndMethods.classes
        },
        testName: {
          $in: classesAndMethods.methods
        }
      });
      orCondition.push({
        jobName: toBuildName,
        buildId: toBuildNumber,
        testClassName: {
          $in: classesAndMethods.classes
        },
        testName: {
          $in: classesAndMethods.methods
        }
      });

      aggregations = [
        {
          $match: {
            $or: orCondition
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
              jobName: '$jobName',
              buildId: '$buildId'
            },
            tests: { $push: '$$ROOT' }
          }
        }
      ];

      return this._promisize('aggregate', aggregations)
          .then(function (groupedTests) {
            groupedTests.forEach(function (groupedTest) {
              groupedTest.tests.forEach(function (test) {
                var foundTest = _.find(allTests[test.jobName + test.buildId], {
                  testClassName: test.testClassName,
                  testName: test.testName
                });
                if (foundTest) {
                  _.extend(foundTest, test);
                  delete foundTest.alien;
                }
              });
            });

            return allTests;
          });
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
    },
    _arrayWithReverse: function (length, startWith) {
      var arr = [], i;

      if (isNaN(length) || isNaN(startWith)) {
        throw new Error('Both arguments should be numbers');
      }

      for (i = 0; i < length; i++) {
        arr.push(startWith - i);
      }

      return arr;
    }
  };

  function _testEquals(test, otherTest) {
    if (!test || !otherTest) {
      return false;
    }

    return test.testClassName === otherTest.testClassName && test.testName === otherTest.testName;
  }

  function _buildStabilityAggregator(jobName, buildIds) {
    return [
      {
        $sort: {
          buildId: -1
        }
      },
      {
        $match: {
          jobName: jobName,
          buildId: {
            $in: buildIds
          },
          testFailed: true
        }
      },
      {
        $project: {
          jobName: 1,
          buildId: 1,
          testClassName: 1,
          testName: 1,
          testFailed: 1,
          markedUnstable: 1,
          testReportUrl: 1,
          exceptionType: 1,
          errorMessage: 1,
          failedCount: { $cond: ['$testFailed', 1, 0] }
        }
      },
      {
        $group: {
          _id: {
            testClassName: '$testClassName',
            testName: '$testName'
          },
          stability: { $avg: '$failedCount' },
          failed: { $sum: '$failedCount' },
          buildIds: {
            $push: {
              buildId: '$buildId',
              testFailed: '$testFailed',
              markedUnstable: '$markedUnstable'
            }
          },
          tests: {$push: '$$ROOT'}
        }
      }
    ];
  }

  return TestsRetriever;
}());
