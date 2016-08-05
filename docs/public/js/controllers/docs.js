var printTemplates = function (template, $parent, nodes, $sidebarItems) {
  nodes.forEach(function (node) {
    $parent.append(template.new(node.tag, node));
  });

  var sidebar = generateSidebar();
  $sidebarItems.push(sidebar.object);

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

  if (template.isComplete) {
    $data.sidebarMap = printTemplates(template, $("article"), sections, $sidebarItems, $scope);
  } else {
    template.onComplete(function () {
      $data.sidebarMap = printTemplates(template, $("article"), sections, $sidebarItems, $scope);
    });
  }

  $('code pre').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $scope.sClick = function () {
    var title = this.innerText;

    $("#page").animate({
      scrollTop: $data.sidebarMap[title].offsetTop
    }, 500);
  };

  console.log($scope, $data, view);

  window.$sections = $sections;
});
