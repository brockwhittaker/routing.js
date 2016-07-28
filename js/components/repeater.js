if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(nextSource);
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

var Repeater = function (name, node, arr) {
  var meta = {
    original: null,
    marker: null,
    data: [],
    elems: []
  };

  var _funcs = {
    generateID: function () {
      return (Math.random() * 1E16).toString(32);
    },

    generateFromArray: function (arr, actions) {
      for (var x = 0; x < arr.length; x++) {
        var parent = this.createNodeFromTemplate(arr[x]);
        parent.index = x;

        meta.marker.parentNode.insertBefore(parent, meta.marker);

        meta.elems.push(parent);
        meta.data.push(arr[x]);
      }

      meta.marker.parentNode.removeChild(meta.marker);
    },

    init: function (name, node, arr, actions) {
      // create a new repeater reference in the window scope.
      if (!window._Repeater) window._Repeater = {};

      if (name) {
        // put a reference to _private meta in the window scope.
        window._Repeater[name] = actions;
      }

      var id = this.generateID();
      meta.marker = this.createMarker(this.generateID());

      // clone the original and store it.
      meta.original = this.node.store(node);

      // insert before the current node.
      node.parentNode.insertBefore(meta.marker, node);

      node.parentNode.removeChild(node);

      if (arr) {
        this.generateFromArray(arr, actions);
        //document.body.removeChild(meta.marker);
      }
    },

    createMarker: function (id) {
      var div = document.createElement("div");

      div.className = "_marker";
      div.style.visibility = "hidden";
      div.style.display = "none";
      div.hidden = true;

      div.dataset.id = id;

      return div;
    },

    node: {
      store: function (node) {
        var copy = node.cloneNode(true);

        if (copy.hasAttribute("b-repeat-in")){
          copy.removeAttribute("b-repeat-in");
          copy.setAttribute("b-repeated-in", true);
        }

        return copy;
      },

      set: function (node, obj) {
        var map = {
          "b-prop": "innerHTML",
          "b-src": "src",
          "b-href": "href"
        };

        var attr, val;
        for (var x in map) {
          if (map.hasOwnProperty(x)) {
            attr = node.getAttribute(x);
            if (typeof attr !== "undefined" && attr !== null) {
              val = _funcs.parse.dotToObj(obj, attr);

              //node.removeAttribute(x);
              node[map[x]] = val;
            }
          }
        }
      },

      isInsideBRepeatIn: function (node, parent) {
        while (node.parentNode) {
          node = node.parentNode;
          if (node.isSameNode(parent)) return false;
          else if (node.hasAttribute("b-repeat-in") || node.hasAttribute("b-repeated-in")) return true;
        }

        return false;
      }
    },

    createNodeFromTemplate: function (obj) {
      var parent = meta.original.cloneNode(true),
          nodes = parent.querySelectorAll("*");

      var path, arr;

      for (var x = 0; x < nodes.length; x++) {
        if (nodes[x].hasAttribute("b-repeat-in")) {
          path = nodes[x].getAttribute("b-repeat-in");
          arr = _funcs.parse.dotToObj(obj, path);

          if (!this.node.isInsideBRepeatIn(nodes[x], parent)) {
            if (!parent.repeat) parent.repeat = {};
            var name = nodes[x].getAttribute("b-name");

            if (name) parent.repeat[name] = Repeater(null, nodes[x], arr);
            else parent.repeat[path] = Repeater(null, nodes[x], arr);
          }

          console.log(parent, parent.repeat);
        }

        if (!this.node.isInsideBRepeatIn(nodes[x], parent)) {
          this.node.set(nodes[x], obj);
        }
      }

      parent.removeAttribute("b-repeat");

      return parent;
    },

    createNodeFromNode: function (obj, node) {
      var parent = node.cloneNode(true),
          nodes = parent.querySelectorAll("*");

      var path, arr;

      for (var x = 0; x < nodes.length; x++) {
        if (!this.node.isInsideBRepeatIn(nodes[x], parent)) {
          this.node.set(nodes[x], obj);
        }
      }

      parent.removeAttribute("b-repeat");

      return parent;
    },

    parse: {
      dotToObj: function (obj, path) {
        if (typeof path == "string") {
          path = path.split(/\./);

          for (var x = 0; x < path.length; x++) {
            if (typeof obj[path[x]] !== "undefined" && obj[path[x]] !== null) {
              obj = obj[path[x]];
            } else {
              // console.warn("Warning. Path " + path.join(".") + " does not exist.");
            }
          }

          return obj;
        } else throw "Error. Path must be a string.";
      }
    },

    DOM: {
      _inner: {
        after: function (newNode, refNode) {
          if (!refNode) {
            this.after(newNode, meta.marker);
          } else if (refNode.nextSibling) {
            this.before(newNode, refNode.nextSibling);
          } else if (refNode.parentNode) {
            refNode.parentNode.appendChild(newNode);
          }
        },

        before: function (newNode, refNode) {
          refNode.parentNode.insertBefore(newNode, refNode);
        },

        prepend: function (newNode) {
          this.after(newNode, meta.marker);
        },

        append: function (newNode) {
          this.after(newNode, meta.elems[meta.elems.length - 1]);
        },

        at: function (newNode, index) {
          if (meta.elems[index]) {
            this.before(newNode, meta.elems[index]);
          } else {
            this.append(newNode);
          }
        },

        remove: function (node) {
          node.parentNode.removeChild(node);
        },

        removeAt: function (index) {
          if (meta.elems[index]) {
            this.remove(meta.elems[index]);
          }
        }
      },

      push: function (node) {
        this._inner.append(node);
      },

      unshift: function (node) {
        this._inner.prepend(node);
      },

      at: function (node, index) {
        this._inner.at(node, index);
      },

      pop: function () {
        this._inner.removeAt(meta.elems.length - 1);
      },

      shift: function () {
        this._inner.removeAt(0);
      },

      removeAt: function (index) {
        this._inner.removeAt(index);
      },

      replace: function (old_node, new_node) {
        old_node.parentNode.replaceChild(new_node, old_node);
      }
    },
    bindID: function (node, obj) {
      var id = this.generateID();

      obj.__meta = { id: id };
      node.dataset.b_id = id;
    }
  };

  var actions = {
    push: function (data, callback) {
      if (Array.isArray(data)) {
        data.forEach((function (o) {
          this.push(o, callback);
        }).bind(this));
      } else {
        var node = _funcs.createNodeFromTemplate(data);
        _funcs.bindID(node, data);

        _funcs.DOM.push(node);

        meta.data.push(data);
        meta.elems.push(node);

        if (callback) callback(node);
      }
    },
    unshift: function (data, callback) {
      var node = _funcs.createNodeFromTemplate(data);
      _funcs.bindID(node, data);

      _funcs.DOM.unshift(node);

      meta.data.unshift(data);
      meta.elems.unshift(node);

      if (callback) callback(node);
    },
    at: function (data, index, callback) {
      var node = _funcs.createNodeFromTemplate(data);
      _funcs.bindID(node, data);

      _funcs.DOM.at(node, index);

      meta.data.splice(index, 0, data);
      meta.elems.splice(index, 0, node);

      if (callback) callback(node);
    },
    pop: function () {
      _funcs.DOM.pop();

      meta.data.pop();
      meta.elems.pop();
    },
    shift: function () {
      _funcs.DOM.shift();

      meta.data.shift();
      meta.elems.shift();
    },
    // you can either pass in a numeric index or you can pass in a node itself.
    remove: function (index) {
      var i = 0, id;
      if (typeof index == "object") {
        id = index.dataset.b_id;

        meta.data.forEach(function (o, i) {
          if (o.__meta.id == id) index = i;
        });

        if (typeof index == "object") {
          index = -1;
          throw "Error. This node couldn't be found in the repeat sequence.";
        }
      }

      _funcs.DOM.removeAt(index);

      meta.data.splice(index, 1);
      meta.elems.splice(index, 1);
    },
    filter: function (callback) {
      meta.data = meta.data.map(function (o) {
        return callback(o) ? o : false;
      });

      meta.elems = meta.elems.filter(function (o, i) {
        if (meta.data[i] === false) {
          _funcs.DOM._inner.remove(o);
          return false;
        } else return true;
      });

      meta.data = meta.data.filter(function (o) {
        return o;
      });
    },
    get: function (index) {
      var arr = Object.assign([], meta.data);

      arr.forEach(function (o) {
        delete o.__meta;
      });

      return arr;
    },
    modify: function (index, callback) {
      var i = 0, id;
      if (typeof index == "object") {
        id = index.dataset.b_id;

        meta.data.forEach(function (o, i) {
          if (o.__meta.id == id) index = i;
        });

        if (typeof index == "object") {
          index = -1;
          throw "Error. This node couldn't be found in the repeat sequence.";
        }
      }

      callback(meta.data[index]);

      var parent = _funcs.createNodeFromNode(meta.data[index], meta.elems[index]);

      // give the new parent the old repeat attribute.
      parent.repeat = meta.elems[index].repeat;
      // replace the old meta.elems[index] with the new parent in the DOM.
      _funcs.DOM.replace(meta.elems[index], parent);
      // now set the meta.elems[index] to the new parent.
      meta.elems[index] = parent;
    },

    modifyEach: function (callback) {
      var len = meta.elems.length;

      for (var x = 0; x < len; x++) {
        this.modify(x, callback.bind(null, meta.data[x], x));
      }
    }
  };

  _funcs.init(name, node, arr, actions);

  return actions;
};

funcs.repeater = Repeater;
