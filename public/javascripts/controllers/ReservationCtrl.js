angular.module('carrental').controller('ReservationCtrl', ['$scope', '$state', '$stateParams', 'reservations', 'cars', 'auth', function($scope, $state, $stateParams, reservations, cars, auth) {
    $scope.cars = cars.available_cars;    
    
    var currentUserId;
    
    // set variables onload
    $scope.$on('$viewContentLoaded', function(){
        if($stateParams.id) {
            $scope.car_id = $stateParams.id;    

            $scope.car = cars.getCar($scope.car_id).success(function(data){}).$$state;
            
            console.log($scope.car);
            
        }

        // get user from authfactory
        auth.currentUserObject().success(function(data) {
            $scope.currentUser = data; 
            $scope.userId = $scope.currentUser._id;
            
            currentUserId = $scope.currentUser._id;

            reservations.getForCurrentUser(currentUserId);
            reservations.getAll();
            $scope.myReservations = reservations.reservations;        
        });
        
        

    });
    
    
    // reserves a car
    $scope.addReservation = function() {
        
        // create the car and write to database
        reservations.create({
            user: $scope.userId,
            car: $scope.car_id,
            status: "Created",
            isActive: true,
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo,
            isRented: $scope.isRented
        });
        
        // set cars currentlyReserved to true so it can't be reserved again
        // TODO: fix dis ;-;
        cars.reserve($scope.car_id);
        
        
        // go to reservation overview
        $state.go('reservation_overview');
        
    }
    
    $scope.cancelReservation = function(reservation) {
        reservations.delete(reservation).success(function(data) {
            $scope.success = "Reservation cancelled successfully!";    
            
            reservations.getAll();
            $scope.myReservations = reservations.reservations;
        });
    }
    
}]);