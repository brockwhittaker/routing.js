var ModuleBuilder = function () {
  // storing the modules here.
  var modules = {};

  // publicly accessible functions.
  return {
    // create a new module by name.
    // returns an `IndModule` closure to modify particular parts.
    new: function (name) {
      if (!modules[name]) {
        modules[name] = {};
        return new IndModule(modules[name]);
      } else console.warn("Error. Module with name `" + name + "` already exists.");
    },
    // find a module and return an IndModule instance by name.
    find: function (name) {
      if (modules[name]) {
        return new IndModule(modules[name]);
      } else console.warn("Error. Module with name `" + name + "` does not exist.");
    },
    // delete a module by name.
    delete: function (name) {
      if (modules[name]) {
        delete modules[name][key];
      } else console.warn("Error. Tried deleting module `" + name + "` but does not exist.");
    },
    // get the contents of a module by name.
    get: function (name) {
      if (modules[name]) {
        return modules[name];
      } else {
        console.warn("Error. Module with name `" + name + "` does not exist.");
        return {};
      }
    },
    set: function (name, value) {
      if (!modules[name]) {
        modules[name] = value;
      } else {
        console.warn("Error. Module with name `" + name + "` already exists.");
      }

      return this;
    }
  };
};

// modify particular parts of an individual module.
var IndModule = function (module) {
  return {
    // create a new sub-module.
    new: function (name) {
      if (!module[name]) {
        module[name] = {};
        return new IndModule(module[name]);
      } else console.warn("Error. Module with name `" + name + "` already exists.");
    },
    // find a sub-module.
    find: function (name) {
      if (module[name]) {
        return new IndModule(module[name]);
      } else console.warn("Error. Module with name `" + name + "` does not exist.");
    },
    // set a key inside an individual module.
    setKey: function (key, value) {
      if (module) {
        module[key] = value;
      } else console.warn("Error. Module does not exist.");

      return this;
    },
    setKeys: function (obj) {
      if (module) {
        for (var x in obj) {
          if (obj.hasOwnProperty(x)) {
            module[x] = obj[x];
          }
        }
      }

      return this;
    },
    // get the contents of a particular key.
    getKey: function (key) {
      if (module[key]) {
        return module[key];
      } else return {};
      console.warn("Error. Module with key `" + key + "` does not exist.");
    },
    // delete a key inside a module.
    deleteKey: function (key) {
      if (module) {
        delete module[key];
      } else console.warn("Error. Tried deleting key `" + key + "` but does not exist.");
    }
  };
};


// fix the sidebars -- they still aren't fixed.
// some shifts are showing up when they shouldn't.
// have only user role shown.

var module = ModuleBuilder();

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

module.set("listeners", Listeners);

// url should be a valid string path.
// cbs should be a valid object of callbacks [success] and [error].
module.set("ajax", function (url, cbs, cache) {
  // create a new http request instance.
  var http = new XMLHttpRequest();

  // on state change, check the status of the http request. If 200, run the
  // success callback, otherwise run the error callback.
  http.onreadystatechange = function() {
    if (http.readyState == XMLHttpRequest.DONE) {
      if (http.status == 200) {
        cbs.success(http.responseText);
      }
      else if (http.status == 400) {
        cbs.error(http.responseText, {error: 400});
      }
      else {
        cbs.error(http.responseText, {error: "unknown"});
      }
    }
  };

  // if caching is disabled, force a new copy by appending a GET param 't'.
  if (cache === false) {
    url += "?t=" + new Date().getTime();
  }

  // send a GET request.
  http.open("GET", url, true);
  http.send();
});

var Storage = {
  namespace: function (namespace) {
    return {
      set: function (key, value, lastUpdated) {
        var data = this.get(key);
        var obj = {value: value, lastUpdated: lastUpdated};

        localStorage.setItem(namespace + "_" + key, JSON.stringify(obj));
      },

      get: function (key) {
        var data = localStorage.getItem(namespace + "_" + key);

        if (data) {
          return JSON.parse(data);
        } else return null;
      },

      remove: function (key) {
        localStorage.removeItem(namespace + "_" + key);
      },

      lastUpdated: function (key) {
        var data = this.get(key);

        if (data) {
          return data.lastUpdated;
        } else return false;
      }
    };
  }
};

