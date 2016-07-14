// a class to monitor mutations (changes) to the meta.container.
funcs.mutation = {

  // this initializes the observer class and then pins it to the meta.container.
  // inside the callback, it looks through each of the mutations and checks
  // if the type is "childList", and if so deploys a callback with the mutation
  // object.
  observe: function (meta, callback) {
    // create an observer instance

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type == "childList") {
          callback(mutation);
        }
      });
    });

    // a list of what these flags do: https://dom.spec.whatwg.org/#mutationobserver
    var config = { attributes: true, childList: true, characterData: true, subtree: true };

    // pin to the meta.observer object.
    observer.observe(meta.container, config);

    return observer;
  },

  // this takes a node, looks through to see if it is a node that can have
  // attributes (node.nodeType == 1), and then checks if it has a b-name
  // attribute. If so, it will then get a list of all events to be applied
  // by looking through the 'b-events' string and splitting by commas.
  // it then adds either an empty function or if there's a function already
  // specified it keeps it.
  addEventsToNode: function ($scope, node) {
    var DOMEvents = ["click", "input", "mousemove"];

    // create an empty function to put in place of null.
    var empty = function () {};

    // get a list of events by splitting by commas.
    var events = node.getAttribute("b-events"),
        name = node.getAttribute("b-name");



    // these require a name because these events are bound to a namespace.
    if (name) {
      // if the scope object for this doesn't exist, create it.
      funcs.scope.create.key($scope, name);

      if (document.body.contains(node) && $scope[name].self.indexOf(node) == -1) {
        $scope[name].self.push(node);
      }

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
    }

    // now check if the b-{{event}} attributes exist with values of callbacks
    // in the scope. Run the callbacks if they exist on event.
    // these events are not bound to a namespace.
    DOMEvents.forEach(function (event) {
      var cb_name = node.getAttribute("b-" + event);

      if (cb_name) {
        node.addEventListener(event, function (e) {
          if (typeof $scope[cb_name] == "function")
            $scope[cb_name].call(this, e);
        });
      }
    });
  },

  addRepeatToNode: function ($scope, node) {
    var repeatName = node.getAttribute("b-repeat");

    console.log("repeat", node);

    funcs.util.immutable($scope.data.repeat, repeatName, funcs.repeater(repeatName, node));
  },

  // remove nodes that
  removeNode: function ($currentScope, $oldScope, node) {
    if (node.nodeType === 1 && node.hasAttribute("b-name")) {
      var name = node.getAttribute("b-name"),
          $elem = $currentScope[name] || $oldScope[name];

      // unlock $scope[key].self so that I can run Array.prototype.filter on
      // it.
      funcs.util.mutable($elem, "self");

      // filter out any nodes that are the same as the ones that are being
      // removed from the DOM currently.
      $elem.self = $elem.self.filter(function (o) {
        return !node.isSameNode(o);
      });

      // make immutable again so that users cannot delete $scope[key].self.
      funcs.util.immutable($elem, "self");
    }
  },

  // it iterates through the nodeList and runs the above function to add
  // events.
  addEvents: function (meta) {
    var self = this;

    // run the self.addEventsToNode and self.addRepeatToNode functions on
    // the parent and all children nodes that are valid (o.nodeType == 1).
    var addEventsToAllNodes = function ($scope, parent) {
      var allNodes = funcs.DOM.parentAndChildren(parent);

      allNodes.forEach(function (o, i) {
        if (o.nodeType === 1) {
          self.addEventsToNode($scope.current, o);

          if (o.hasAttribute("b-repeat")) {
            self.addRepeatToNode($scope.current, o);
          }

          if (o.hasAttribute("b-repeat-in")) {
            //self.addRepeatInToNode($scope.current, o, i);
          }
        }
      });
    };

    // call the observer function to check for changes in the DOM. The callback
    // returns the observation results which will include .addedNode and
    // .removedNodes.
    meta.observe = this.observe(meta, function (mutation) {
      var added = mutation.addedNodes;
      var removed = mutation.removedNodes;

      // grab both the last scope and the current one.
      var $scope = {
        current: meta.routes[meta.view.current].state,
        old: meta.view.old ? meta.routes[meta.view.old].state: null
      };

      var x;

      for (x = 0; x < removed.length; x++) {
        self.removeNode($scope.current, $scope.old, removed[x]);
      }

      for (x = 0; x < added.length; x++) {
        addEventsToAllNodes($scope, added[x]);
      }
    });
  }
};
