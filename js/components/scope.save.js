funcs.scope.save = function ($scope, meta, config) {
  var storage = new Storage.namespace(meta.view.current);

  storage.set("data", $scope.data, config ? config.expire : false);
};

funcs.scope.retrieve = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current),
      data = storage.get("data");

  return data;
};

funcs.scope.isExpired = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current);

  return storage.isExpired("data");
};

funcs.scope.apply = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current),
      data = storage.get("data");

  if (typeof data == "object") {
    for (var x in data) {
      $scope.data[x] = data[x];
    }

    return Object.keys(data).length > 0;
  } return false;
};
