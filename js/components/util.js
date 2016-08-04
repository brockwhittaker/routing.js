module.set("util", {
  // creating an immutable property of an object.
  immutable: function (obj, key, value) {
    var config = {
      writable: false,
      configurable: true
    };

    // if there's no value, don't set the property so it doesn't overwrite
    // any previous content.
    if (value) config.value = value;

    Object.defineProperty(obj, key, config);

    return this;
  },

  mutable: function (obj, key) {
    Object.defineProperty(obj, key, {
      writable: true
    });
  },

  tempUnlock: function (obj, key, callback) {
    this.mutable(obj, key);
    callback(obj);
    this.immutable(obj, key);
  },

  dotToObject: function (obj, path) {
    if (typeof path == "string") {
      path = path.split(/\./);

      for (var x = 0; x < path.length; x++) {
        // go deeper as long as you can to find the specified object.
        if (typeof obj[path[x]] !== "undefined" && obj[path[x]] !== null) {
          obj = obj[path[x]];
        // if it cannot complete the whole path, just return early `undefined`.
        } else return "";
      }

      return typeof obj == "undefined" ? "" : obj;
    } else throw "Error. Path must be a string.";
  },

  findNearestParentRepeat: function (node) {
    var parent;

    while (node.parentNode) {
      if (node.parentNode.repeat) parent = node.parentNode;
      node = node.parentNode;
    }

    return parent;
  },

  isSample: function (node) {
    var parent;

    while (node.parentNode) {
      if (node.parentNode.hasAttribute("b-repeat")) return true;
      node = node.parentNode;
    }

    return false;
  },

  objectLoop: function (obj, callback) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) {
        callback(obj[x], x, obj);
      }
    }
  }
});
