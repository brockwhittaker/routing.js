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
    view: null,
    animation: {
      inProgress: false
    },
    observer: null
  };

  // storage mechanism for private functions only accessible from within.
  var funcs = {

    util: {
      immutable: function (obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          writable: false
        });

        return this;
      }
    },

    DOM: {
      each: function (sel, callback) {
        var nodes = meta.container.querySelectorAll(sel);

        for (var x = 0; x < nodes.length; x++) {
          callback.call(nodes[x]);
        }
      }
    },

    // url should be a valid string path.
    // cbs should be a valid object of callbacks [success] and [error].
    ajax: function (url, cbs) {
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
      if (meta.config.cache === false) {
        url += "?t=" + new Date().getTime();
      }

      // send a GET request.
      http.open("GET", url, true);
      http.send();
    },

    // load functions that utilize AJAX or XHR requests to either fetch html
    // or javascript.
    load: {

      // fetch HTML from a desired component page and trigger a callback with
      // the results.
      html: function (url, callback) {
        funcs.ajax(url, {
          success: function (response) {
            callback(response);
          },
          error: function (response, error) {
            callback(response);
            throw error;
          }
        });
      },

      // change the meta.script src to the desired url and then onload run the
      // callback function.
      script: function (url, callback) {
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
      page: function (route, callback) {
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
          this.script(route.url.script, function () {
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
          });
        }

      }
    },

    routes: {

      // add a new route to the meta.routes list.
      // this adds a new pair of HTML and JS to load.
      add: function (name, html, js) {
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

          // make `event` in $scope immutable as well as `add` inside of
          // $scope.event. Also add `data` inside $scope for random user data.
          funcs.util
            .immutable($scope, "data", {})
            .immutable($scope, "event", {})
            .immutable($scope.event, "add",
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

        // otherwise throw an error that the route already exists.
        } else throw "Error. Route with the name '" + name + "' already exists.";

        return _prototype;
      },

      // if the route exists, load the assets and then run a callback when loaded.
      deploy: function (name, callback) {
        var route = meta.routes[name];

        if (route) {
          funcs.hash.set.view(name);

          funcs.load.page(route, function (response) {
            console.log("loaded route '" + name + "'!");
            // run the callback to say, "I'm done loading!".
            if (callback) callback();
          });

        } else throw "Error. Route with the name '" + name + "' does not exist.";

        return _prototype;
      }
    },

    // this runs through a settings object and applies the settings individually
    // to the config object inside of the meta object.
    config: function (settings) {
      for (var x in settings) {
        // make sure the property already exists. Don't set new properties.
        if (settings.hasOwnProperty(x) && typeof meta.config[x] !== "undefined") {
          meta.config[x] = settings[x];
        // else throw a warning that you can't set new properties.
        } else {
          console.warn("Warning. Cannot set new property '" + x + "' to config.");
        }
      }

      return _prototype;
    },

    // any processes that need to be done on initialization of the RouteConfig
    // function.
    init: function () {
      // on hash change, run the route.deploy function through the funcs.view.new
      // wrapper function.
      window.onhashchange = (function () {
        var hash = this.hash.get();
        this.view.new(hash.view);
      }).bind(this);

      // query select the first element in the container selection.
      meta.container = (typeof container == "string") ?
        document.querySelectorAll(container)[0] :
        container;

      // initialize the DOM mutation watcher.
      this.mutation.addEvents();
    },

    // a class to monitor mutations (changes) to the meta.container.
    mutation: {

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
        var $scope = meta.routes[meta.view].state;

        // create an empty function to put in place of null.
        var empty = function () {};

        if (node.nodeType === 1 && node.hasAttribute("b-name")) {
          // get a list of events by splitting by commas.
          var events = node.getAttribute("b-events"),
              name = node.getAttribute("b-name");

          // if the scope object for this doesn't exist, create it.
          if (!$scope[name]) $scope[name] = {};
          // set self to the node.
          $scope[name].self = node;

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

      // this runs the callback when a mutation occurs and is the proper type.
      // it iterates through the nodeList and runs the above function to add
      // events.
      addEvents: function (callback) {
        var self = this;
        this.observe(function (mutation) {
          var nodes = mutation.addedNodes;

          for (var x = 0; x < nodes.length; x++) {
            self.addEventsToNode(nodes[x]);
          }
        });
      }
    },

    // a mini-class for location.hash functions to preserve view state and pass
    // pseudo-get parameters between views.
    hash: {

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
          var hash = funcs.hash.get(),
              get = funcs._hash.concatGet(hash.get);

          if (!hash) {
            window.location.hash = "/" + value;
          } else {
            window.location.hash = "/" + value + (get ? "?" + get : "");
          }

          return _prototype;
        },

        // a setter function to set the pseudo-get params in the location.hash
        // while preserving the identity of the current view.
        // this accepts an object of key-values and converts it to 'x=1&y=2'
        // format.
        get: function (obj) {
          var hash = funcs.hash.get(),
              get = funcs._hash.concatGet(obj);

          if (!hash) throw "Error. No view currently set.";
          else {
            window.location.hash = "/" + hash.view + (get ? "?" + get : "");
          }

          return _prototype;
        }
      }
    },

    // private internal location.hash functions to not be included in funcs.hash.
    _hash: {

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
    },

    // this is a series of functions for page transitions between an old and a
    // new view.
    transition: {
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
      clonePage: function () {
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
      hideContainer: function () {
        meta.container.style.display = "none";
      },

      // append meta.copy right after meta.container in the html.
      // this assumes that there's a parent node to the meta.container.
      // the container should be set to something other than <body> or <html>.
      appendCopy: function () {
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
        set: function (callback) {
          meta.transition = callback;
        },

        // this is an internal set of instructions to run after a user defined
        // transition.
        // this removes the copy (that should be hidden by users), and makes sure
        // that the main contianer with the new view is showing.
        after: function () {
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
      before: function (callback) {
        this.clonePage();
        this.hideContainer();
        this.appendCopy();
      }
    },

    view: {

      new: function (name) {
        // if the new view is different from the old view, run the transition.
        if (name !== meta.view && meta.view !== null && meta.routes[name]) {

          // record the view that was transitioned from.
          var old_view = meta.view;
          // set the meta.view to the new.view.
          meta.view = name;
          // the animation process starts here.
          meta.animation.inProgress = true;

          // set the location.hash view name.
          funcs.hash.set.view(name);
          // run pre-transition procedural (create copy, hide original).
          funcs.transition.before();

          // deploy the new route and provide a callback when it's done.
          funcs.routes.deploy(name, function () {
            // this is confusing, but essentially it runs the custom user transition.
            // the user then triggers the `done` parameter which internally triggers
            // funcs.transition.callback.after, which switches views again basically.
            if (meta.transition) {
              // use Function.prototype.call to run the function and set params.
              // set `this` as 'null' to disallow access to internal functions.
              meta.transition.call(null, funcs.transition.callback.after, {
                old: meta.copy,
                new: meta.container
              }, {
                new: meta.view,
                old: old_view
              });
            } else funcs.transition.callback.after();
          });
        // the location.hash variable being set should not trigger this function,
        // so still block `name !== meta.view` and make sure the route exists.
        } else if (name !== meta.view && meta.routes[name]) {
          // go through all steps except the transition since this is the
          // initial load.
          meta.view = name;
          meta.animation.inProgress = true;

          funcs.routes.deploy(name, function () {
            funcs.transition.callback.after();
          });
        } else if (!meta.routes[name]) {
          console.warn("Error. The route '" + name + "' does not exist.");
        } else if (name === meta.view) {
          // these requests are blocked because they are trying to go to the same
          // view as is currently displayed.
        }
      }
    },

    // an object for all controller functions that store, keep track of, and
    // retrieve information associated with a particular view.
    controller: {

      // this gives the scope to users along with access to the container node.
      scope: function (callback) {
        var $scope = meta.routes[meta.view].state;
        callback($scope, $scope.data, meta.container);
      }
    },
  };

  // run the initialization function to run core necessary events.
  funcs.init();

  var _prototype = {
    // run the funcs.routes.add func with params [[ name, html, js ]].
    add: funcs.routes.add,
    // run the funcs.routes.deploy func with [[ name ]] param.
    deploy: funcs.view.new,
    // set configuration options in [[ settings ]] param.
    config: funcs.config,
    // browser location.hash getters/setters and pseudo-get params.
    hash: funcs.hash,
    // set the transition.
    transition: funcs.transition.callback.set,
    // add controller functionality to allow access to scope variables.
    controller: funcs.controller.scope
  };

  return _prototype;
});
