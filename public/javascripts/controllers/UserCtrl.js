angular.module('carrental').controller('UserCtrl', ['$scope', 'users','auth', '$state', function($scope, UserFactory, AuthFactory, $state) {   
    
    AuthFactory.currentUserObject().success(function(data) {
        $scope.current = data; 
    });
    
    $scope.updateUser = function(user) {
        UserFactory.update(user).success(function(data) {
            $scope.success = data;              
        });
    }
    
}]);

