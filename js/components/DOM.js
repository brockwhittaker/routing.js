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
  remove: function (node) {
    node.parentNode.removeChild(node);
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
  },
  parentAndChildren: function (node) {
    var arr = [node];

    var children = node.childNodes;

    for (var x = 0; x < children.length; x++) {
      arr.push(children[x]);
    }

    return arr;
  }
};
