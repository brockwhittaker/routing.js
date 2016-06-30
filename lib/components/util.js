funcs.util = {

  // creating an immutable property of an object.
  immutable: function (obj, key, value) {
    var config = {
      writable: false,
      configurable: true
    };

    // if there's no value, don't set the property so it doesn't overwrite
    // any previous content.
    if (value) config.value = value;

    Object.defineProperty(obj, key, config);

    return this;
  },

  mutable: function (obj, key) {
    Object.defineProperty(obj, key, {
      writable: true
    });
  },

  // create a new scope property.
  createScopeKey: function ($scope, key) {
    var immutable = funcs.util.immutable;

    if (!$scope[key]) {
      $scope[key] = {};

      immutable($scope[key], "data", {});
      immutable($scope[key], "self", []);
    }
  },

  createScope: function (meta, $scope, routes) {
    var immutable = funcs.util.immutable;

    // make `event` in $scope immutable as well as `add` inside of
    // $scope.event. Also add `data` inside $scope for random user data.
    // create $scope level data object for storing state data.
    immutable($scope, "data", {});

    // create event object for adding event functions.
    immutable($scope, "event", {});
    // create the $scope.event.add function to add custom events.
    immutable($scope.event, "add",
      (function (property, event, callback) {
        // if the property doesn't exist, create a new wrapper object.
        if (!this[property]) this[property] = {};

        // if the event is an object, it's an iterable with multiple events.
        if (typeof event == "object") {
          // so run through it and take the key as the event and the value
          // as the callback.
          for (var x in event) {
            this[property][x] = event[x];
          }
        } else {
          // otherwise just set the event [key] to the callback [value].
          this[property][event] = callback;
        }
        // make thisArg the current state.
      }).bind($scope)
    );

    // safe retrieval of a property that creates it if it doesn't exist.
    immutable($scope, "get", function (property) {
      if ($scope[property]) return $scope[property];

      funcs.util.createScopeKey($scope, property);

      console.warn("Error. This property with name '" + property + "' doesn't exist yet.");

      return $scope[property];
    });

    // creation of a native data object that is bound to the $scope.
    immutable($scope.data, "prop", function (property, key, value) {
      if (!$scope[property]) funcs.util.createScopeKey($scope, property);

      $scope[property].data[key] = value;

      return $scope[property].data[key];
    });

    immutable($scope.data, "transfer", function (key, view) {
      var data = $scope.data[key];

      if (typeof data == "undefined" || data === null)
        throw "Error. Data associated with key '" + key + "' does not exist.";
      if (meta.routes[view]) {
        meta.routes[view].state.data[key] = data;
      } else throw "Error. View with the name '" + name + "' does not exist.";
    });
  }
};
