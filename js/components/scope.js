module.set("scope", {
  create: {
    key: function ($scope, key) {
      var immutable = module.get("util").immutable;

      if (!$scope[key]) {
        $scope[key] = {};

        immutable($scope[key], "data", {});
        immutable($scope[key], "self", []);
        immutable($scope[key], "each", function (callback) {
          var arr = $scope[key].self || [];
          arr.forEach(function (o, i) {
            callback(o, i, $scope[key].self);
          });
        });
      }
    },

    // create a new scope property.
    scope: function (meta, $scope, routes) {
      var immutable = module.get("util").immutable,
          self = this,
          scope = module.get("scope"),
          listeners = module.get("listeners");

      scope.repeat($scope);

      // make `event` in $scope immutable as well as `add` inside of
      // $scope.event. Also add `data` inside $scope for random user data.
      // create $scope level data object for storing state data.
      immutable($scope, "data", {});

      // const variables.
      immutable($scope, "_", {
        CLEAR_INPUT: true
      });

      // save all the data in the `$scope` in localStorage.
      immutable($scope.data, "save", scope.save.bind(this, $scope, meta));

      // retrieve all saved `$scope` data stored in localStorage.
      immutable($scope.data, "retrieve", scope.retrieve.bind(this, $scope, meta));

      // apply all saved `$scope` data stored in localStorage to the `$scope.data`.
      immutable($scope.data, "apply", function (config) {
        return scope.apply($scope, meta, config);
      });

      // retrieve all saved `$scope` data stored in localStorage.
      immutable($scope.data, "remove", scope.remove.bind(this, $scope, meta));

      // check if the current scope's data has expired yet.
      immutable($scope.data, "lastUpdated", function () {
        return scope.lastUpdated($scope, meta);
      });

      // safe retrieval of a property that creates it if it doesn't exist.
      immutable($scope, "get", function (property) {
        if ($scope[property]) return $scope[property];

        scope.create.key($scope, property);

        console.warn("Error. This property with name '" + property + "' doesn't exist yet.");

        return $scope[property];
      });

      // create event object for adding event functions.
      immutable($scope, "event", listeners());

      // creation of a native data object that is bound to the $scope.
      immutable($scope.data, "prop", function (property, key, value) {
        if (!$scope[property]) {
          scope.create.key($scope, property);
          console.warn("The property with name '" + property + "' doesn't exist yet, but was just created.");
        }

        $scope[property].data[key] = value;

        return $scope[property].data[key];
      });

      immutable($scope.data, "transfer", function (view, key) {
        var data = $scope.data[key];

        if (typeof data == "undefined" || data === null)
          throw "Error. Data associated with key '" + key + "' does not exist.";
        if (meta.routes[view]) {
          meta.routes[view].state.data[key] = data;
        } else throw "Error. View with the name '" + name + "' does not exist.";
      });

      immutable($scope.data, "repeat", {});

      scope.toolkit($scope);
    }
  },

  repeat: function ($scope) {
    var util = module.get("util"),
        immutable = util.immutable;

    immutable($scope, "repeat", function (name) {
      if ($scope.data.repeat[name]) {
        return $scope.data.repeat[name];
      } else console.warn("Error. Repeat associated with key '" + name + "' does not exist yet.");
    });
  },

  removeAllNodeRefs: function ($scope) {
    var util = module.get("util");

    for (var x in $scope) {
      if ($scope[x].self) {
        util.tempUnlock($scope[x], "self", function (obj) {
          obj.self = [];
        });
      }
    }

    return $scope;
  }
});
