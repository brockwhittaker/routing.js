// pass in the ajax and repeater functions to the thisArg.
var TemplateBuilder = function (path) {
  var ajax = module.get("ajax"),
      repeater = module.get("repeater"),
      util = module.get("util");

  var meta = {
    templateString: [],
    templates: {},
    isComplete: false,
    onComplete: []
  };

  var funcs = {
    retrieveDocument: function (path) {
      if (path) {
        ajax(path, {
          success: (function (response) {
            meta.templateString = response;

            var templates = this.getAllTemplates(response);

            for (var x in templates) {
              if (templates[x])
                meta.templates[x] = templates[x];
              else console.warn("Error. The template `" + x + "` already exists.");
            }

            meta.isComplete = true;
            meta.onComplete.forEach(function (f) {
              f();
            });
          }).bind(this),
          error: function (response) {
            console.warn("Error. The template from path `" + path + "` is unreachable.");
          }
        }, true);
      }
    },

    getAllTemplates: function (string) {
      var div = document.createElement("div");
      div.innerHTML = string;

      var templates = {};
      var children = Array.prototype.slice.call(div.childNodes).filter(function (node) {
        return node.nodeType === node.ELEMENT_NODE;
      }).forEach(function (node) {
        var name = node.getAttribute("b-template");
        if (!templates[name] && name) {
          templates[name] = node;
        }
      });

      return templates;
    },

    init: function (path) {
      this.retrieveDocument(path);
    },

    set: function (node, obj, parent) {
      var map = {
        "b-prop": "innerHTML",
        "b-src": "src",
        "b-href": "href",
        "b-style": null
      };

      var attr, val, cb;

      util.objectLoop(map, function (o, i) {
        attr = node.getAttribute(i);

        if (typeof attr !== "undefined" && attr !== null) {
          switch (i) {
            // if the attribute `b-style` is present, look for an object of
            // props to set and if they exist, apply them to `node.style`.
            case "b-style":
              val = funcs.dotToObj(obj, attr);

              if (val && typeof val == "object") {
                util.objectLoop(val, function (value, key) {
                  node.style[key] = value;
                });
              }
              break;

            case "b-prop":
              val = funcs.dotToObj(obj, attr);
              node[o] = cb ? cb(val) : (val || "");
              break;

            // look for the value inside the object by prop, as well as a
            // formatter function for the HTML. Try to give a formatted answer
            // before a raw data answer.
            default:
              val = funcs.dotToObj(obj, attr);
              node.setAttribute(o, cb ? cb(val) : val);
          }
        }
      });
    },

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
    },

    isInsideBRepeatIn: function (node, parent) {
      while (node.parentNode) {
        node = node.parentNode;

        if (node.isSameNode(parent)) {
          return false;
        } else if (node.hasAttribute && (node.hasAttribute("b-repeat-in") || node.hasAttribute("b-repeated-in"))) {
          return true;
        }
      }

      return false;
    },

    createNodeFromTemplate: function (name, obj) {

      if (meta.templates[name]) {
        var parent = meta.templates[name].cloneNode(true);

        var nodes = Array.prototype.slice.call(parent.querySelectorAll("*")).concat(parent),
            path, arr;

        for (var x = 0; x < nodes.length; x++) {
          if (nodes[x].hasAttribute("b-repeat-in")) {
            path = nodes[x].getAttribute("b-repeat-in");
            arr = this.dotToObj(obj, path);

            if (!this.isInsideBRepeatIn(nodes[x], parent)) {
              if (!parent.repeat) parent.repeat = {};
              var bName = nodes[x].getAttribute("b-name");
              nodes[x].bParent = parent;

              if (bName) parent.repeat[bName] = Repeater(null, nodes[x], arr || [], parent);
              else parent.repeat[path] = Repeater(null, nodes[x], arr || [], parent);
            }
          }

          if (!this.isInsideBRepeatIn(nodes[x], parent)) {
            this.set(nodes[x], obj, {}, parent);
            nodes[x].bParent = parent;
          }
        }
        parent.removeAttribute("b-template");

        return parent;
      } else {
        console.warn("Error. The template for `" + name + "` does not exist.");
      }
    }
  };

  funcs.init(path);

  return {
    complete: function (cb) {
      meta.onComplete.push(cb);
      return this;
    },

    isComplete: function () {
      return meta.isComplete;
    },

    new: function (name, obj) {
      if (typeof name == "object") {
        var node = name;
        name = node.getAttribute("b-template");
        obj = funcs.dotToObj(window, node.getAttribute("b-data"));

        return funcs.createNodeFromTemplate(name, obj);
      } else {
        return funcs.createNodeFromTemplate(name, obj);
      }
    },

    path: function (path) {
      funcs.init(path);
    }
  };
};

module.set("template", TemplateBuilder);
