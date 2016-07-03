route.controller(function ($scope, $data, view) {
  var $people = $scope.repeat("people");

  $.get("data/people.json", function (response) {
    response.forEach(function (o) {
      $people.push(o);
    });
  });
});
