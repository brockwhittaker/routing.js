var Repeater = function (name, node, arr, repeatParent) {
  var meta = {
    original: null,
    marker: null,
    data: [],
    elems: [],
    viewModifier: {}
  };

  var _funcs = {
    // this is the args for push, unshift, and modify. We want to normalize these.
    normalizeArgs: function (index, data, viewModifier, callback) {
      var obj = {
        index: index,
        data: data,
        viewModifier: viewModifier,
        callback: callback
      };

      // this means they actually only gave a callback.
      if (typeof viewModifier == "function") {
        obj.callback = viewModifier;
        delete obj.viewModifier;
      }

      return obj;
    },

    clone: function (obj) {
      // http://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object.
      // answer provided by `A. Levy` -- retrieved on 7/28/16.
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null === obj || typeof obj !== "object") return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    // recursively merge obj1 (and overwrite) in obj1.
    merge: function (obj1, obj2) {
      for (var p in obj2) {
        try {
          // Property in destination object set; update its value.
          if (obj2[p].constructor == Object) {
            obj1[p] = MergeRecursive(obj1[p], obj2[p]);
          } else {
            obj1[p] = obj2[p];
          }
        } catch(e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];
        }
      }

      return obj1;
    },

    // loop through all valid properties of an object and provide a callback
    // in value, key order.
    objectLoop: function (obj, callback) {
      for (var x in obj) {
        if (obj.hasOwnProperty(x)) {
          callback(obj[x], x);
        }
      }
    },

    // generate a quick elem ID with Math.random() -- doesn't have to be crypto
    // secure generated.
    generateID: function () {
      return (Math.random() * 1E16).toString(32);
    },

    // take in an array and push the elems to the element list and the data to
    // the data list, while creating an HTML template based off the data.
    generateFromArray: function (arr) {
      for (var x = 0; x < arr.length; x++) {
        var parent = this.createNodeFromTemplate(arr[x]);
        parent.index = x;

        parent.repeat = actions;

        meta.marker.parentNode.insertBefore(parent, meta.marker);

        // bind an ID to both the node and array.
        _funcs.bindID(parent, arr[x]);

        parent.bParent = repeatParent;
        meta.elems.push(parent);
        meta.data.push(arr[x]);
      }

      // we don't want to remove the marker unless there are already nodes.
      if (arr.length > 0)
        meta.marker.parentNode.removeChild(meta.marker);
    },

    // this is the auto-run function that creates the marker and removes the
    // original template node to store in the closure.
    init: function (name, node, arr, actions) {
      // create a new repeater reference in the window scope.
      if (!window._Repeater) window._Repeater = {};

      if (name) {
        // put a reference to _private meta in the window scope.
        window._Repeater[name] = actions;
      }

      var id = this.generateID();
      meta.marker = this.createMarker(
        this.generateID(),
        node.parentNode.tagName.toLowerCase()
      );

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

    // create a marker in the DOM so that we know where the b-repeat should
    // start at.
    createMarker: function (id, tagName) {
      var nodeType = {
        "tbody": "tr",
        "thead": "tr",
        "table": "tr",
        "tr": "td"
      };

      var div = document.createElement(nodeType[tagName] || "div");

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

      set: function (node, obj, viewModifier, parent) {
        var map = {
          "b-prop": "innerHTML",
          "b-src": "src",
          "b-href": "href",
          "b-style": null,
          "b-class": "class"
        };

        var attr, val, cb;

        _funcs.objectLoop(map, function (o, i) {
          attr = node.getAttribute(i);

          if (typeof attr !== "undefined" && attr !== null) {
            switch (i) {
              // if the attribute `b-style` is present, look for an object of
              // props to set and if they exist, apply them to `node.style`.
              case "b-style":
                val = _funcs.parse.dotToObj(obj, attr);

                if (val && typeof val == "object") {
                  _funcs.objectLoop(val, function (value, key) {
                    node.style[key] = value;
                  });
                }
                break;

              case "b-prop":
                val = _funcs.parse.dotToObj(obj, attr);
                cb = _funcs.parse.dotToObj(viewModifier || {}, attr);

                node[o] = cb ? cb(val) : (val || "");
                break;

              // look for the value inside the object by prop, as well as a
              // formatter function for the HTML. Try to give a formatted answer
              // before a raw data answer.
              default:
                val = _funcs.parse.dotToObj(obj, attr);
                cb = _funcs.parse.dotToObj(viewModifier || {}, attr);


                node.setAttribute(o, cb ? cb(val) : val);
            }
          }
        });
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

    createNodeFromTemplate: function (obj, viewModifier) {
      var parent = meta.original.cloneNode(true),
          nodes = parent.querySelectorAll("*");

      if (viewModifier) meta.viewModifier = viewModifier;

      var path, arr;

      for (var x = 0; x < nodes.length; x++) {
        if (nodes[x].hasAttribute("b-repeat-in")) {
          path = nodes[x].getAttribute("b-repeat-in");

          arr = _funcs.parse.dotToObj(obj, path);

          if (!this.node.isInsideBRepeatIn(nodes[x], parent)) {
            if (!parent.repeat) parent.repeat = {};
            var name = nodes[x].getAttribute("b-name");
            nodes[x].bParent = parent;

            if (name) parent.repeat[name] = Repeater(null, nodes[x], arr, parent);
            else parent.repeat[path] = Repeater(null, nodes[x], arr, parent);
          }
        }

        if (!this.node.isInsideBRepeatIn(nodes[x], parent)) {
          this.node.set(nodes[x], obj, viewModifier, parent);
          nodes[x].bParent = parent;
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
          this.node.set(nodes[x], obj, meta.viewModifier, parent);
          nodes[x].bParent = parent;
        }
      }

      parent.removeAttribute("b-repeat");

      parent.cloned = true;

      return parent;
    },

    parse: {
      dotToObj: function (obj, path) {
        if (typeof path == "string") {
          path = path.split(/\./);

          for (var x = 0; x < path.length; x++) {
            // go deeper as long as you can to find the specified object.
            if (typeof obj[path[x]] !== "undefined" && obj[path[x]] !== null) {
              obj = obj[path[x]];
            // if it cannot complete the whole path, just return early `undefined`.
            } else return;
          }

          return obj;
        } else throw "Error. Path must be a string.";
      }
    },

    DOM: {
      transferProps: function (old_node, new_node) {
        // give the new parent the old repeat attribute.
        // replace the old meta.elems[index] with the new parent in the DOM.
        ["repeat", "dataset", "bParent"].forEach(function (o) {
          new_node[o] = old_node[o];
        });
      },
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

      // make the `__meta` property none enumerable or writable.
      // set the value to the { id }.
      Object.defineProperty(obj, "__meta", {
        writable: false,
        configurable: true,
        enumerable: false,
        value: { id: id }
      });

      node.dataset.b_id = id;
    }
  };

  var actions = {
    // the data is the raw data to be stored, but the viewModifier is an object
    // of callbacks in the same structure as data that specifies how some props
    // should be rendered before being displayed.
    push: function (data, callback) {
      if (Array.isArray(data)) {
        data.forEach((function (o, i) {
          this.push(o, callback);
        }).bind(this));
      } else {
        // create a node with data and a view modifying template.
        var node = _funcs.createNodeFromTemplate(data, meta.viewModifier);
        // bind a randomly generated ID to the node.
        _funcs.bindID(node, data);

        _funcs.DOM.push(node);

        meta.data.push(data);
        meta.elems.push(node);

        if (callback) callback(node);
      }
    },
    // instead of pushing to the end of the sequence, add to the beginning of
    // the sequence right after the marker.
    unshift: function (data, callback) {
      if (Array.isArray(data)) {
        data.forEach(function (o, i) {
          this.unshift(o, callback);
        });
      } else {
        var node = _funcs.createNodeFromTemplate(data, meta.viewModifier);

        _funcs.bindID(node, data);

        _funcs.DOM.unshift(node);

        meta.data.unshift(data);
        meta.elems.unshift(node);

        if (callback) callback(node);
      }
    },

    // index has been moved to the first position instead of being the second (??).
    at: function (index, data, callback) {
      var node = _funcs.createNodeFromTemplate(data, meta.viewModifier);
      _funcs.bindID(node, data);

      _funcs.DOM.at(node, index);

      meta.data.splice(index, 0, data);
      meta.elems.splice(index, 0, node);

      if (callback) callback(node);
    },
    // remove the last node from the `b-repeat`.
    pop: function () {
      _funcs.DOM.pop();

      meta.data.pop();
      meta.elems.pop();
    },
    // remove the first node from the `b-repeat`.
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
    get: function () {
      return meta.data;
    },
    modify: function (index, obj) {
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

      _funcs.merge(meta.data[index], obj);

      var parent = _funcs.createNodeFromNode(
        meta.data[index],
        meta.elems[index],
        meta.viewModifier
      );

      _funcs.DOM.transferProps(meta.elems[index], parent);

      _funcs.DOM.replace(meta.elems[index], parent);
      // now set the meta.elems[index] to the new parent.
      meta.elems[index] = parent;
    },

    modifyEach: function (func) {
      for (var x = 0; x < meta.elems.length; x++) {
        func(meta.data[x], x);

        this.modify(x, meta.data[x]);
      }
    },

    modifyView: function (viewModifier) {
      meta.viewModifier = viewModifier;

      // trigger refresh with the new viewModifier.
      this.modifyEach(function () {
        // do nothing.
      });
    }
  };

  _funcs.init(name, node, arr, actions);

  return actions;
};

module.set("repeater", Repeater);
