var printTemplates = function (template, $parent, nodes) {
  nodes.forEach(function (node) {
    $parent.append(template.new(node.tag, node));
  });
};

route.controller(function ($scope, $data, view) {
  var $sections = $scope.repeat("section"),
      template = route.template;

  $("body").fadeIn(200);

  if (template.isComplete) {
    printTemplates(template, $("article"), sections);
  } else {
    template.onComplete(function () {
      printTemplates(template, $("article"), sections);
    });
  }

  $('code pre').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  console.log($scope, $data, view);

  window.$sections = $sections;
});
