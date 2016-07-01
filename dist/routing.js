var funcs = {};

// url should be a valid string path.
// cbs should be a valid object of callbacks [success] and [error].
funcs.ajax = function (url, cbs, cache) {
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
};

// this runs through a settings object and applies the settings individually
// to the config object inside of the meta object.
// this function is bound to meta.config, so `this` is the operative var.
funcs.config = function (settings, meta) {
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
};

funcs.controller = {
  // this gives the scope to users along with access to the container node.
  scope: function (callback, meta) {
    var $scope = meta.routes[meta.view.current].state;
    callback($scope, $scope.data, meta.container);
  }
};


funcs.hash = {
  public: {
    // this decompiles the hash into two components: the view and the pseudo-get
    // parameters. This information is then returned as an object.
    get: function () {
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
        return {
          view: view[0],
          get: map
        };
      // otherwise return false becasue hash retrieval was unsuccessful.
      } else return false;
    },

    // an object for setters for the location.hash.
    set: {

      // a setter function to set the new view name of a contaienr without
      // disrupting the pseudo-get paramters.
      view: function (value) {
        var hash = funcs.hash.public.get(),
            get = funcs.hash.private.concatGet(hash.get);

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
        var hash = funcs.hash.public.get(),
            get = funcs.hash.private.concatGet(obj);

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
};

// any processes that need to be done on initialization of the RouteConfig
// function.
funcs.init = function (meta, container) {
  // on hash change, run the route.deploy function through the funcs.view.new
  // wrapper function.
  window.onhashchange = (function () {
    var hash = this.hash.public.get();
    this.view.new(hash.view, meta);
  }).bind(this);

  // query select the first element in the container selection.
  meta.container = (typeof container == "string") ?
    document.querySelectorAll(container)[0] :
    container;

  // initialize the DOM mutation watcher.
  this.mutation.addEvents(meta);
};

// load functions that utilize AJAX or XHR requests to either fetch html
// or javascript.
funcs.load = {
  // fetch HTML from a desired component page and trigger a callback with
  // the results.
  html: function (url, callback, cache) {
    funcs.ajax(url, {
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
      meta.container.innerHTML = route.content.html;

      loadScript();
    } else {
      // load the html, return the response, set the innerHTML for later,
      // and trigger the completion callback if script is already loaded.
      this.html(route.url.html, function (response) {
        loaded.html = true;
        route.content.html = response;
        meta.container.innerHTML = route.content.html;

        loadScript();
      }, meta.config.cache);
    }

  }
};

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

    var config = { attributes: true, childList: true, characterData: true };
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

    // if the scope object for this doesn't exist, create it.
    funcs.scope.create.key($scope, name);

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
  },

  addRepeatToNode: function ($scope, node) {
    var repeatName = node.hasAttribute("b-repeat");

    funcs.util.immutable($scope.data.repeat, repeatName, {
      node: node,
      list: []
    });
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
        return (!node.isSameNode(o));
      });

      // make immutable again so that users cannot delete $scope[key].self.
      funcs.util.immutable($elem, "self");
    }
  },

  // it iterates through the nodeList and runs the above function to add
  // events.
  addEvents: function (meta) {
    var self = this;

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
        if (added[x].nodeType === 1) {
          if (added[x].hasAttribute("b-name")) {
            self.addEventsToNode($scope.current, added[x]);
          }

          if (added[x].hasAttribute("b-repeat")) {

          }
        }
      }
    });
  }
};

