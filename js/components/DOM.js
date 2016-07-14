funcs.DOM = {
  // simple append operation of a valid node to a parent node.
  // the opposite of prepend.
  append: function (node, parent) {
    parent.appendChild(node);
  },
  // append a valid node to the start of a parent (before all other children).
  prepend: function (node, parent) {
    parent.insertBefore(node, parent.firstChild);
  },
  // append a valid node after a valid sibling node.
  after: function (node, sibling) {
    sibling.parentNode.insertBefore(node, sibling.nextSibling);
  },
  // append a valid node before a valid sibling node.
  before: function (node, sibling) {
    sibling.parentNode.insertBefore(node, sibling);
  },
  // remove a node from the DOM.
  remove: function (node) {
    node.parentNode.removeChild(node);
  },
  // check an entire document fragment for b-obj attributes.
  // then convert dot notation like self.Id to obj["self"]["Id"]
  // set the value of obj["self"]["Id"] in the document innerHTML.
  fillWithObjectProperties: function (parent, object) {
    var nodes = parent.querySelectorAll("[b-prop]");

    var map = {
      "b-prop": "innerHTML",
      "b-src": "src",
      "b-href": "href"
    };

    var attr, val;
    for (var x in map) {
      if (map.hasOwnProperty(x)) {
        attr = node.getAttribute(x);
        if (typeof attr !== "undefined" && attr !== null) {
          val = funcs.util.dotToObject(object, path);
          node.removeAttribute(x);
          node[map[x]] = val;
        }
      }
    }

    return parent;
  },

  // get the parent and all children of a node.
  parentAndChildren: function (node) {
    var arr = [node];

    if (node.querySelectorAll) {
      var children = node.querySelectorAll("*");

      for (var x = 0; x < children.length; x++) {
        arr.push(children[x]);
      }

    }

    return arr;
  },
  allParents: function (node) {
    var parents = [];

    while (node.parentNode) {
      parents.unshift(node.parentNode);
      node = node.parentNode;
    }

    return parents;
  },
  hasRepeatParent: function (node) {
    while (node.parentNode && node.parentNode.hasAttribute) {
      if (node.parentNode.hasAttribute("b-repeat")) return true;
      else node = node.parentNode;
    }

    return false;
  }
};
