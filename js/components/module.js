var ModuleBuilder = function () {
  // storing the modules here.
  var modules = {};

  // publicly accessible functions.
  return {
    // create a new module by name.
    // returns an `IndModule` closure to modify particular parts.
    new: function (name) {
      if (!modules[name]) {
        modules[name] = {};
        return new IndModule(modules[name]);
      } else console.warn("Error. Module with name `" + name + "` already exists.");
    },
    // find a module and return an IndModule instance by name.
    find: function (name) {
      if (modules[name]) {
        return new IndModule(modules[name]);
      } else console.warn("Error. Module with name `" + name + "` does not exist.");
    },
    // delete a module by name.
    delete: function (name) {
      if (modules[name]) {
        delete modules[name][key];
      } else console.warn("Error. Tried deleting module `" + name + "` but does not exist.");
    },
    // get the contents of a module by name.
    get: function (name) {
      if (modules[name]) {
        return modules[name];
      } else {
        console.warn("Error. Module with name `" + name + "` does not exist.");
        return {};
      }
    },
    set: function (name, value) {
      if (!modules[name]) {
        modules[name] = value;
      } else {
        console.warn("Error. Module with name `" + name + "` already exists.");
      }

      return this;
    }
  };
};

// modify particular parts of an individual module.
var IndModule = function (module) {
  return {
    // create a new sub-module.
    new: function (name) {
      if (!module[name]) {
        module[name] = {};
        return new IndModule(module[name]);
      } else console.warn("Error. Module with name `" + name + "` already exists.");
    },
    // find a sub-module.
    find: function (name) {
      if (module[name]) {
        return new IndModule(module[name]);
      } else console.warn("Error. Module with name `" + name + "` does not exist.");
    },
    // set a key inside an individual module.
    setKey: function (key, value) {
      if (module) {
        module[key] = value;
      } else console.warn("Error. Module does not exist.");

      return this;
    },
    setKeys: function (obj) {
      if (module) {
        for (var x in obj) {
          if (obj.hasOwnProperty(x)) {
            module[x] = obj[x];
          }
        }
      }

      return this;
    },
    // get the contents of a particular key.
    getKey: function (key) {
      if (module[key]) {
        return module[key];
      } else return {};
      console.warn("Error. Module with key `" + key + "` does not exist.");
    },
    // delete a key inside a module.
    deleteKey: function (key) {
      if (module) {
        delete module[key];
      } else console.warn("Error. Tried deleting key `" + key + "` but does not exist.");
    }
  };
};


// fix the sidebars -- they still aren't fixed.
// some shifts are showing up when they shouldn't.
// have only user role shown.
