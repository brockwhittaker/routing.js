// this runs through a settings object and applies the settings individually
// to the config object inside of the meta object.
// this function is bound to meta.config, so `this` is the operative var.
funcs.config = function (settings, meta) {
  for (var x in settings) {
    // make sure the property already exists. Don't set new properties.
    if (settings.hasOwnProperty(x) && typeof meta.config[x] !== "undefined") {
      meta.config[x] = settings[x];
    // else throw a warning that you can't set new properties.
    } else {
      console.warn("Warning. Cannot set new property '" + x + "' to config.");
    }
  }

  return this.proto;
};
