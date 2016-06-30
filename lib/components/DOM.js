funcs.DOM = {

  // run through each node in the view nodeList.
  each: function (sel, callback) {
    var nodes = meta.container.querySelectorAll(sel);

    for (var x = 0; x < nodes.length; x++) {
      callback.call(nodes[x]);
    }
  }
};