module.set("storage", Storage);

// this runs through a settings object and applies the settings individually
// to the config object inside of the meta object.
// this function is bound to meta.config, so `this` is the operative var.
module.set("config", function (settings, meta) {
  for (var x in settings) {
    // make sure the property already exists. Don't set new properties.
    if (settings.hasOwnProperty(x) && typeof meta.config[x] !== "undefined") {
      meta.config[x] = settings[x];
    // else throw a warning that you can't set new properties.
    } else {
      console.warn("Warning. Cannot set new property '" + x + "' to config.");
    }
  }

  return this.proto;
});

module.set("controller", {
  // this gives the scope to users along with access to the container node.
  scope: function (callback, meta) {
    var route = meta.routes[meta.view.current],
        $scope = route.state;

    setTimeout(function () {
      callback($scope, $scope.data, {
        container: meta.container,
        // this sounds ridiculous but it isn't.
        // loaded state = false -> 0 -> true.
        // false && 0 == false.
        loaded: route.hasLoaded ? true : false,
        loads: route.loads
      });
    });
  }
});

module.set("DOM", {
  // simple append operation of a valid node to a parent node.
  // the opposite of prepend.
  append: function (node, parent) {
    parent.appendChild(node);
  },
  // append a valid node to the start of a parent (before all other children).
  prepend: function (node, parent) {
    parent.insertBefore(node, parent.firstChild);
  },
  // append a valid node after a valid sibling node.
  after: function (node, sibling) {
    sibling.parentNode.insertBefore(node, sibling.nextSibling);
  },
  // append a valid node before a valid sibling node.
  before: function (node, sibling) {
    sibling.parentNode.insertBefore(node, sibling);
  },
  // remove a node from the DOM.
  remove: function (node) {
    node.parentNode.removeChild(node);
  },
  // check an entire document fragment for b-obj attributes.
  // then convert dot notation like self.Id to obj["self"]["Id"]
  // set the value of obj["self"]["Id"] in the document innerHTML.
  fillWithObjectProperties: function (parent, object) {
    var nodes = parent.querySelectorAll("[b-prop]"),
        util = module.get("util");

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
          val = util.dotToObject(object, path);
          node.removeAttribute(x);
          node[map[x]] = val;
        }
      }
    }

    return parent;
  },

  // get the parent and all children of a node.
  parentAndChildren: function (node) {
    var arr = [node];

    if (node.querySelectorAll) {
      var children = node.querySelectorAll("*");

      for (var x = 0; x < children.length; x++) {
        arr.push(children[x]);
      }

    }

    return arr;
  },
  allParents: function (node) {
    var parents = [];

    while (node.parentNode) {
      parents.unshift(node.parentNode);
      node = node.parentNode;
    }

    return parents;
  },
  hasRepeatParent: function (node) {
    while (node.parentNode && node.parentNode.hasAttribute) {
      if (node.parentNode.hasAttribute("b-repeat")) return true;
      else node = node.parentNode;
    }

    return false;
  }
});

