route.controller(function ($scope, $data, view) {
  $scope.deleteMe = function () {
    console.log(this);
    $messages.remove(this);
  };

  $scope.submit = function () {
    var msg = $scope.input.self[0].value;
    console.log(msg);
    $messages.push({ username: "brock", message: msg });
  };

  var messages = [
    { username: "brock", message: "Hey, what's up?" },
    { username: "anon", message: "Not much, you?" },
    { username: "brock", message: "Just walking home from work." },
    { username: "anon", message: "Where are you from?" },
    { username: "brock", message: "San Francisco." }
  ];

  $messages = $scope.repeat("messages");

  window.$scope = $scope;

  messages.forEach(function (o) {
    $messages.push(o);
  });
});
