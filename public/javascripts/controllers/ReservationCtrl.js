angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', 'auth',function($scope, $stateParams, reservations, cars, auth) {
    $scope.cars = cars.available_cars;    
        
    $scope.setSelectedCar = function() {
        $scope.id = $stateParams.id;

        $scope.car_selected = cars.getCar($scope.id);
        console.log($scope.car_selected);
    }

    // reserves a car
    $scope.addReservation = function() {
        
        // get user from authfactory
        auth.currentUserObject().success(function(data) {
            $scope.currentUser = data; 
        });
        
        
        // create the car and write to database
        reservations.create({
            user: $scope.currentUser.id,
            car: $scope.id,
            status: "Created",
            isActive: true,
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo,
            isRented: $scope.isRented
        });
        
    }

    
    // set id onload
    $scope.$on('$viewContentLoaded', function(){
        $scope.id = $stateParams.id;

        $scope.car_selected = cars.getCar($scope.id);
        console.log($scope.car_selected);
    });
}]);