module.set("hash", {
  public: {
    // this decompiles the hash into two components: the view and the pseudo-get
    // parameters. This information is then returned as an object.
    get: function (val) {
      // get the location.hash without the hash (#) and the forward slash (/).
      var hash = window.location.hash.substr(2);
      // match everything alphanumeric, -, and _.
      var view = hash.match(/^[\w_-]+/);
      // replace everything in the view before the ? and the leading ?.
      var get = hash.replace(/^[\w_-]+\?{0,}/, ""),
          map = {};

      // if there is anything afterwards, seperate x=1&y=2 to:
      // [["x", "1"], ["y", "2"]
      if (get.length > 0) {
        get = get.split(/&/g).map(function (o) {
          return o.split(/=/g);
        });

        // create a map to map `get` to.
        map = {};

        // for each get variable, map the key to the value.
        get.forEach(function (o) {
          map[o[0]] = o[1];
        });
      }

      // if at least a view exists, return what was gotten.
      if (view) {
        // if a val is specified, return the map[val]
        if (typeof val !== "undefined" && val !== null) {
          return map[val];
        // otherwise return the view and map.
        } else {
          return {
            view: view[0],
            get: map
          };
        }
      // otherwise return false becasue hash retrieval was unsuccessful.
      } else return false;
    },

    // an object for setters for the location.hash.
    set: {

      // a setter function to set the new view name of a contaienr without
      // disrupting the pseudo-get paramters.
      view: function (value) {
        var hashModule = module.get("hash");
        var hash = hashModule.public.get(),
            get = hashModule.private.concatGet(hash.get);

        if (!hash) {
          window.location.hash = "/" + value;
        } else {
          window.location.hash = "/" + value + (get ? "?" + get : "");
        }
      },

      // a setter function to set the pseudo-get params in the location.hash
      // while preserving the identity of the current view.
      // this accepts an object of key-values and converts it to 'x=1&y=2'
      // format.
      get: function (obj) {
        var hashModule = module.get("hash");
        var hash = hashModule.public.get(),
            get = hashModule.private.concatGet(obj);

        if (!hash) throw "Error. No view currently set.";
        else {
          window.location.hash = "/" + hash.view + (get ? "?" + get : "");
        }
      }
    }
  },

  // private internal location.hash functions to not be included in funcs.hash.
  private: {
    // a function that takes a parameter `get` which should be of type 'object'.
    // this sets object in x=4&y=5.
    concatGet: function (get) {
      var arr = [];

      for (var x in get) {
        if (get.hasOwnProperty(x)) {
          arr.push([x, get[x]]);
        }
      }

      return arr.map(function (o) {
        return o.join("=");
      }).join("&");
    }
  }
});

// any processes that need to be done on initialization of the RouteConfig
// function.
module.set("init", function (meta, container) {
  // on hash change, run the route.deploy function through the funcs.view.new
  // wrapper function.
  window.onhashchange = (function () {
    var hash = module.get("hash").public.get();
    module.get("view").new(hash.view, meta);
  }).bind(this);

  // query select the first element in the container selection.
  meta.container = (typeof container == "string") ?
    document.querySelectorAll(container)[0] :
    container;

  // initialize the DOM mutation watcher.
  module.get("mutation").addEvents(meta);
});

// load functions that utilize AJAX or XHR requests to either fetch html
// or javascript.
module.set("load", {
  // fetch HTML from a desired component page and trigger a callback with
  // the results.
  html: function (url, callback, cache) {
    var ajax = module.get("ajax");

    ajax(url, {
      success: function (response) {
        callback(response);
      },
      error: function (response, error) {
        callback(response);
        throw error;
      }
    }, cache);
  },

  // change the meta.script src to the desired url and then onload run the
  // callback function.
  script: function (meta, url, callback) {
    // remove the old script from the document.body.
    if (meta.script) document.body.removeChild(meta.script);

    // create a new script.
    meta.script = document.createElement("script");

    // onload, run a callback saying "I'm done!".
    meta.script.onload = function () {
      callback();
    };

    // set the source of the script to the desired url.
    meta.script.src = url;

    // append the script to the document.body.
    document.body.appendChild(meta.script);
  },

  // loads both the html and script and then runs a general callback.
  page: function (meta, route, callback) {
    var loaded = {
      html: false,
      script: false
    };

    // run this function to load the scripts and run the callback.
    // this function inherits route, loaded, and callback params.
    // it is also bound to `this`, the funcs.load scope to access
    // funcs.load.script directly.
    // this function also now runs controller javascript to add event listeners.
    var loadScript = (function () {
      // load the script and trigger the completion callback if html is loaded.
      this.script(meta, route.url.script, function () {
        loaded.script = true;

        callback();
      });
    }).bind(this);

    // if the route has already been loaded, the HTML is already stored.
    // use this version instead.
    // for this to load from storage, cache must be enabled, so
    // meta.config.cache must equal `true`.
    if (route.content.html && meta.config.cache) {
      loaded.html = true;

      while (meta.container.firstChild) {
        meta.container.removeChild(meta.container.firstChild);
      }

      meta.container.innerHTML = route.content.html;

      loadScript();
    } else {
      // load the html, return the response, set the innerHTML for later,
      // and trigger the completion callback if script is already loaded.
      this.html(route.url.html, function (response) {
        loaded.html = true;
        route.content.html = response;

        while (meta.container.firstChild) {
          meta.container.removeChild(meta.container.firstChild);
        }

        meta.container.innerHTML = route.content.html;

        loadScript();
      }, meta.config.cache);
    }

  }
});

