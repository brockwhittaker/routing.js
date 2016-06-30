// url should be a valid string path.
// cbs should be a valid object of callbacks [success] and [error].
funcs.ajax = function (url, cbs) {
  // create a new http request instance.
  var http = new XMLHttpRequest();

  // on state change, check the status of the http request. If 200, run the
  // success callback, otherwise run the error callback.
  http.onreadystatechange = function() {
    if (http.readyState == XMLHttpRequest.DONE) {
      if (http.status == 200) {
        cbs.success(http.responseText);
      }
      else if (http.status == 400) {
        cbs.error(http.responseText, {error: 400});
      }
      else {
        cbs.error(http.responseText, {error: "unknown"});
      }
    }
  };

  // if caching is disabled, force a new copy by appending a GET param 't'.
  if (meta.config.cache === false) {
    url += "?t=" + new Date().getTime();
  }

  // send a GET request.
  http.open("GET", url, true);
  http.send();
};
