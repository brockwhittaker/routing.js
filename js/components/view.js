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
