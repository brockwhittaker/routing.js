funcs.scope = {
  create: {
    key: function ($scope, key) {
      var immutable = funcs.util.immutable;

      if (!$scope[key]) {
        $scope[key] = {};

        immutable($scope[key], "data", {});
        immutable($scope[key], "self", []);
      }
    },

    // create a new scope property.
    scope: function (meta, $scope, routes) {
      var immutable = funcs.util.immutable;

      // make `event` in $scope immutable as well as `add` inside of
      // $scope.event. Also add `data` inside $scope for random user data.
      // create $scope level data object for storing state data.
      immutable($scope, "data", {});

      // safe retrieval of a property that creates it if it doesn't exist.
      immutable($scope, "get", function (property) {
        if ($scope[property]) return $scope[property];

        funcs.scope.create.key($scope, property);

        console.warn("Error. This property with name '" + property + "' doesn't exist yet.");

        return $scope[property];
      });

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

      immutable($scope, "repeat", function (name) {
        if ($scope.data.repeat[name]) {
          var $repeat = $scope.data.repeat[name],
              node = $repeat.node;

          return {
            push: function (obj) {
              // create a new instance of the node.
              node = node.cloneNode(true);
              // get values from b-obj and fill in innerHTML with the values.
              node = funcs.DOM.fillWithObjectProperties(node, obj);

              // add internal __meta property for keeping track of the node it
              // is associated with and whether it's been removed.
              obj.__meta = {
                node: node,
                removed: false
              };

              // push to the list.
              $repeat.list.push(obj);

              if ($repeat.meta.prev) {
                funcs.DOM.after(node, $repeat.meta.prev);
              } else {
                funcs.DOM.prepend(node, $repeat.meta.parent);
              }

              return this;
            },
            filter: function (callback) {
              $repeat.list.forEach(function (o) {
                console.log(callback(o), o);
                if (callback(o) === false) {
                  o.__meta.removed = true;
                }
              });

              $repeat.list = $repeat.list.filter(function (o) {
                if (o.__meta.removed) {
                  funcs.DOM.remove(o.__meta.node);
                  return false;
                } else return true;
              });

              return this;
            }
          };
        } else console.warn("Error. Repeat associated with key '" + name + "' does not exist yet.");
      });

      // creation of a native data object that is bound to the $scope.
      immutable($scope.data, "prop", function (property, key, value) {
        if (!$scope[property]) funcs.scope.create.key($scope, property);

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

      immutable($scope.data, "repeat", {});
    }
  }
};

/*
Create $scope.repeat({{name}}) which returns an object that you can push, pop, etc.
This is stored in $scope.data.repeat[name] and is *locked down*.

The $scope.data.repeat[name] is an object like:

{
  container: <NODE>,
  list: []
}

Where the container is cloned and the list is modified.
*/
