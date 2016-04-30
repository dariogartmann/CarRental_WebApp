var app = angular.module('carrental', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/partials/dashboard.html',
        controller: 'CarController',
        resolve: {
            postPromise: ['cars', function(cars){
                return cars.getAll();
            }]
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('home');
            }
        }]
    })
    .state('register', {
        url: '/register',
        templateUrl: '/partials/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('home');
            }
        }]
    });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('cars', ['$http', 'auth', function($http, auth){
    var o = {
        cars: []
    };
    
    o.getAll = function() {
        return $http.get('/cars', {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
            angular.copy(data, o.cars);
        });
    };
    
    o.create = function(car) {
        return $http.post('/cars', car, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            o.cars.push(data);
        });
    };
    
    o.delete = function(car) {
        return $http.delete('/cars/' + car._id, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            return true;
            // TODO update after delete
        });
    };

    return o;
}])
.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

    auth.saveToken = function (token){
        $window.localStorage['car-rental-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['car-rental-token'];
    }
    
    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };
    
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });   
    };
    
    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    
    auth.logOut = function(){
        $window.localStorage.removeItem('car-rental-token');
    };
    
    return auth;
}]);



app.controller('CarController', [
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
    }
}])
.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
        auth.register($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('home');
        });
    };

    $scope.logIn = function(){
        auth.logIn($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('home');
        });
    };
}])
.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);