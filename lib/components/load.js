// load functions that utilize AJAX or XHR requests to either fetch html
// or javascript.
funcs.load = {
  // fetch HTML from a desired component page and trigger a callback with
  // the results.
  html: function (url, callback) {
    funcs.ajax(url, {
      success: function (response) {
        callback(response);
      },
      error: function (response, error) {
        callback(response);
        throw error;
      }
    });
  },

  // change the meta.script src to the desired url and then onload run the
  // callback function.
  script: function (url, callback) {
    // remove the old script from the document.body.
    if (meta.script) document.body.removeChild(meta.script);

    // create a new script.
    meta.script = document.createElement("script");

    // onload, run a callback saying "I'm done!".
    meta.script.onload = function () {
      callback();
    };

    // set the source of the script to the desired url.
    meta.script.src = url;

    // append the script to the document.body.
    document.body.appendChild(meta.script);
  },

  // loads both the html and script and then runs a general callback.
  page: function (route, callback) {
    var loaded = {
      html: false,
      script: false
    };

    // run this function to load the scripts and run the callback.
    // this function inherits route, loaded, and callback params.
    // it is also bound to `this`, the funcs.load scope to access
    // funcs.load.script directly.
    // this function also now runs controller javascript to add event listeners.
    var loadScript = (function () {
      // load the script and trigger the completion callback if html is loaded.
      this.script(route.url.script, function () {
        loaded.script = true;

        callback();
      });
    }).bind(this);

    // if the route has already been loaded, the HTML is already stored.
    // use this version instead.
    // for this to load from storage, cache must be enabled, so
    // meta.config.cache must equal `true`.
    if (route.content.html && meta.config.cache) {
      loaded.html = true;
      meta.container.innerHTML = route.content.html;

      loadScript();
    } else {
      // load the html, return the response, set the innerHTML for later,
      // and trigger the completion callback if script is already loaded.
      this.html(route.url.html, function (response) {
        loaded.html = true;
        route.content.html = response;
        meta.container.innerHTML = route.content.html;

        loadScript();
      });
    }

  }
};
