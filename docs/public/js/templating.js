var Template = function () {
  var funcs = {
    builder: function (tag, obj) {
      // create a new element with tag or default `div`.
      var node = document.createElement(tag || "div");

      // for each prop in obj, set as attribute if it is a valid attr.
      for (var x in obj) {
        if (node.hasAttribute(x)) {
          node.setAttribute(x, obj[x]);
        } else {
          node[x] = obj[x];
        }
      }

      return node;
    },

    fill: function (html) {
      return funcs.builder(this, {
        innerHTML: html
      });
    }
  };

  return {
    section: function () {
      var node = funcs.builder("section", {});
      return node;
    },

    p: funcs.fill.bind("p"),
    h1: funcs.fill.bind("h1"),
    h2: funcs.fill.bind("h2"),
    h3: funcs.fill.bind("h3"),

    list: function (arr) {
      var $node = Modify(funcs.builder("ol", {}));

      arr.forEach(function (o) {
        var node = funcs.builder("li", {
          innerHTML: o
        });
        $node.append(node);
      });

      return $node.get();
    },

    argumentTable: function (list) {
      var $table = Modify(funcs.builder("table"), {}),
          $thead = $table.append(funcs.builder("thead")),
          $tbody = $table.append(funcs.builder("tbody")),
          $head_tr = $thead.append(funcs.builder("tr"));

      $head_tr.append(funcs.builder("td", {
        innerHTML: "Param",
        className: "param"
      }));

      $head_tr.append(funcs.builder("td", {
        innerHTML: "Description",
        className: "description"
      }));

      list.forEach(function (o) {
        var $tr = $tbody.append(funcs.builder("tr"));

        $tr.append(funcs.builder("td", {
          innerHTML: o[0],
          className: "param"
        }));

        $tr.append(funcs.builder("td", {
          innerHTML: o[1],
          className: "description"
        }));
      });

      return $table.get();
    },

    code: function (code) {
      var $code = Modify(funcs.builder("code", {})),
          pre = $code.append(funcs.builder("pre", {
            innerHTML: code
          }));

      return $code.get();
    }
  };
};

var Modify = function ($node) {

  return {
    get: function () {
      return $node;
    },
    append: function (node) {
      $node.appendChild(node);

      return Modify(node);
    }
  };
};

var Builder = function (template, sections) {
  var appendComponent = function ($parent, type, data) {
    if (/h\d+|^p$/.test(type)) {
      $parent.append(template[type](data));
    } else if (type == "list") {
      $parent.append(template.list(data));
    } else if (type == "argumentTable") {
      $parent.append(template.argumentTable(data));
    } else if (type == "code") {
      $parent.append(template.code(data));
    }
  };

  var section_list = [];

  sections.forEach(function (o) {
    var $section = Modify(template.section());

    o.forEach(function (node_shell) {
      appendComponent($section, node_shell[0], node_shell[1], node_shell[2]);
    });

    section_list.push($section.get());
  });

  return section_list;
};
