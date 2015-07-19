
angular.module('tabs').service('TeamMembersService', [function ( ) {
    this.members = [
        {memberId:0, fname:"Fadi",lname:"Matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:1, fname:"Aviad",lname:"Cohen",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {memberId:2, fname:"Mazit",lname:"Bentora",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:3, fname:"Eli",lname:"Koren",email:"fadi.matar@hp.com",img:"http://blog.brighttalk.com/storage/itsm.jpg?__SQUARESPACE_CACHEVERSION=1355364048330"},
        {memberId:4, fname:"Idan",lname:"Entin",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {memberId:5, fname:"Ofer",lname:"Spivak",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:6, fname:"Idit",lname:"Gluck",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:7, fname:"Noam",lname:"Katzir",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:8, fname:"Yael",lname:"Schnabel",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:9, fname:"Evgeny",lname:"Ogurko",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"}];

    this.uniqueMemberId = this.members.length;

    this.addMember = function (member) {
        member.memberId = this.uniqueMemberId;
        this.uniqueMemberId++;

        var tmp = {};
        angular.copy(member, tmp);
        this.members.push(tmp);
    };

    this.getMemberByID = function (memberId) {
        return this.members.filter(function (obj) {
            return obj.memberId == memberId;
        })[0];
    }
}]);

angular.module('tabs').controller('membersController', ['$scope', 'TeamMembersService', function ($scope, TeamMembersService) {
    $scope.currentPage = 1;
    $scope.tmp = TeamMembersService.members;
    $scope.paginate = function () {
        if ($scope.tmp.length < 10)
            $scope.members = $scope.tmp;
        else {
            $scope.members = $scope.tmp.slice(($scope.currentPage - 1) * 10, ($scope.currentPage * 10) - 1);
        }

    }
    $scope.paginate();

    $scope.goPrevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.paginate();
        }
    }

    $scope.goNextPage = function () {
        if ($scope.tmp.length >= ($scope.currentPage * 10)) {
            $scope.currentPage++;
            $scope.paginate();
        }
    }


    $scope.addMember = function (member) {
        TeamMembersService.addMember(member);
        angular.forEach($scope.members, function (member, index) {
            //Just add the index to your item
            member.index = index;
        });
        $scope.paginate();
    }

    angular.forEach($scope.members, function (member, index) {
        //Just add the index to your item
        member.index = index;
    });

}]);

