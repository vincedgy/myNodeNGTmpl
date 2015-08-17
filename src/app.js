/**

*/
(function() {
  'use strict';

  var app = angular.module('app', []);

  app.constant('CONFIG', {
    version: "0.0.1",
    author: "vincedgy",
    name: "myapp",
    firebaseURL: "https://github.com/vincedgy/myNodeNGTmpl.git"
  });

  /* ngInject */
  app.controller('root', function($scope) {
    $scope.message = 'Hello folks from AngularJS';
    $scope.yourMessage = "";
    $scope.reset = function() {
      $scope.yourMessage = "";
    };
  });

})();
