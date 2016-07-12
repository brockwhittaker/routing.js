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
    var nodes = parent.querySelectorAll("[b-obj],[b-repeat-in]");

    var path, src, value, srcValue, repeatIn;

    for (var x = 0; x < nodes.length; x++) {
      if (nodes[x].hasAttribute("b-repeat-in")) {
        var prop = nodes[x].getAttribute("b-repeat-in");


        if (!funcs.util.isSample(nodes[x]) && object[prop]) {
          object[prop].forEach((function (o, i) {
            var clone = nodes[x].cloneNode(true);

            clone.removeAttribute("b-repeat-in");

            clone.repeat = o;
            clone.index = i;
            this.fillWithObjectProperties(clone, o);
            // console.log(clone.repeat, clone, nodes[x]);
            try {
              funcs.DOM.append(clone, nodes[x].parentNode);
            } catch (e) { console.log(e); }
          }).bind(this));
        }

        try {
          funcs.DOM.remove(nodes[x]);
        } catch (e) {}
      } else if (funcs.util.isSample(nodes[x])) {
        funcs.DOM.remove(nodes[x]);
      } else if (
        (nodes[x].hasAttribute("b-obj")|| nodes[x].hasAttribute("b-src")) &&
        !nodes[x].hasAttribute("b-repeated-in")) {

        path = nodes[x].getAttribute("b-obj");
        src = nodes[x].getAttribute("b-src");

        if (path) {
          value = funcs.util.dotToObject(object, path);
          nodes[x].innerHTML = value;
        }

        if (src) {
          srcValue = funcs.util.dotToObject(object, src);
          nodes[x].setAttribute("src", srcValue);          
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
