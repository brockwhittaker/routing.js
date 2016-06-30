funcs.routes = {
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
      funcs.util.createScope($scope, meta.routes);

    // otherwise throw an error that the route already exists.
    } else throw "Error. Route with the name '" + name + "' already exists.";

    return _prototype;
  },

  // if the route exists, load the assets and then run a callback when loaded.
  deploy: function (name, callback) {
    var route = meta.routes[name];

    if (route) {
      funcs.hash.public.set.view(name);

      funcs.load.page(route, function (response) {
        console.log("loaded route '" + name + "'!");
        // run the callback to say, "I'm done loading!".
        if (callback) callback();
      });

    } else throw "Error. Route with the name '" + name + "' does not exist.";

    return _prototype;
  }
};
