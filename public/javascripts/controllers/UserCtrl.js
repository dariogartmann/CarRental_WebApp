angular.module('carrental').controller('UserCtrl', ['$scope', 'users', function($scope, users) {   
   
   $scope.users = users.users;
   
   $scope.current = users.currentUser;
}]);

