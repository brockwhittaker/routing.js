funcs.scope.repeat = function ($scope) {
  var immutable = funcs.util.immutable;

  immutable($scope, "repeat", function (name) {
    if ($scope.data.repeat[name]) {
      var $repeat = $scope.data.repeat[name],
          node = $repeat.node;

      var operations = {
        // generate a random ID for nodes.
        generateID: function () {
          return Math.round(Math.random() * 100000000000).toString(36) + "_" + new Date().getTime();
        },
        // clone the node and change b-obj to innerHTML with object values.
        processNode: function (node, obj) {
          // create a new instance of the node.
          node = node.cloneNode(true);
          // get values from b-obj and fill in innerHTML with the values.
          funcs.DOM.fillWithObjectProperties(node, obj);

          return node;
        },

        // add a __meta attribute to keep track of the node that an object of
        // data is tied to and whether or not it is in queue to be removed.
        processObject: function (obj, node) {

          obj.__meta = {
            node: node,
            removed: false,
            id: this.generateID()
          };

          node.setAttribute("b-id", obj.__meta.id);

          return obj;
        },

        // get the nearest valid sibling of an object.
        validSibling: function (index) {
          var $sibling,
              isParent = false;

          // check if sibling at desired index exists. This is most ideal.
          if ($repeat.list[index]) {
            $sibling = $repeat.list[index].__meta.node;
          // otherwise get the last element in the array (length - 1).
          } else if ($repeat.list[$repeat.list.length - 1]) {
            $sibling = $repeat.list[$repeat.list.length - 1].__meta.node;
          // otherwise, get the meta.prev of the original inserted node.
          } else if ($repeat.list.meta.prev) {
            $sibling = $repeat.list.meta.prev;
          // and last ditch effort, get the parent node of the original node.
          } else {
            isParent = true;
            $sibling = $repeat.list.meta.parent;
          }

          // tell whether or not the retrieved node is the same level or
          // if it is a parent node.
          return { node: $sibling, parent: isParent };
        },

        // a small wrapper function for processing the node and the object.
        procedural: function (node, obj) {
          node = this.processNode(node, obj);
          obj = this.processObject(obj, node);

          return { node: node, object: obj };
        },

        // add to the beginning of the container and array.
        prepend: function (node, obj) {
          $repeat.list.unshift(obj);

          if ($repeat.meta.prev) {
            funcs.DOM.after(node, $repeat.meta.prev);
          } else {
            funcs.DOM.prepend(node, $repeat.meta.parent);
          }
        },

        // append to the end of the container and array.
        push: function (node, obj) {
          var $last = $repeat.list[$repeat.list.length - 1];

          console.log($last, $repeat.meta);

          if ($last) {
            funcs.DOM.after(node, $last.__meta.node);
          } else if ($repeat.meta.prev) {
            funcs.DOM.after(node, $repeat.meta.prev);
          } else {
            funcs.DOM.append(node, $repeat.meta.parent);
          }

          $repeat.list.push(obj);
        },

        // add at a desired index in the container and array.
        at: function (node, obj, index) {
          var $index = $repeat.list[index];

          // if the index exists, splice and add the node without removing any.
          if ($index) {
            $repeat.list.splice(index, 0, node);
            funcs.DOM.before(node, $repeat.list[index + 1].__meta.node);
          // otherwise, use the push function to push to wherever the end is.
          } else {
            $repeat.list.push(obj);
            this.push(node, obj);

            console.warn("Error. No node with index '" + index + "'. Node pushed instead.");
          }
        }
      };

      return {
        unshift: function (obj) {
          var comps = operations.procedural(node, obj);
          operations.prepend(comps.node, comps.object);

          return this;
        },

        at: function (obj, index) {
          var comps = operations.procedural(node, obj);
          operations.at(comps.node, comps.object, index);

          return this;
        },

        push: function (obj) {
          var comps = operations.procedural(node, obj);
          operations.push(comps.node, comps.object);

          return this;
        },

        // a filter function to iterate through all objects, check if they
        // qualify to continue existing and if not, remove them from the
        // array and the DOM.
        filter: function (callback) {
          $repeat.list.forEach(function (o) {
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
        },

        // remove a node with a particular ID.
        remove: function (id) {
          // in this case, they passed the node they want to delete. No problem.
          // just get the b-id of it.

          if (typeof id == "object") id = id.getAttribute("b-id");
          
          this.filter(function (o) {
            return o.__meta.id !== id;
          });
        }
      };
    } else console.warn("Error. Repeat associated with key '" + name + "' does not exist yet.");
  });
};
