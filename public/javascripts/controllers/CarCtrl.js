angular.module('carrental').controller('CarCtrl', [
'$scope',
'cars',
function($scope, CarFactory){
    $scope.cars = CarFactory.cars;
    
    // create a new car with formdata
    $scope.addCar = function(){
        // check for errors
        if(!$scope.title || $scope.title === '') { return; }
        if(!$scope.image || $scope.image === '') { return; }
        if(!$scope.brand || $scope.brand === '') { return; }
        if(!$scope.model || $scope.model === '') { return; }
        if(!$scope.horsePower || $scope.horsePower === '' || $scope.horsePower < 0) { return; }
        if(!$scope.fuelConsumption || $scope.fuelConsumption === '' || $scope.fuelConsumption < 0) { return; }
        if(!$scope.numberOfDoors || $scope.numberOfDoors === '') { return; }
        if(!$scope.numberOfSeats || $scope.numberOfSeats === '') { return; }
        if(!$scope.pricePerDay || $scope.pricePerDay === '' || $scope.pricePerDay < 0) { return; }
        
        // write to database
        CarFactory.create({
            title: $scope.title,
            pricePerDay: $scope.pricePerDay,
            image: $scope.image,
            brand: $scope.brand,
            model: $scope.model,
            horsePower: $scope.horsePower,
            fuelConsumption: $scope.fuelConsumption,
            numberOfDoors: $scope.numberOfDoors,
            numberOfSeats: $scope.numberOfSeats,
            isAutomatic: $scope.isAutomatic,
            isCurrentlyReserved: false
        });

        // clear the contents of clientside form
        $scope.title = '';
        $scope.pricePerDay = '';
        $scope.image = '';
        $scope.brand = '';
        $scope.model = '';
        $scope.horsePower = '';
        $scope.fuelConsumption = '';
        $scope.numberOfDoors = '';
        $scope.numberOfSeats = '';
        $scope.isAutomatic = '';
        
    };
    
    // delete a car
    $scope.deleteCar = function(car) {
        CarFactory.delete(car).success(function(data) {
            $scope.cars = CarFactory.cars;
            $scope.success = data;
        });
    }
}])