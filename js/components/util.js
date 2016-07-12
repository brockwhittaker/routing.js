funcs.util = {

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

  dotToObject: function (object, path) {
    path = path.split(/\./);

    path.forEach(function (o) {
      if (object[o]) object = object[o];
      // else console.warn("Cannot find property '" + o + "' of object in dot notation.");
    });

    return (typeof object !== "object" || Array.isArray(object)) ? object : "";
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
  }
};