// a class to monitor mutations (changes) to the meta.container.
module.set("mutation", {

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
      var scope = module.get("scope");
      // if the scope object for this doesn't exist, create it.
      scope.create.key($scope, name);

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
        // I have no idea why, but somehow nodes pass through here twice and get
        // events applied to them twice.
        if (!node.eventsApplied) {
          node.eventsApplied = true;

          node.addEventListener(event, function (e) {
            if (typeof $scope[cb_name] == "function")
              $scope[cb_name].call(this, e);
          });
        }

        /*
        node["on" + event] = function (e) {
          if (typeof $scope[cb_name] == "function")
            $scope[cb_name].call(this, e);
        };
        */
      }
    });
  },

  addRepeatToNode: function ($scope, node) {
    var util = module.get("util"),
        repeater = module.get("repeater");
    var repeatName = node.getAttribute("b-repeat");

    util.immutable($scope.data.repeat, repeatName, repeater(repeatName, node));
  },

  // remove nodes that
  removeNode: function ($scope, node) {
    if (node.nodeType === 1 && node.hasAttribute("b-name")) {
      var util = module.get("util");
      var name = node.getAttribute("b-name"),
          $elem = $scope.current[name] || $scope.old[name];

      // unlock $scope[key].self so that I can run Array.prototype.filter on
      // it.
      util.mutable($elem, "self");

      // filter out any nodes that are the same as the ones that are being
      // removed from the DOM currently.
      $elem.self = $elem.self.filter(function (o) {
        return !node.isSameNode(o);
      });

      $scope.current.event._removeNode(name, node);

      // make immutable again so that users cannot delete $scope[key].self.
      util.immutable($elem, "self");
    }
  },

  // it iterates through the nodeList and runs the above function to add
  // events.
  addEvents: function (meta) {
    var self = this;

    // run the self.addEventsToNode and self.addRepeatToNode functions on
    // the parent and all children nodes that are valid (o.nodeType == 1).
    var addEventsToAllNodes = function ($scope, parent) {
      var DOM = module.get("DOM");
      var allNodes = DOM.parentAndChildren(parent);

      allNodes.forEach(function (o, i) {
        if (o.nodeType === 1) {
          self.addEventsToNode($scope.current, o);

          if (o.hasAttribute("b-name")) {
            $scope.current.event._addNode(o.getAttribute("b-name"), o);
          }

          // put in a new template -- wait if not loaded, otherwise replace
          // instantly.
          if (o.hasAttribute("b-template")) {
            if (!meta.template.isComplete()) {
              meta.template.onComplete(function () {
                o.parentNode.replaceChild(meta.template.new(o), o);
              });
            } else {
              o.parentNode.replaceChild(meta.template.new(o), o);
            }
          }

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
        self.removeNode($scope, removed[x]);
      }

      for (x = 0; x < added.length; x++) {
        addEventsToAllNodes($scope, added[x]);
      }
    });
  }
});

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

