angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', 'auth',function($scope, $stateParams, ReservationFactory, CarFactory, AuthFactory) {
    $scope.cars = CarFactory.available_cars;    
        
    $scope.setSelectedCar = function() {
        $scope.id = $stateParams.id;

        $scope.car_selected = CarFactory.getCar($scope.id);
        console.log($scope.car_selected);
    }

    
    $scope.addReservation = function() {
        
        
        AuthFactory.currentUserObject().success(function(data) {
            $scope.currentUser = data; 
        });
        
        
        // create the car
        ReservationFactory.create({
            user: $scope.currentUser.id,
            car: $scope.id,
            status: "Created",
            isActive: true,
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo,
            isRented: $scope.isRented
        });
        
    }

    
    
    $scope.$on('$viewContentLoaded', function(){
        $scope.id = $stateParams.id;

        $scope.car_selected = CarFactory.getCar($scope.id);
        console.log($scope.car_selected);
    });
}]);