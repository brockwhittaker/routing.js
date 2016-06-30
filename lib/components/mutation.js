// a class to monitor mutations (changes) to the meta.container.
funcs.mutation = {

  // this initializes the observer class and then pins it to the meta.container.
  // inside the callback, it looks through each of the mutations and checks
  // if the type is "childList", and if so deploys a callback with the mutation
  // object.
  observe: function (callback) {
    // create an observer instance
    meta.observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type == "childList") {
          callback(mutation);
        }
      });
    });

    var config = { attributes: true, childList: true, characterData: true };
    // pin to the meta.observer object.
    meta.observer.observe(meta.container, config);
  },

  // this takes a node, looks through to see if it is a node that can have
  // attributes (node.nodeType == 1), and then checks if it has a b-name
  // attribute. If so, it will then get a list of all events to be applied
  // by looking through the 'b-events' string and splitting by commas.
  // it then adds either an empty function or if there's a function already
  // specified it keeps it.
  addEventsToNode: function (node) {
    var DOMEvents = ["click", "input", "mousemove"];

    // grab the proper scope.
    var $scope = meta.routes[meta.view.current].state;

    // create an empty function to put in place of null.
    var empty = function () {};

    if (node.nodeType === 1 && node.hasAttribute("b-name")) {
      // get a list of events by splitting by commas.
      var events = node.getAttribute("b-events"),
          name = node.getAttribute("b-name");

      // if the scope object for this doesn't exist, create it.
      funcs.util.createScopeKey($scope, name);

      $scope[name].self.push(node);

      if (events) {
        // add each event.
        events.split(/,/).forEach(function (event) {
          $scope[name][event] = $scope[name][event] || empty;

          // add the event listener for each event.
          node.addEventListener(event, function (e) {
            $scope[name][event].call(this, e);
          });
        });
      }

      // now check if the b-{{event}} attributes exist with values of callbacks
      // in the scope. Run the callbacks if they exist on event.
      DOMEvents.forEach(function (event) {
        var cb_name = node.getAttribute("b-" + event);
        if (cb_name) {
          node.addEventListener(event, function (e) {
            if (typeof $scope[cb_name] == "function")
              $scope[cb_name].call(this, e);
          });
        }
      });
    }
  },

  // remove nodes that
  removeNode: function (node) {
    if (node.nodeType === 1 && node.hasAttribute("b-name")) {
      var name = node.getAttribute("b-name"),
          $scope = meta.routes[meta.view.current].state,
          $elem = $scope[name] || meta.routes[meta.view.old].state[name];

      // unlock $scope[key].self so that I can run Array.prototype.filter on
      // it.
      funcs.util.mutable($elem, "self");

      // filter out any nodes that are the same as the ones that are being
      // removed from the DOM currently.
      $elem.self = $elem.self.filter(function (o) {
        return (!node.isSameNode(o));
      });

      // make immutable again so that users cannot delete $scope[key].self.
      funcs.util.immutable($elem, "self");
    }
  },

  // this runs the callback when a mutation occurs and is the proper type.
  // it iterates through the nodeList and runs the above function to add
  // events.
  addEvents: function (callback) {
    var self = this;

    this.observe(function (mutation) {
      var added = mutation.addedNodes;
      var removed = mutation.removedNodes;

      var x;

      for (x = 0; x < removed.length; x++) {
        self.removeNode(removed[x]);
      }

      for (x = 0; x < added.length; x++) {
        self.addEventsToNode(added[x]);
      }
    });
  }
};
