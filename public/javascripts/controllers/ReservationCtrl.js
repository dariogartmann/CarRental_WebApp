angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', function($scope, $stateParams, reservations, cars) {
    $scope.cars = cars.available_cars;
    
    // TODO Don't display cars where isCurrentlyReserved === true
    
    
    // get id of chosen car from url parameter
    $scope.id = $stateParams.id;
    
    $scope.car_selected;
    
    
    $scope.setSelectedCar = function() {
              
        for (var i = 0; i < $scope.cars.length; i++) {

            var obj = JSON.parse($scope.cars[i]);

            if (obj._id == $scope.id) {
                $scope.car_selected = $scope.cars[i];   
            }    
        }   
    }
}]);

