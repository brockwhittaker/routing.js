funcs.hash = {
  public: {
    // this decompiles the hash into two components: the view and the pseudo-get
    // parameters. This information is then returned as an object.
    get: function () {
      // get the location.hash without the hash (#) and the forward slash (/).
      var hash = window.location.hash.substr(2);
      // match everything alphanumeric, -, and _.
      var view = hash.match(/^[\w_-]+/);
      // replace everything in the view before the ? and the leading ?.
      var get = hash.replace(/^[\w_-]+\?{0,}/, ""),
          map = {};

      // if there is anything afterwards, seperate x=1&y=2 to:
      // [["x", "1"], ["y", "2"]
      if (get.length > 0) {
        get = get.split(/&/g).map(function (o) {
          return o.split(/=/g);
        });

        // create a map to map `get` to.
        map = {};

        // for each get variable, map the key to the value.
        get.forEach(function (o) {
          map[o[0]] = o[1];
        });
      }

      // if at least a view exists, return what was gotten.
      if (view) {
        return {
          view: view[0],
          get: map
        };
      // otherwise return false becasue hash retrieval was unsuccessful.
      } else return false;
    },

    // an object for setters for the location.hash.
    set: {

      // a setter function to set the new view name of a contaienr without
      // disrupting the pseudo-get paramters.
      view: function (value) {
        var hash = funcs.hash.public.get(),
            get = funcs.hash.private.concatGet(hash.get);

        if (!hash) {
          window.location.hash = "/" + value;
        } else {
          window.location.hash = "/" + value + (get ? "?" + get : "");
        }
      },

      // a setter function to set the pseudo-get params in the location.hash
      // while preserving the identity of the current view.
      // this accepts an object of key-values and converts it to 'x=1&y=2'
      // format.
      get: function (obj) {
        var hash = funcs.hash.public.get(),
            get = funcs.hash.private.concatGet(obj);

        if (!hash) throw "Error. No view currently set.";
        else {
          window.location.hash = "/" + hash.view + (get ? "?" + get : "");
        }
      }
    }
  },

  // private internal location.hash functions to not be included in funcs.hash.
  private: {
    // a function that takes a parameter `get` which should be of type 'object'.
    // this sets object in x=4&y=5.
    concatGet: function (get) {
      var arr = [];

      for (var x in get) {
        if (get.hasOwnProperty(x)) {
          arr.push([x, get[x]]);
        }
      }

      return arr.map(function (o) {
        return o.join("=");
      }).join("&");
    }
  }
};
