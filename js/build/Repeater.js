var Repeater = function (name, node, arr) {
  var meta = {
    original: null,
    data: []
  };

  var funcs = {
    generateID: function () {
      return (Math.random() * 1E16).toString(32);
    },

    generateFromArray: function (arr, actions) {
      for (var x = 0; x < arr.length; x++) {
        var parent = funcs.createNodeFromTemplate(arr[x]);
        meta.marker.parentNode.insertBefore(parent, meta.marker);
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

      if (document.body.contains(node)) {
        document.body.removeChild(node);
      } else if (node.parentNode) {
        node.parentNode.removeChild(node);
      }

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

        copy.removeAttribute("b-repeat-in");

        return copy;
      },

      set: function (node, obj, path) {
        var value = funcs.parse.dotToObj(obj, path);

        node.removeAttribute("b-prop");
        node.innerHTML = value;
      },

      isInsideBRepeatIn: function (node) {
        while (node.parentNode) {
          node = node.parentNode;
          if (node.hasAttribute("b-repeat-in")) return true;
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
          arr = funcs.parse.dotToObj(obj, path);

          Repeater(null, nodes[x], arr);
        }

        if (nodes[x].hasAttribute("b-prop") && !this.node.isInsideBRepeatIn(nodes[x])) {
          this.node.set(nodes[x], obj, nodes[x].getAttribute("b-prop"));
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
    }
  };

  var actions = {
    push: function (data) {
      meta.data.push(data);
      document.body.appendChild(funcs.createNodeFromTemplate(data));
      //console.log(funcs.createNodeFromTemplate(data));
    },
    unshift: function (data) {
      meta.data.unshift(data);
    },
    pop: function () {
      meta.data.pop();
    },
    shift: function () {
      meta.data.shift();
    },
    remove: function (index) {
      meta.data.splice(index, 1);
    },
    insert: function (data, index) {
      meta.data.splice(index, 0, data);
    },
    filter: function (o, i) {
      meta.data = meta.data.filter(function (o, i) {
        return callback(o, i);
      });
    }
  };

  funcs.init(name, node, arr, actions);

  return actions;
};

var repeat = new Repeater("main", document.querySelectorAll("[b-repeat]")[0]);

var obj = {
  name: "test",
  number: "520.450.7207",
  ipAddress: "192.168.0.1",
  numbers: [
    {number: 4, letters: [
      {letter: "a"},
      {letter: "b"}
    ]},
    {number: 2, letters: [
      {letter: "c"}
    ]},
    {number: 1}
  ]
};

var d = new Date();
for (var x = 0; x < 1000; x++) {
  repeat.push(obj);
}
console.log(new Date() - d);
