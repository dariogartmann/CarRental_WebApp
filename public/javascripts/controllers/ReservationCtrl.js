angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', function($scope, $stateParams, reservations, cars) {
    $scope.cars = cars.cars;
    
    // TODO Don't display cars where isCurrentlyReserved === true
    
    
    // get id of chosen car from url parameter
    $scope.id = $stateParams.id;

}]);

