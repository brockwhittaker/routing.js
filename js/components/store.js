module.set("store", function (meta) {
  return {
    // delete all $data from all views.
    delete: function () {
      var util = module.get("util");

      var data;

      util.objectLoop(meta.routes, function (o, i) {
        var storage = module.get("storage").namespace(i);

        util.objectLoop(o.state.data, function (_, i, obj) {
          delete obj[i];
        });

        storage.remove("data");
      });
    },

    // get $data from another view.
    get: function (view) {
      return meta.routes[view].state.data;
    }
  };
});