funcs.routes = {
  // add a new route to the meta.routes list.
  // this adds a new pair of HTML and JS to load.
  // `this` is bound to `meta`.
  add: function (name, html, js, meta) {
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
        state: {}
      };

      var $scope = meta.routes[name].state;
      funcs.scope.create.scope(meta, $scope, meta.routes);

    // otherwise throw an error that the route already exists.
    } else throw "Error. Route with the name '" + name + "' already exists.";
  },

  // if the route exists, load the assets and then run a callback when loaded.
  deploy: function (meta, name, callback) {
    var route = meta.routes[name];

    if (route) {
      funcs.hash.public.set.view(name);

      funcs.load.page(meta, route, function (response) {
        console.log("loaded route '" + name + "'!");
        // run the callback to say, "I'm done loading!".
        if (callback) callback();
      });

    } else throw "Error. Route with the name '" + name + "' does not exist.";

    return this;
  }
};

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

      immutable($scope, "repeat", function (name, node) {
        if ($scope.data.repeat[name]) {
          $repeat = $scope.data.repeat[name];

          return {
            push: function (obj) {
              //$repeat.
            },
            filter: function () {

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

funcs.transition = {
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
    // remove the ID because no two elements should have the same id.
    meta.copy.id = "";
    meta.copy.className = "";
  },

  // a func to make the meta.copy exist in the same place as the current
  // container does.
  applyStyling: function () {
    /*
    var top = meta.container.offsetTop,
        left = meta.container.offsetLeft;

    // create a styling object to apply to the copy version.
    var styling = {
      position: "absolute",
      top: meta.container.offsetTop + "px",
      left: meta.container.offsetLeft + "px",
      zIndex: "1000"
    };

    for (var x in styling) {
      meta.copy.style[x] = styling[x];
    }
    */
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
    this.hideContainer(meta);
    this.appendCopy(meta);
  }
};

funcs.util = {

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
  }
};

funcs.view = {

  new: function (name, meta) {
    // if the new view is different from the old view, run the transition.
    if (name !== meta.view.current && meta.view.current !== null && meta.routes[name]) {

      // record the view that was transitioned from.
      meta.view.old = meta.view.current;
      // set the meta.view.current to the new.view.
      meta.view.current = name;
      // the animation process starts here.
      meta.animation.inProgress = true;

      // set the location.hash view name.
      funcs.hash.public.set.view(name);
      // run pre-transition procedural (create copy, hide original).
      funcs.transition.before(meta);

      // deploy the new route and provide a callback when it's done.
      funcs.routes.deploy(meta, name, function () {
        // this is confusing, but essentially it runs the custom user transition.
        // the user then triggers the `done` parameter which internally triggers
        // funcs.transition.callback.after, which switches views again basically.
        if (meta.transition) {
          // use Function.prototype.call to run the function and set params.
          // set `this` as 'null' to disallow access to internal functions.
          meta.transition.call(null, funcs.transition.callback.after.bind(null, meta), {
            old: meta.copy,
            new: meta.container
          }, {
            new: meta.view.current,
            old: meta.view.old
          });
        } else funcs.transition.callback.after(meta);
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

      funcs.routes.deploy(meta, name, function () {
        funcs.transition.callback.after(meta);
      });
    } else if (!meta.routes[name]) {
      console.warn("Error. The route '" + name + "' does not exist.");
    } else if (name === meta.view.current) {
      // these requests are blocked because they are trying to go to the same
      // view as is currently displayed.
    }
  }
};

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
    _prototype: _prototype
  };

  funcs.init(meta, container);

  var _prototype = {
    // run the funcs.routes.add func with params [[ name, html, js ]].
    add: function (name, html, js) {
      funcs.routes.add(name, html, js, meta);

      return this;
    },
    // run the funcs.routes.deploy func with [[ name ]] param.
    deploy: function (name) {
      funcs.view.new(name, meta);
      return this;
    },
    // set configuration options in [[ settings ]] param.
    config: function (settings) {
      funcs.config(settings, meta);
    },
    // browser location.hash getters/setters and pseudo-get params.
    hash: funcs.hash.public,
    // set the transition.
    transition: function (callback) {
      funcs.transition.callback.set(callback, meta);
    },
    // add controller functionality to allow access to scope variables.
    controller: function (callback) {
      funcs.controller.scope(callback, meta);
    }
  };

  return _prototype;
});