module.set("routes", {
  // add a new route to the meta.routes list.
  // this adds a new pair of HTML and JS to load.
  // `this` is bound to `meta`.
  add: function (name, html, js, meta) {
    var scope = module.get("scope");

    // if the route doesn't already exist, create a new one.
    if (!meta.routes[name]) {
      meta.routes[name] = {
        name: name,
        url: {
          html: html,
          script: js
        },
        // for storing the html content.
        content: {
          html: null
        },
        // the scope/model of the view.
        state: {},
        hasLoaded: false,
        loads: 0
      };

      var $scope = meta.routes[name].state;
      scope.create.scope(meta, $scope, meta.routes);

    // otherwise throw an error that the route already exists.
    } else throw "Error. Route with the name '" + name + "' already exists.";
  },

  // if the route exists, load the assets and then run a callback when loaded.
  deploy: function (meta, name, callback) {
    var route = meta.routes[name],
        scope = module.get("scope"),
        hash = module.get("hash"),
        load = module.get("load");


    if (route.hasLoaded === false) route.hasLoaded = 0;
    else if (route.hasLoaded === 0) route.hasLoaded = true;

    route.loads++;

    if (route) {
      hash.public.set.view(name);

      scope.removeAllNodeRefs(meta.routes[name].state);

      load.page(meta, route, function (response) {
        console.log("loaded route '" + name + "'!");
        // run the callback to say, "I'm done loading!".
        if (callback) callback();
      });

    } else throw "Error. Route with the name '" + name + "' does not exist.";

    return this;
  }
});

module.set("scope", {
  create: {
    key: function ($scope, key) {
      var immutable = module.get("util").immutable;

      if (!$scope[key]) {
        $scope[key] = {};

        immutable($scope[key], "data", {});
        immutable($scope[key], "self", []);
        immutable($scope[key], "each", function (callback) {
          var arr = $scope[key].self || [];
          arr.forEach(function (o, i) {
            callback(o, i, $scope[key].self);
          });
        });
      }
    },

    // create a new scope property.
    scope: function (meta, $scope, routes) {
      var immutable = module.get("util").immutable,
          self = this,
          scope = module.get("scope"),
          listeners = module.get("listeners");

      scope.repeat($scope);

      // make `event` in $scope immutable as well as `add` inside of
      // $scope.event. Also add `data` inside $scope for random user data.
      // create $scope level data object for storing state data.
      immutable($scope, "data", {});

      // const variables.
      immutable($scope, "_", {
        CLEAR_INPUT: true
      });

      // make `$data.repeat` immutable and undeletable.
      immutable($scope.data, "repeat", {});

      // save all the data in the `$scope` in localStorage.
      immutable($scope.data, "save", function () {
        scope.save($scope, meta);
      });

      // retrieve all saved `$scope` data stored in localStorage.
      immutable($scope.data, "retrieve", function () {
        scope.retrieve($scope, meta);
      });

      // apply all saved `$scope` data stored in localStorage to the `$scope.data`.
      immutable($scope.data, "apply", function (config) {
        return scope.apply($scope, meta, config);
      });

      // retrieve all saved `$scope` data stored in localStorage.
      immutable($scope.data, "remove", scope.remove.bind(this, $scope, meta));

      // check if the current scope's data has expired yet.
      immutable($scope.data, "lastUpdated", function () {
        return scope.lastUpdated($scope, meta);
      });

      // safe retrieval of a property that creates it if it doesn't exist.
      immutable($scope, "get", function (property) {
        if ($scope[property]) return $scope[property];

        scope.create.key($scope, property);

        console.warn("Error. This property with name '" + property + "' doesn't exist yet.");

        return $scope[property];
      });

      // create event object for adding event functions.
      immutable($scope, "event", listeners());

      // creation of a native data object that is bound to the $scope.
      immutable($scope.data, "prop", function (property, key, value) {
        if (!$scope[property]) {
          scope.create.key($scope, property);
          console.warn("The property with name '" + property + "' doesn't exist yet, but was just created.");
        }

        $scope[property].data[key] = value;

        return $scope[property].data[key];
      });

      immutable($scope.data, "transfer", function (view, key) {
        var data = $scope.data[key];

        if (typeof data == "undefined" || data === null)
          throw "Error. Data associated with key '" + key + "' does not exist.";
        if (meta.routes[view]) {
          meta.routes[view].state.data[key] = data;
        } else throw "Error. View with the name '" + name + "' does not exist.";
      });

      immutable($scope.data, "repeat", {});

      scope.toolkit($scope);
    }
  },

  repeat: function ($scope) {
    var util = module.get("util"),
        immutable = util.immutable;

    immutable($scope, "repeat", function (name) {
      if ($scope.data.repeat[name]) {
        return $scope.data.repeat[name];
      } else console.warn("Error. Repeat associated with key '" + name + "' does not exist yet.");
    });
  },

  removeAllNodeRefs: function ($scope) {
    var util = module.get("util");

    for (var x in $scope) {
      if ($scope[x].self) {
        util.tempUnlock($scope[x], "self", function (obj) {
          obj.self = [];
        });
      }
    }

    return $scope;
  }
});

