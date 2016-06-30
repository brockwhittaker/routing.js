var Transition = (function () {
  /* the view position structure determines which way the transition slides. */
  var routes = {};

  return {
    // add a route, which consists of the name of the view and the linear position
    // of the view.
    addView: function (name, position) {
      routes[name] = {
        name: name,
        position: position
      };

      return this;
    },
    transition: function (ms) {
      // creates a new transition callback with variables that change depending
      // on what is passed to the callback.
      route.transition(function (done, elems, views) {
        // find out which general direction the page is in (left, right).
        var inertia = -(routes[views.new].position - routes[views.old].position);

        // set the animate.css classes depending on the inertia.
        var fadeOut = inertia > 0 ? "fadeOutRight" : "fadeOutLeft";
        var fadeIn = inertia < 0 ? "fadeInRight" : "fadeInLeft";

        // run it.
        $(elems.old).removeClass().addClass("animated " + fadeOut);
        $(elems.new).removeClass().addClass("position-abs animated " + fadeIn);

        setTimeout(function () {
          done();
        }, ms);
      });

      return this;
    }
  };
});
