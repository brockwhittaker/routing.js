var sendToSection = function ($map, section) {
  $("#page").animate({
    scrollTop: $map[section].offsetTop
  }, 500);
};

var sidebar = (function ($sidebar) {
  return {
    show: function () {
      $sidebar.addClass("show");
    },
    hide: function () {
      $sidebar.removeClass("show");
    }
  };
}).call(null, $("#sidebar"));

var printTemplates = function (template, $parent, nodes, $sidebarItems) {
  nodes.forEach(function (node) {
    $parent.append(template.new(node.tag, node));
  });

  var sidebar = generateSidebar();
  $sidebarItems.push(sidebar.object);

  var get = route.hash.get().get;

  if (get.section) {
    // give it a bit of a delay for UI.
    setTimeout(function () {
      sendToSection(sidebar.map, get.section);
    }, 250);
  }

  return sidebar.map;
};

var generateSidebar = function () {
  var $categories = $("h1, h3");
  var obj = [],
      map = {};

  var cata;
  $categories.each(function () {
    map[this.innerText] = this;

    if (this.tagName == "H1") {
      obj.push({ title: this.innerText, children: [] });
      cata = obj[obj.length - 1].children;
    } else {
      cata.push({ title: this.innerText });
    }
  });

  return { object: obj, map: map };
};

route.controller(function ($scope, $data, view) {
  var $sections = $scope.repeat("section"),
      template = route.template;

  $("body").fadeIn(200);

  var $sidebarItems = $scope.repeat("sidebarItem");

  template.complete(function () {
    $data.sidebarMap = printTemplates(template, $("article"), sections, $sidebarItems, $scope);
  });

  $('code pre').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $scope.sClick = function () {
    var title = this.innerText;

    route.hash.set.get({ section: title });

    /* -- jQuery for adding highlighting and page scroll -- */
    $(".item").removeClass("selected");
    $(this).addClass("selected");

    $("#page").animate({
      scrollTop: $data.sidebarMap[title].offsetTop
    }, 500, function () {
      sidebar.hide();
    });
    /* -- end of jQuery -- */
  };

  console.log($scope, $data, view);

  window.$sections = $sections;
});
