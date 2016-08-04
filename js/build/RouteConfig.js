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
