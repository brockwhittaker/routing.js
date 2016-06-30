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
    observer: null
  };

  // storage mechanism for private functions only accessible from within.
  var internal_funcs = window.funcs;

  // run the initialization function to run core necessary events.
  internal_funcs.init();

  var _prototype = {
    // run the funcs.routes.add func with params [[ name, html, js ]].
    add: internal_funcs.routes.add,
    // run the funcs.routes.deploy func with [[ name ]] param.
    deploy: internal_funcs.view.new,
    // set configuration options in [[ settings ]] param.
    config: internal_funcs.config,
    // browser location.hash getters/setters and pseudo-get params.
    hash: internal_funcs.hash.public,
    // set the transition.
    transition: internal_funcs.transition.callback.set,
    // add controller functionality to allow access to scope variables.
    controller: internal_funcs.controller.scope
  };

  return _prototype;
});
