/**

*/
(function(window) {
  'use strict;'

  var app = angular.module('app', []);

  // ng-anotate
  app.controller('root', ['$scope', function($scope) {
    $scope.message='Hello folks from AngularJS';
    $scope.yourMessage= "";
    $scope.reset = function () {
      $scope.yourMessage= "";
    }
  }]);

})();
