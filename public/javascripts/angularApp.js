var app = angular.module('carrental', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);


app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);



app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
    $scope.posts = posts.posts;    
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === '') { return; }

        $scope.posts.push({title: $scope.title, upvotes: 0});
        $scope.title = '';
    };
}]);