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
        templateUrl: '/partials/reservation_choose_car.html',
        controller: 'ReservationCtrl',
        resolve: {
            postPromise: ['cars', function(cars){
                return cars.getAllAvailable();
            }]
        }
    })
    .state('reservation_finish', {
        url: '/reservations/new/:id',
        templateUrl: '/partials/reservation_finish.html',
        controller: 'ReservationCtrl'
    })  
    .state('reservation_overview', {
        url: '/reservations/overview',
        templateUrl: '/partials/reservation_overview.html',
        controller: 'ReservationCtrl'
    })
    .state('usersettings', {
        url: '/usersettings',
        templateUrl: '/partials/usersettings.html',
        controller: 'UserCtrl',
        resolve: {
            postPromise: ['users', function(users){
                return users.getAll();
            }]
        }
    })
    .state('userprofile', {
        url: '/userprofile',
        templateUrl: '/partials/userprofile.html',
        controller: 'UserCtrl',
        resolve: {
            postPromise: ['users', function(users){
                return users.getAll();
            }]
        }    })
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
        cars: [],
        available_cars: []
    };
    
    o.getAll = function() {
        return $http.get('/cars', {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            angular.copy(data, o.cars);
        });
    };
    
     o.reserve = function(carId) {
        return $http.put('/cars/reserve/'+carId, {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            o.cars = o.getAll();
            o.available_cars = o.getAllAvailable();
            return "Sucessfully reserved car!";
        });
    };
    
    
    o.getCar = function(car_id) {
        $http.get('/cars/id/'+car_id, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            return data;
        });
    };
    
    o.getAllAvailable = function() {
        return $http.get('/cars/available', {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            angular.copy(data, o.available_cars);
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
            return "Deleted car " + car.title;
        });
    };

    return o;
}])
.factory('users', ['$http', 'auth', function($http, auth) {
    var o = {
        users: []
    };
    
    o.update = function(user) {
        return $http.put('/users', user, {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            o.users = o.getAll();
            return "Sucessfully updated!";
        });
    };
    
    o.getAll = function() {
        return $http.get('/users', {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.users);
        });
    };
    
    return o;
    
}])
.factory('reservations', ['$http', 'auth', function($http, auth) {
    var o = {
        reservations: [],
        currentUserReservations: []
    };
    
    o.create = function(reservation) {
       return $http.post('/reservations', reservation, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            o.reservations.push(data);
           return "Successfully created reservation!";
        });
    };
    
    o.getAll = function() {
        return $http.get('/reservations', {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.reservations);
        });
    };
    
    o.getForCurrentUser = function(userid) {
        return $http.get('/reservations/user/'+userid, {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.currentUserReservations);
        });
    }
    
    o.delete = function(reservation) {
           return $http.delete('/reservations/'+reservation._id, {
            headers: { Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data) {
            angular.copy(data, o.reservations);
            return "Reservation cancelled successfully!";
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
    };
    
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
    
    auth.currentUserObject = function() {
        if(auth.isLoggedIn()) {
            return $http.get('/username/'+auth.currentUser(),{
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data) {
                return data;
            });
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