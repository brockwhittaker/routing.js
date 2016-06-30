funcs.controller = {
  // this gives the scope to users along with access to the container node.
  scope: function (callback) {
    var $scope = meta.routes[meta.view.current].state;
    callback($scope, $scope.data, meta.container);
  }
};
