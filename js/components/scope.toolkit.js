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

  immutable($scope, "input", {
    val: function (arr, clear) {
      if (Array.isArray(arr)) {
        var obj = {},
            $elems;

        arr.forEach(function (name) {
          $elems = $scope.get(name).self;

          if ($elems && $elems.length > 0) {
            if ($elems.length > 1) {
              obj[name] = $elems.map(function (o) {
                return o.value;
              });
            } else {
              obj[name] = $elems[0].value;
            }
          }
        });

        // also clear the values of the inputs.
        if (clear) this.clear(arr);

        return obj;
      } else console.warn("Error. `$scope.input.val` must be passed an array parameter of valid b-name nodes.");
    },

    clear: function (arr) {
      if (Array.isArray(arr)) {
        var $elems;

        arr.forEach(function (name) {
          $elems = $scope.get(name).self;

          if ($elems) {
            $elems.forEach(function (o) {
              o.value = "";
            });
          }
        });
      } else console.warn("Error. `$scope.input.clear` must be passed an array parameter of valid b-name nodes.");
    }
  });
};
