angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', 'auth',function($scope, $stateParams, reservations, cars, auth) {
    $scope.cars = cars.available_cars;    
    

    // reserves a car
    $scope.addReservation = function() {
        
        // get user from authfactory
        auth.currentUserObject().success(function(data) {
            $scope.currentUser = data; 
            $scope.userId = $scope.currentUser._id;
        });
        
        
        // create the car and write to database
        reservations.create({
            user: $scope.currentUser,
            car: $scope.car_id,
            status: "Created",
            isActive: true,
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo,
            isRented: $scope.isRented
        });
        
    }
    
    // set id onload
    $scope.$on('$viewContentLoaded', function(){
        $scope.car_id = $stateParams.id;
    });
    
    $scope.cancelReservation = function(reservation) {
            reservations.delete(reservation).success(function(data) {
                $scope.success = "Canceled reservation!"; 
            });
    }
    
    
    reservations.getAll();
    $scope.myReservations = reservations.reservations;
    
}]);