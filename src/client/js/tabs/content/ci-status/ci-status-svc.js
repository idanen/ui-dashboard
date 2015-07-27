/**
 * Created by matarfa on 15/07/2015.
 */


'use strict';

angular.module('tabs').service('CiStatusService', ['$http',function ($http) {
    this.invalidateHead = function() {
        return 3;
    };
}]);



angular.module('tabs').controller('ciStatusController',['$scope','$http', function($scope,$http){

    $scope.btnStyle="btn btn-default";



    $scope.toggleFreeze = function (job,btnType) {
        if( (btnType == 'onButton' && job.freeze.state == false) || // toggle if need to
            (btnType == 'offButton' && job.freeze.state == true)){
            job.freeze.state = !job.freeze.state;
            if (job.freeze.onStyle == "btn btn-default") {
                job.freeze.onStyle = "btn btn-primary";
                job.freeze.offStyle = "btn btn-default";
            } else {
                job.freeze.offStyle = "btn btn-primary";
                job.freeze.onStyle = "btn btn-default";
            }
        }
    };
    $scope.warning="";
    $scope.nameJson =[];


    $scope.addJob = function(job){
        $scope.tmpJob = [];
        var url = "http://mydtbld0021.isr.hp.com:8080/jenkins/job/" + job.name + "/api/json";
        var newJob;
        $http.post("/updateJob") // to check if build exist
            .success(function(res) {$scope.addTheJob(res,job.alias);}
        );


    }

    $scope.addTheJob = function(job,alias){
        var newJob = {jobName:job.fullDisplayName,aliasName:alias,freeze:{
            state:false,
            onStyle:'btn btn-default',
            offStyle:'btn btn-primary'
        }, result:job.result,buildStatus:job.building};

        $scope.nameJson.push(newJob);
    }

    $scope.displayName = function(job){
        console.log(job.aliasName);
        if(job.aliasName != "" && job.aliasName !== undefined){
            return job.aliasName;
        }else{
            return job.jobName;
        }
    }

    // for json and http use
    $scope.status = function(job){
        if(job.buildStatus == true){
            return "Running";
        }else{
            return job.result;
        }
    }

    $scope.chooseImg = function(job){
        if(job.buildStatus == true){
            return "../images/green_anime.gif";
        }else{
            return "../images/" + job.result + ".png";
        }
    }

    // for json and http
    $scope.trStatus = function(job) {
        if (job.buildStatus == true) {
            return "active";
        } else {
            if (job.result == "SUCCESS") {
                return "success";
            } else if (job.result == "FAILURE") {
                return "danger";
            } else if (job.result == "UNSTABLE") {
                return "warning";
            }
        }
    }
}]);



/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('tabs').filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

