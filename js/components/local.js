var Storage = {
  namespace: function (namespace) {
    return {
      set: function (key, value, lastUpdated) {
        var data = this.get(key);
        var obj = {value: value, lastUpdated: lastUpdated};

        localStorage.setItem(namespace + "_" + key, JSON.stringify(obj));
      },

      get: function (key) {
        var data = localStorage.getItem(namespace + "_" + key);

        if (data) {
          return JSON.parse(data);
        } else return null;
      },

      lastUpdated: function (key) {
        var data = this.get(key);

        if (data) {
          return data.lastUpdated;
        } else return false;
      }
    };
  }
};

funcs.storage = Storage;
