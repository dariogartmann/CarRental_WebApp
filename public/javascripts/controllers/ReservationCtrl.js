angular.module('carrental').controller('ReservationCtrl', ['$scope', '$stateParams', 'reservations', 'cars', 'auth',function($scope, $stateParams, reservations, cars, auth) {
    $scope.cars = cars.available_cars;    
    
    // set ids onload
    $scope.$on('$viewContentLoaded', function(){
        $scope.car_id = $stateParams.id;
        
        // get user from authfactory
        auth.currentUserObject().success(function(data) {
            $scope.currentUser = data; 
            $scope.userId = $scope.currentUser._id;
        });
        
        reservations.getForCurrentUser($scope.userId);
        reservations.getAll();
        $scope.myReservations = reservations.reservations;
    });

    
    // reserves a car
    $scope.addReservation = function() {
        
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
        
        // set cars currentlyReserved to true so it can't be reserved again
        cars.reserve($scope.car_id);
        
    }
    
    $scope.cancelReservation = function(reservation) {
        reservations.delete(reservation).success(function(data) {
            $scope.success = "Reservation cancelled successfully!";    
            
            reservations.getAll();
            $scope.myReservations = reservations.reservations;
        });
    }
    
}]);