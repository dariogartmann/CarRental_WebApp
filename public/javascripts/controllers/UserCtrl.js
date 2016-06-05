angular.module('carrental').controller('UserCtrl', ['$scope', 'users','auth', function($scope, users, Auth) {   
   
    $scope.users = users.users;
    
    Auth.currentUserObject().success(function(data) {
        $scope.current = data; 
    });
    
    $scope.updateUser = function(user) {
        users.update(user);
    }
    

}]);

