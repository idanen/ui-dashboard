var Promise = require('promise');
var eRequest = require("request");
exports.UIDashboardController = function () {
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

        addNewJob: function (request, response) {
            var job = request.body;
            var tmpJson = JSON.stringify(job);
            eRequest.post({
                headers: {'content-type': 'application/json'},
                url: 'https://boiling-inferno-9766.firebaseio.com/allJobs.json',
                body: tmpJson
            }, function (error, response, body) {

            });


        },

        getAllJobs: function (req, res) {
            eRequest("http://boiling-inferno-9766.firebaseio.com/allJobs.json", function(error, response, body) {
                var jobs = JSON.parse(body);
                var arr = Object.keys(jobs).map(function(k) { return jobs[k] });
                res.send(updateJobsFromJenkins(arr));
            });

        }
    };



    function updateJobsFromJenkins(jobs) {
        return(getJobs()).then(function(res){
            return res;
        });
    };

    function getJobs() {
        return new Promise(function (resolve, reject) {
            for (var key in jobs) {
                var jenkinsUrl = "http://mydtbld0021.isr.hp.com:8080/jenkins/job/" + jobs[key].name + "/lastBuild/api/json";
                eRequest.get(jenkinsUrl, function (error, response, body) {
                    var jsonIt = JSON.parse(body);
                    jobs[key].result = jsonIt.result;
                    jobs[key].building = jsonIt.building;
                });
            }
            resolve(jobs);
        });
    };

};
