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
        state: {},
        hasLoaded: false,
        loads: 0
      };

      var $scope = meta.routes[name].state;
      funcs.scope.create.scope(meta, $scope, meta.routes);

    // otherwise throw an error that the route already exists.
    } else throw "Error. Route with the name '" + name + "' already exists.";
  },

  // if the route exists, load the assets and then run a callback when loaded.
  deploy: function (meta, name, callback) {
    var route = meta.routes[name];

    if (route.hasLoaded === false) route.hasLoaded = 0;
    else if (route.hasLoaded === 0) route.hasLoaded = true;

    route.loads++;

    if (route) {
      funcs.hash.public.set.view(name);

      funcs.scope.removeAllNodeRefs(meta.routes[name].state);

      funcs.load.page(meta, route, function (response) {
        console.log("loaded route '" + name + "'!");
        // run the callback to say, "I'm done loading!".
        if (callback) callback();
      });

    } else throw "Error. Route with the name '" + name + "' does not exist.";

    return this;
  }
};
