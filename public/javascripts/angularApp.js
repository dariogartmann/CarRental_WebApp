var app = angular.module('carrental', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/partials/dashboard.html',
        controller: 'DashboardController',
        onEnter: ['$state', 'auth', function($state, auth){
            if(!auth.isLoggedIn()){
                $state.go('login');
            }
        }]
    })
    .state('cars', {
        url: '/cars',
        templateUrl: '/partials/cars.html',
        controller: 'CarCtrl',
          resolve: {
            postPromise: ['cars', function(cars){
                return cars.getAll();
            }]
        }
    })    
    .state('reservation_new', {
        url: '/reservations/new',
        templateUrl: '/partials/reservation_new.html',
        controller: 'ReservationCtrl',
        resolve: {
            postPromise: ['cars', function(cars){
                return cars.getAll();
            }]
        }
    })
    .state('usersettings', {
        url: '/usersettings',
        templateUrl: '/partials/usersettings.html',
        controller: 'UserCtrl',
        resolve: {
            postPromise: ['users', function(users){
                return users.getCurrent();
            }] 
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('dashboard');
            }
        }]
    })
    .state('register', {
        url: '/register',
        templateUrl: '/partials/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('dashboard');
            }
        }]
    });

    $urlRouterProvider.otherwise('login');
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
.factory('users', ['$http', 'auth', function($http, auth) {
    var o = {
        users: []
    };
    
    o.getAll = function() {
        return $http.get('/reservations', {
            headers: { Authorization: 'Bearer'+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.users);
        });
    };
    
    o.getCurrent = function() {
        return $http.get('/users/'+auth.getCurrent, {
            headers: {Authorization: 'Bearer'+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.users);
        })
    }
    
    return o;
    
}])
.factory('reservations', ['$http', 'auth', function($http, auth) {
    var o = {
        reservations: []
    };
    
    o.getAll = function() {
        return $http.get('/reservations', {
            headers: { Authorization: 'Bearer'+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.reservations);
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