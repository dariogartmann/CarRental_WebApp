angular.module('carrental').controller('CarController', [
'$scope',
'cars',
function($scope, cars){
    $scope.cars = cars.cars;
    
    $scope.addCar = function(){
        if(!$scope.title || $scope.title === '') { return; }
        if(!$scope.pricePerDay || $scope.pricePerDay === '' || $scope.pricePerDay < 0) { return; }
        cars.create({
            title: $scope.title,
            pricePerDay: $scope.pricePerDay
        });

        $scope.title = '';
        $scope.pricePerDay = '';
    };
    
    $scope.deleteCar = function(car) {
        cars.delete(car);
        $scope.cars = null;
        $scope.cars = cars.cars;
    }
}])