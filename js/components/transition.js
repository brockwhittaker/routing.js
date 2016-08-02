module.set("transition", {
  /*
    TRANSITION STEPS:
    - Start transition to copy elem.
    - Display copy elem.
    - Load new view in original (display: none).
    - Run transitions.
    - Remove copy view.
    - Display original (new view).
  */

  // a func to make a deep clone of the existing container.
  clonePage: function (meta) {
    // if a current meta.copy exists, another transition is probably running.
    // cleanup this transition by killing the copy of meta.transition.
    if (meta.copy) {
      meta.copy.parentNode.removeChild(meta.copy);
      meta.copy = null;
    }

    meta.copy = meta.container.cloneNode(true);
    meta.copy.className = meta.view.old + "-namespace";
    // remove the ID because no two elements should have the same id.
    meta.copy.id = "clone_node";
  },

  // hide the current container.
  // add an inline styling to set display to 'none'.
  hideContainer: function (meta) {
    meta.container.style.display = "none";
  },

  // append meta.copy right after meta.container in the html.
  // this assumes that there's a parent node to the meta.container.
  // the container should be set to something other than <body> or <html>.
  appendCopy: function (meta) {
    // get the parent node of the current container.
    var parent = meta.container.parentNode;
    // insert meta.copy before the next element after meta.container,
    // which means after meta.container.
    parent.insertBefore(meta.copy, meta.container.nextSibling);
    // scroll to the top of the container before callback.
    meta.container.scrollTop = 0;
  },

  callback: {

    // set the transition to run on a new view load.
    // the first param is a dropped in function to always deploy privately
    // after any animation. the user MUST call this function for the animation
    // and view load to complete.
    // the second and third parameters are the copy container and the
    // container with the new view in it.
    // `this` is bound to `meta`.
    set: function (callback, meta) {
      meta.transition = callback;
    },

    // this is an internal set of instructions to run after a user defined
    // transition.
    // this removes the copy (that should be hidden by users), and makes sure
    // that the main container with the new view is showing.
    after: function (meta) {
      if (meta.copy) {
        // remove the copy node.
        meta.copy.parentNode.removeChild(meta.copy);
        meta.copy = null;
      }

      // if the display for the container is still set to none, set the
      // display to 'block'.
      if (meta.container.style.display == "none") {
        meta.container.style.display = "block";
      }

      // the animation is finally completed here.
      meta.animation.inProgress = false;
    }
  },

  // this is the procedural code to run before a transition is run by a user.
  // this creates a copy node of the original, hides the original container,
  // and then appends the copy such that it should be placed similarly in the
  // document.
  before: function (meta, callback) {
    this.clonePage(meta);
    this.appendCopy(meta);
    console.log("Copy appended at " + new Date().getTime());
    setTimeout((function () {
      this.hideContainer(meta);
      console.log("Container hidden at " + new Date().getTime());

      callback();
    }).bind(this), 50);
  }
});
