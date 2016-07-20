var Storage = {
  namespace: function (namespace) {
    return {
      __expired: function (timestamp) {
        var now = new Date().getTime();

        return timestamp ? timestamp < now : false;
      },

      set: function (key, value, expire) {
        var obj = {value: value, expire: expire};

        localStorage.setItem(namespace + "_" + key, JSON.stringify(obj));
      },

      get: function (key) {
        var data = localStorage.getItem(namespace + "_" + key);

        if (data && !this.__expired()) {
          data = JSON.parse(data);

          if (!this.__expired(data.expire)) {
            return data.value;
          } else {
            this.set(key, {});
          }
        } else return null;
      },

      isExpired: function (key) {
        var data = localStorage.getItem(namespace + "_" + key);

        if (data) {
          data = JSON.parse(data);

          console.log(data);

          return this.__expired(data.expire);
        } else return true;
      }
    };
  }
};

funcs.storage = Storage;
