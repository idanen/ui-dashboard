(function (angular) {
    'use strict';

    angular.module('tabs').service('TeamMembersService', ['MembersService', function (MembersService) {

        this.members = MembersService;

        this.uniqueMemberId = this.members.length;

        this.addMember = function (member) {
            member.memberId = this.uniqueMemberId;
            this.uniqueMemberId++;

            var tmp = {};
            angular.copy(member, tmp);
            this.members.push(tmp);
        };

        this.getMemberByID = function (memberId) {
            if (memberId) {
                var member = this.members.filter(function (obj) {
                    return obj.memberId == memberId;
                })[0];
                return member;
            }
        };
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

        };
        $scope.paginate();

        $scope.goPrevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                $scope.paginate();
            }
        };

        $scope.goNextPage = function () {
            if ($scope.tmp.length >= ($scope.currentPage * 10)) {
                $scope.currentPage++;
                $scope.paginate();
            }
        };


        $scope.addMember = function (member) {
            TeamMembersService.addMember(member);
            angular.forEach($scope.members, function (member, index) {
                //Just add the index to your item
                member.index = index;
            });
            $scope.paginate();
        };

        angular.forEach($scope.members, function (member, index) {
            //Just add the index to your item
            member.index = index;
        });

    }]);
})(window.angular);
