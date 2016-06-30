  funcs.init();

  var _prototype = {
    // run the funcs.routes.add func with params [[ name, html, js ]].
    add: funcs.routes.add,
    // run the funcs.routes.deploy func with [[ name ]] param.
    deploy: funcs.view.new,
    // set configuration options in [[ settings ]] param.
    config: funcs.config,
    // browser location.hash getters/setters and pseudo-get params.
    hash: funcs.hash.public,
    // set the transition.
    transition: funcs.transition.callback.set,
    // add controller functionality to allow access to scope variables.
    controller: funcs.controller.scope
  };

  return _prototype;
});
