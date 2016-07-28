funcs.scope.save = function ($scope, meta, config) {
  var storage = new Storage.namespace(meta.view.current);

  storage.set("data", $scope.data, new Date().getTime());
};

funcs.scope.retrieve = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current),
      data = storage.get("data");

  return data;
};

funcs.scope.lastUpdated = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current);

  return storage.lastUpdated("data");
};

funcs.scope.remove = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current);

  storage.set("data", {}, new Date().getTime());
};

funcs.scope.apply = function ($scope, meta) {
  var storage = new Storage.namespace(meta.view.current),
      data = storage.get("data");

  if (typeof data == "object" && data) {
    data = data.value;

    for (var x in data) {
      $scope.data[x] = data[x];
    }

    return Object.keys(data).length > 0;
  } return false;
};
