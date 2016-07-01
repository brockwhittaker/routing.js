funcs.DOM = {
  append: function (node, parent) {
    parent.appendChild(node);
  },
  prepend: function (node, parent) {
    parent.insertBefore(node, parent.firstChild);
  },
  after: function (node, sibling) {
    sibling.parentNode.insertBefore(node, sibling.nextSibling);
  },
  fillWithObjectProperties: function (parent, object) {
    var nodes = parent.querySelectorAll("[b-obj]");

    var path, value;
    for (var x = 0; x < nodes.length; x++) {
      path = nodes[x].getAttribute("b-obj");
      value = funcs.util.dotToObject(object, path);

      nodes[x].innerHTML = value;
    }

    return parent;
  }
};
