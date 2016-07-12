funcs.controller = {
  // this gives the scope to users along with access to the container node.
  scope: function (callback, meta) {
    var route = meta.routes[meta.view.current],
        $scope = route.state;
    callback($scope, $scope.data, {
      container: meta.container,
      loaded: route.hasLoaded ? true : false,
      loads: route.loads
    });
  }
};
