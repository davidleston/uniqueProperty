angular.module('davidLeston.uniqueProperty', []).directive('uniqueProperty', function () {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      object: '=uniquePropertyObject',
      collection: '=uniquePropertyCollection',
      propertyPath: '@uniquePropertyPath'
    },
    link: function ($scope, $elem, $attrs, ngModelController) {
      ngModelController.$validators.uniqueProperty = function (propertyValue) {
        return !$scope.object ||
          !$scope.propertyPath ||
          !_.chain($scope.collection)
            .values()
            .without($scope.object)
            .map($scope.propertyPath)
            .includes(propertyValue)
            .value();
      };

      var deregisterElements = _.noop;
      var registerElements = function () {
        deregisterElements();
        deregisterElements = $scope.$watchGroup(
          _.map($scope.collection, function (element) {
            return function () {
              return _.get(element, $scope.propertyPath);
            };
          }),
          ngModelController.$validate);
      };

      var deregisterCollection = _.noop;
      var registerCollection = function() {
        deregisterCollection();
        deregisterCollection = $scope.$watchCollection('collection', function () {
          registerElements();
          ngModelController.$validate();
        });
      };

      $scope.$watchGroup(['object', 'collection', 'propertyPath'], function () {
        registerCollection();
        ngModelController.$validate();
      });

      registerCollection();
      ngModelController.$validate();
    }
  };
});
