var Promise = require('promise');

exports.UIDashboardController = function () {
    var requestedJobs = ["MaaS-Platf-UI-Branch-master", "MaaS-Platf-UI-Branch-master", "MaaS-Platf-UI-Branch-master"];
    var resultJobs = [];
    var currentJob;
    var fs = require('fs');
    var DATA_LOCATION = 'src/server/resources/test.json';
    return {

        save: function (req, res) {
            var dataToSave = JSON.stringify(req.body);
            fs.writeFile(DATA_LOCATION, dataToSave, 'utf8', function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('OK');
                }
            });
        },

        load: function (req, res) {
            fs.readFile(DATA_LOCATION, 'utf8', function (err, fileContent) {

                if (err) {
                    res.send(err);
                    return console.log(err);
                }

                res.send(JSON.parse(fileContent));
            });
        },

        getIt: function (req, response) {
            resultJobs.splice(0, resultJobs.length);
            var promises = [];
            for (var i = 0; i < requestedJobs.length; i++) {
                promises.push(loadRequestedJob(requestedJobs[i]));
            }

            Promise.all(promises)
                .then(function (res) {
                    res.forEach(function (result) {
                        resultJobs.push(result);
                    });
                    response.send(resultJobs);
                }).catch(function (err) {
                    console.error(err);
                });
        },

        getAllJobs: function (req, res) {
            res.send(arr);
        }
    };


    function loadRequestedJob(jobName) {
        return new Promise(function (resolve, reject) {

            var http = require('http');
            var returnResult;
            var options = {
                host: 'mydtbld0021.isr.hp.com',
                port: 8080,
                path: '/jenkins/job/' + jobName + '/api/json'
            };

            var afterHttp = function (response) {
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    var tmp = JSON.parse(str);
                    updateCurrentJob(tmp.displayName);
                    console.log("resolving with " + tmp.displayName);
                    resolve(tmp.displayName);
                });
            };
            http.request(options, afterHttp).end();
        });
    }

    function updateCurrentJob(curr) {
        currentJob = curr;
    }
};
