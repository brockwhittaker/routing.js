var messages = [
  { username: "brock", message: "Hey, what's up?" },
  { username: "anon", message: "Not much, you?" },
  { username: "brock", message: "Just walking home from work." },
  { username: "anon", message: "Where are you from?" },
  { username: "brock", message: "San Francisco." }
];

route.controller(function ($scope, $data, view) {
  /* -- $scope listeners -- */
  $scope.submit = function () {
    var msg = $scope.input.self[0].value;
    $messages.push({ username: "brock", message: msg });
  };

  $scope.deleteMe = function () {
    $messages.remove(this);
  };

  /* -- repeat messages in above object -- */
  var $messages = $scope.repeat("messages");

  messages.forEach(function (o) {
    $messages.push(o);
  });
});
