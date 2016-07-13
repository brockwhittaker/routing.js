funcs.scope.repeat = function ($scope) {
  var immutable = funcs.util.immutable;

  immutable($scope, "repeat", function (name) {
    if ($scope.data.repeat[name]) {
      return $scope.data.repeat[name];
    } else console.warn("Error. Repeat associated with key '" + name + "' does not exist yet.");
  });
};
