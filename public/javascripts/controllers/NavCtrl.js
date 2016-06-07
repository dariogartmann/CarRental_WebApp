angular.module('carrental').controller('NavCtrl', ['$scope', 'auth', function($scope, auth){
    // this data is needed for navbar contents
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
}]);