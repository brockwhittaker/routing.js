var Callback = function () {
  var meta = {
    queue: [],
    isRunning: false
  };

  var funcs = {
    run: function () {
      if (meta.queue.length > 0) {
        meta.queue.shift()
      }
    },

    callback: function (url, callback) {
      $.get(url, (function (response) {
        this.callback()
      }).bind(this));
    }
  };

  return {
    then: function (url, callback) {
      meta.queue.push(url, callback);
    }
  };
};