module.find("scope").setKeys({
  save: function ($scope, meta, config) {
    var storage = new Storage.namespace(meta.view.current);

    var $data = {};

    for (var x in $scope) {
      if ($scope.hasOwnProperty(x)) {
        $data[x] = $scope.data[x];
      }
    }

    storage.set("data", $data, new Date().getTime());
  },
  retrieve: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current),
        data = storage.get("data");

    return data;
  },
  lastUpdated: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current);

    return storage.lastUpdated("data");
  },
  remove: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current);

    storage.set("data", {}, new Date().getTime());
  },
  apply: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current),
        data = storage.get("data");

    if (typeof data == "object" && data) {
      data = data.value;

      for (var x in data) {
        $scope.data[x] = data[x];
      }

      return Object.keys(data).length > 0;
    } return false;
  }
});


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
      if (meta.isComplete) cb();
      else meta.onComplete.push(cb);
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

module.find("scope").setKey("toolkit", function ($scope) {
  var utils = {
    setVals: function ($scope, prop, obj) {
      if (typeof obj == "object") {
        for (var x in obj) {
          $scope.get(x).self.forEach(function (o) {
            o[prop] = obj[x];
          });
        }
      }
    },
    getVals: function (nodes, attr) {
      return nodes[0][prop];
    }
  };

  var immutable = module.get("util").immutable;

  immutable($scope, "edit", {
    text: function (obj) {
      utils.setVals($scope, "innerText", obj);
      return this;
    },

    html: function (obj) {
      utils.setVals($scope, "innerHTML", obj);
      return this;
    }
  });

  immutable($scope, "input", {
    val: function (arr, clear) {
      if (Array.isArray(arr)) {
        var obj = {},
            $elems;

        arr.forEach(function (name) {
          $elems = $scope.get(name).self;

          if ($elems && $elems.length > 0) {
            if ($elems.length > 1) {
              obj[name] = $elems.map(function (o) {
                return o.value;
              });
            } else {
              obj[name] = $elems[0].value;
            }
          }
        });

        // also clear the values of the inputs.
        if (clear) this.clear(arr);

        return obj;
      } else console.warn("Error. `$scope.input.val` must be passed an array parameter of valid b-name nodes.");
    },

    clear: function (arr) {
      if (Array.isArray(arr)) {
        var $elems;

        arr.forEach(function (name) {
          $elems = $scope.get(name).self;

          if ($elems) {
            $elems.forEach(function (o) {
              o.value = "";
            });
          }
        });
      } else console.warn("Error. `$scope.input.clear` must be passed an array parameter of valid b-name nodes.");
    }
  });
});

module.set("store", function (meta) {
  return {
    // delete all $data from all views.
    delete: function () {
      var util = module.get("util");

      var data;

      util.objectLoop(meta.routes, function (o, i) {
        var storage = module.get("storage").namespace(i);

        util.objectLoop(o.state.data, function (_, i, obj) {
          delete obj[i];
        });

        storage.remove("data");
      });
    },

    // get $data from another view.
    get: function (view) {
      return meta.routes[view].state.data;
    }
  };
});

