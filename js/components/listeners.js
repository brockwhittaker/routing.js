var Listeners = function () {
  var meta = {
    events: {},
    nodes: {}
  };

  var _funcs = {
    findInArray: function (arr, callback) {
      var flag = false;

      arr.forEach(function (o) {
        flag = flag || callback(o);
      });

      return flag;
    },

    addListener: function (node, name, type) {
      var self = this;

      node.addEventListener(type, function (e) {
        // run through each of the events and call them with thisArg and e.
        self.applyAllEvents(name, type, (function (func) {
          if (func[2])
            func[0].call(this, e);
        }).bind(this));
      });
    },

    addPrevListeners: function (name) {
      // check if there's any previous events to apply.
      if (meta.events[name]) {
        var self = this;

        var listenerTypes = Object.keys(meta.events[name]);

        listenerTypes.forEach(function (type) {
          self.updateClassEvents(name, type);
        });
      }
    },

    // if nodes are not part of the document, remove their references.
    // though this really doesn't matter too much since we traverse arrays backwards
    // and these nodes aren't ever activated by event listeners.
    // we're only doing this for memory reasons.
    purgeDeadNodes: function (name) {
      // check if there are nodes of this type (there should be!).
      if (meta.nodes[name]) {
        meta.nodes[name] = meta.nodes[name].filter(function (o) {
          return document.body.contains(o[0]);
        });
      }
    },

    addIndividualEvent: function (bName, event, funcName, func) {
      if (!meta.events[bName][event]) meta.events[bName][event] = [];

      var ifFuncExists = function (o) {
        return o[1] == funcName;
      };

      if (!this.findInArray(meta.events[bName][event], ifFuncExists)) {
        // function[Function], name[String], enabled[Bool]
        meta.events[bName][event].push([func, funcName, true]);
      } else {
        console.warn("A function with the name `" + funcName + "` already exists.");
      }
    },

    removeEvent: function (name, type, funcName) {
      if (meta.events[name] && meta.events[name][type]) {
        meta.events[name][type] = meta.events[name][type].filter(function (o) {
          return o[1] !== funcName;
        });
      }
    },

    disableEvent: function (name, type, funcName) {
      if (meta.events[name] && meta.events[name][type]) {
        var events = meta.events[name][type];
        for (var x = 0; x < events.length; x++) {
          if (events[x][1] == funcName) {
            events[x][2] = false;
            return;
          }
        }
      }
    },

    enableEvent: function (name, type, funcName) {
      if (meta.events[name] && meta.events[name][type]) {
        var events = meta.events[name][type];
        for (var x = 0; x < events.length; x++) {
          if (events[x][1] == funcName) {
            events[x][2] = true;
            return;
          }
        }
      }
    },

    // add a new event type to the series of nodes.
    // this works well because if there's 100 nodes and none have a click ev
    // that is applied, it will apply to all 100, however if you append a new node
    // it will check all events and update all events for the first node and stop
    // there because no others need new events.
    updateClassEvents: function (name, type) {
      // if there exists nodes in this category yet..
      if (meta.nodes[name]) {
        this.purgeDeadNodes(name);

        // for each of the nodes in the b-name class..
        // start from the newest nodes.
        // once you reach a node that has an EL, all before it should/will have one.
        var node;
        // BUG: I put x > 0, not x >= 0. BAD.
        for (var x = meta.nodes[name].length - 1; x >= 0; x--) {
          // in structure [node, {types}].
          node = meta.nodes[name][x];

          // if the type of event hasn't been initialized yet, initialize it.

          if (!node[1][type]) {
            this.addListener(node[0], name, type);
            // now flag that this event type has been added.
            node[1][type] = true;
          } else break;
        }
      }
    },

    applyAllEvents: function (name, type, callback) {
      meta.events[name][type].forEach(function (o) {
        callback(o);
      });
    },

    // loop through an object and provide a callback for valid properties.
    objectLoop: function (obj, callback) {
      for (var x in obj) {
        if (obj.hasOwnProperty(x)) {
          callback(obj[x], x);
        }
      }
    }
  };

  return {
    add: function (name, events) {
      if (!meta.events[name]) meta.events[name] = {};

      // loop through event types (mousemove, click, touchstart, etc.).
      _funcs.objectLoop(events, function (event, type) {
        // loop through the functions (doSomethingOnClick, onMouseHighlightThis, etc.).

        _funcs.objectLoop(event, function (func, i) {
          _funcs.addIndividualEvent(name, type, i, func);
          _funcs.updateClassEvents(name, type);
        });
      });
    },

    remove: function (name, type, funcName) {
      _funcs.removeEvent(name, type, funcName);
    },

    enable: function (name, type, funcName) {
      _funcs.enableEvent(name, type, funcName);
    },

    disable: function (name, type, funcName) {
      _funcs.disableEvent(name, type, funcName);
    },

    _addNode: function (name, node) {
      if (!meta.nodes[name]) meta.nodes[name] = [];

      meta.nodes[name].push([node, {}]);
      _funcs.addPrevListeners(name);
    },

    _removeNode: function (name, node) {
      if (meta.nodes[name]) {
        meta.nodes[name] = meta.nodes[name].filter(function (o) {
          return !node.isSameNode(o[0]);
        });
      }
    },

    _test: function () {
      return meta;
    }
  };
};

funcs.listeners = Listeners;
