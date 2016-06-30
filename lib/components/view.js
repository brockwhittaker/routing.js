funcs.view = {

  new: function (name) {
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
            new: meta.view.current,
            old: meta.view.old
          });
        } else funcs.transition.callback.after();
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

      funcs.routes.deploy(name, function () {
        funcs.transition.callback.after();
      });
    } else if (!meta.routes[name]) {
      console.warn("Error. The route '" + name + "' does not exist.");
    } else if (name === meta.view.current) {
      // these requests are blocked because they are trying to go to the same
      // view as is currently displayed.
    }
  }
};
