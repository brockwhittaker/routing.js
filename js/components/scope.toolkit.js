funcs.scope.toolkit = function ($scope) {
  var utils = {
    setVals: function ($scope, prop, obj) {
      if (typeof obj == "object") {
        for (var x in obj) {
          $scope.get(x).self.forEach(function (o) {
            o[prop] = obj[x];
          });
        }
      }
    },
    getVals: function (nodes, attr) {
      return nodes[0][prop];
    }
  };

  var immutable = funcs.util.immutable;

  immutable($scope, "edit", {
    text: function (obj) {
      utils.setVals($scope, "innerText", obj);
      return this;
    },

    html: function (obj) {
      utils.setVals($scope, "innerHTML", obj);
      return this;
    }
  });
};
