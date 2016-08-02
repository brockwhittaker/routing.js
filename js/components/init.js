// any processes that need to be done on initialization of the RouteConfig
// function.
module.set("init", function (meta, container) {
  // on hash change, run the route.deploy function through the funcs.view.new
  // wrapper function.
  window.onhashchange = (function () {
    var hash = this.hash.public.get();
    this.view.new(hash.view, meta);
  }).bind(this);

  // query select the first element in the container selection.
  meta.container = (typeof container == "string") ?
    document.querySelectorAll(container)[0] :
    container;

  // initialize the DOM mutation watcher.
  module.get("mutation").addEvents(meta);
});