module.set("transition", {
  /*
    TRANSITION STEPS:
    - Start transition to copy elem.
    - Display copy elem.
    - Load new view in original (display: none).
    - Run transitions.
    - Remove copy view.
    - Display original (new view).
  */

  // a func to make a deep clone of the existing container.
  clonePage: function (meta) {
    // if a current meta.copy exists, another transition is probably running.
    // cleanup this transition by killing the copy of meta.transition.
    if (meta.copy) {
      meta.copy.parentNode.removeChild(meta.copy);
      meta.copy = null;
    }

    meta.copy = meta.container.cloneNode(true);
    meta.copy.className = meta.view.old + "-namespace";
    // remove the ID because no two elements should have the same id.
    meta.copy.id = "clone_node";
  },

  // hide the current container.
  // add an inline styling to set display to 'none'.
  hideContainer: function (meta) {
    meta.container.style.display = "none";
  },

  // append meta.copy right after meta.container in the html.
  // this assumes that there's a parent node to the meta.container.
  // the container should be set to something other than <body> or <html>.
  appendCopy: function (meta) {
    // get the parent node of the current container.
    var parent = meta.container.parentNode;
    // insert meta.copy before the next element after meta.container,
    // which means after meta.container.
    parent.insertBefore(meta.copy, meta.container.nextSibling);
    // scroll to the top of the container before callback.
    meta.container.scrollTop = 0;
  },

  callback: {

    // set the transition to run on a new view load.
    // the first param is a dropped in function to always deploy privately
    // after any animation. the user MUST call this function for the animation
    // and view load to complete.
    // the second and third parameters are the copy container and the
    // container with the new view in it.
    // `this` is bound to `meta`.
    set: function (callback, meta) {
      meta.transition = callback;
    },

    // this is an internal set of instructions to run after a user defined
    // transition.
    // this removes the copy (that should be hidden by users), and makes sure
    // that the main container with the new view is showing.
    after: function (meta) {
      if (meta.copy) {
        // remove the copy node.
        meta.copy.parentNode.removeChild(meta.copy);
        meta.copy = null;
      }

      // if the display for the container is still set to none, set the
      // display to 'block'.
      if (meta.container.style.display == "none") {
        meta.container.style.display = "block";
      }

      // the animation is finally completed here.
      meta.animation.inProgress = false;
    }
  },

  // this is the procedural code to run before a transition is run by a user.
  // this creates a copy node of the original, hides the original container,
  // and then appends the copy such that it should be placed similarly in the
  // document.
  before: function (meta, callback) {
    this.clonePage(meta);
    this.appendCopy(meta);
    console.log("Copy appended at " + new Date().getTime());
    setTimeout((function () {
      this.hideContainer(meta);
      console.log("Container hidden at " + new Date().getTime());

      callback();
    }).bind(this), 50);
  }
});

module.set("util", {
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

  tempUnlock: function (obj, key, callback) {
    this.mutable(obj, key);
    callback(obj);
    this.immutable(obj, key);
  },

  dotToObject: function (obj, path) {
    if (typeof path == "string") {
      path = path.split(/\./);

      for (var x = 0; x < path.length; x++) {
        // go deeper as long as you can to find the specified object.
        if (typeof obj[path[x]] !== "undefined" && obj[path[x]] !== null) {
          obj = obj[path[x]];
        // if it cannot complete the whole path, just return early `undefined`.
        } else return "";
      }

      return typeof obj == "undefined" ? "" : obj;
    } else throw "Error. Path must be a string.";
  },

  findNearestParentRepeat: function (node) {
    var parent;

    while (node.parentNode) {
      if (node.parentNode.repeat) parent = node.parentNode;
      node = node.parentNode;
    }

    return parent;
  },

  isSample: function (node) {
    var parent;

    while (node.parentNode) {
      if (node.parentNode.hasAttribute("b-repeat")) return true;
      node = node.parentNode;
    }

    return false;
  },

  objectLoop: function (obj, callback) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) {
        callback(obj[x], x, obj);
      }
    }
  }
});

