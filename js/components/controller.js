funcs.controller = {
  // this gives the scope to users along with access to the container node.
  scope: function (callback, meta) {
    var route = meta.routes[meta.view.current],
        $scope = route.state;

    setTimeout(function () {
      callback($scope, $scope.data, {
        container: meta.container,
        // this sounds ridiculous but it isn't.
        // loaded state = false -> 0 -> true.
        // false && 0 == false.
        loaded: route.hasLoaded ? true : false,
        loads: route.loads
      });
    });
  }
};
