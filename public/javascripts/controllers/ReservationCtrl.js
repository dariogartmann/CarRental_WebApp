angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', function($scope, $stateParams, reservations, cars) {
    $scope.cars = cars.available_cars;    
        
    
    $scope.setSelectedCar = function() {
        $scope.id = $stateParams.id;

        $scope.car_selected = cars.getCar($scope.id);
        console.log($scope.car_selected);

        /*
        for (var i = 0; i < $scope.cars.length; i++) {

            var obj = JSON.parse($scope.cars[i]);

            if (obj._id == $scope.id) {
                $scope.car_selected = $scope.cars[i];   
            }    
        }   
        */
        
    }

    
    
    $scope.$on('$viewContentLoaded', function(){
        $scope.id = $stateParams.id;

        $scope.car_selected = cars.getCar($scope.id);
        console.log($scope.car_selected);
    });
}]);