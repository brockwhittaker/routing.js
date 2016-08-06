module.find("scope").setKeys({
  save: function ($scope, meta, config) {
    var storage = new Storage.namespace(meta.view.current);

    var $data = {};

    for (var x in $scope) {
      if ($scope.hasOwnProperty(x)) {
        $data[x] = $scope.data[x];
      }
    }

    storage.set("data", $data, new Date().getTime());
  },
  retrieve: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current),
        data = storage.get("data");

    return data;
  },
  lastUpdated: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current);

    return storage.lastUpdated("data");
  },
  remove: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current);

    storage.set("data", {}, new Date().getTime());
  },
  apply: function ($scope, meta) {
    var storage = new Storage.namespace(meta.view.current),
        data = storage.get("data");

    if (typeof data == "object" && data) {
      data = data.value;

      for (var x in data) {
        $scope.data[x] = data[x];
      }

      return Object.keys(data).length > 0;
    } return false;
  }
});
