funcs.view = {

  new: function (name, meta) {
    var utils = {
      replaceNamespace: function (node, name) {
        // remove the old namespace.
        node.className = meta.container.className.split(/\s+/g).filter(function (o) {
          return !/-namespace/g.test(o) && o;
        }).concat(name + "-namespace").join(" ");

        return node;
      }
    };

    // if the new view is different from the old view, run the transition.
    if (name !== meta.view.current && meta.view.current !== null && meta.routes[name]) {
      var $scope = meta.routes[meta.view.current].state;

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

      meta.container = utils.replaceNamespace(meta.container, name);

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

      meta.container = utils.replaceNamespace(meta.container, name);

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