module.set("view", {

  new: function (name, meta) {
    var hash = module.get("hash"),
        transition = module.get("transition"),
        routes = module.get("routes");

    var utils = {
      replaceNamespace: function (node, name) {
        // remove the old namespace.
        node.className = node.className.split(/\s+/g).filter(function (o) {
          return !/-namespace/g.test(o) && o;
        }).concat(name + "-namespace").join(" ");

        return node;
      }
    };

    // if the new view is different from the old view, run the transition.
    if (name !== meta.view.current && meta.view.current !== null && meta.routes[name]) {
      var $scope = meta.routes[meta.view.current].state;

      if (typeof $scope.unload == "function") $scope.unload();

      // record the view that was transitioned from.
      meta.view.old = meta.view.current;
      // set the meta.view.current to the new.view.
      meta.view.current = name;
      // the animation process starts here.
      meta.animation.inProgress = true;

      // set the location.hash view name.
      hash.public.set.view(name);
      // run pre-transition procedural (create copy, hide original).
      transition.before(meta, function () {
        utils.replaceNamespace(meta.container, name);

        // deploy the new route and provide a callback when it's done.
        routes.deploy(meta, name, function () {
          // this is confusing, but essentially it runs the custom user transition.
          // the user then triggers the `done` parameter which internally triggers
          // funcs.transition.callback.after, which switches views again basically.
          if (meta.transition) {
            console.log("Transition started at " + new Date().getTime());
            // use Function.prototype.call to run the function and set params.
            // set `this` as 'null' to disallow access to internal functions.
            meta.transition.call(null, transition.callback.after.bind(null, meta), {
              old: meta.copy,
              new: meta.container
            }, {
              new: meta.view.current,
              old: meta.view.old
            });
          } else transition.callback.after(meta);
        });
      });
    // the location.hash variable being set should not trigger this function,
    // so still block `name !== meta.view.current` and make sure the route exists.
    } else if (name !== meta.view.current && meta.routes[name]) {
      // go through all steps except the transition since this is the
      // initial load.

      // record the view that was transitioned from.
      meta.view.old = meta.view.current;
      // set the current view.
      meta.view.current = name;
      meta.animation.inProgress = true;

      meta.container = utils.replaceNamespace(meta.container, name);

      routes.deploy(meta, name, function () {
        transition.callback.after(meta);
      });
    } else if (!meta.routes[name]) {
      console.warn("Error. The route '" + name + "' does not exist.");
    } else if (name === meta.view.current) {
      // these requests are blocked because they are trying to go to the same
      // view as is currently displayed.
    }
  }
});

var RouteConfig = (function (container) {
  "use strict";

  // storage mechanism for private variables only accessible inside the closure.
  var meta = {
    // the script for the view controller.
    script: null,
    // a list of valid routes to go to.
    routes: {},
    config: {
      // reload html/js every time view changes or not ever.
      cache: true
    },
    // the main container to insert html to.
    container: null,
    // the copy container to insert old html to while in transition.
    copy: null,
    // the name of the current view.
    view: {
      current: null,
      old: null
    },
    animation: {
      inProgress: false
    },
    observer: null,
    _prototype: _prototype,
    template: module.get("template")()
  };

  module.get("init")(meta, container);

  var _prototype = {
    // run the funcs.routes.add func with params [[ name, html, js ]].
    add: function (name, html, js) {
      module.get("routes").add(name, html, js, meta);

      return this;
    },
    // run the funcs.routes.deploy func with [[ name ]] param.
    deploy: function (name) {
      module.get("view").new(name, meta);
      return this;
    },
    // set configuration options in [[ settings ]] param.
    config: function (settings) {
      module.get("config")(settings, meta);
    },
    // browser location.hash getters/setters and pseudo-get params.
    hash: module.get("hash").public,
    // set the transition.
    transition: function (callback) {
      module.get("transition").callback.set(callback, meta);
    },
    // add controller functionality to allow access to scope variables.
    controller: function (callback) {
      module.get("controller").scope(callback, meta);
    },
    store: (function () {
      return module.get("store")(meta);
    })(),
    template: meta.template
  };

  return _prototype;
});
