angular.module('carrental').controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
    $scope.user = {};

    // register a new user
    $scope.register = function(){
        auth.register($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('dashboard');
        });
    };

    // try to log in new user, go to dashboard if success
    $scope.logIn = function(){
        auth.logIn($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('dashboard');
        });
    };
}])