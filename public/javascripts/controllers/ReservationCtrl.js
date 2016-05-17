angular.module('carrental').controller('ReservationCtrl', ['$scope', 'reservations', 'cars', function($scope, reservations, cars) {
    $scope.cars = cars.cars;
    $scope.test = "ReservationCtrl is adf!";
}]);

