var messages = [
  { username: "brock", message: "Hey, what's up?" },
  { username: "anon", message: "Not much, you?" },
  { username: "brock", message: "Just walking home from work." },
  { username: "anon", message: "Where are you from?" },
  { username: "brock", message: "San Francisco." }
];

var names = [
  { name: "Brock", numbers: [
    {number: 1},
    {number: 2},
    {number: 3}
  ] },
  { name: "Andrew", numbers: [
    {number: 1},
    {number: 4},
    {number: 3}
  ] }
];

route.controller(function ($scope, $data, view) {
  window.$scope = $scope;

  /* -- repeat messages in above object -- */
  $messages = $scope.repeat("messages");
  $names = $scope.repeat("names");

  /* -- $scope listeners -- */
  $scope.submit = function () {
    var msg = $scope.input.self[0].value;
    $messages.push({ username: "brock", message: msg });
  };

  $scope.deleteMe = function () {
    $messages.remove(this);
  };


  messages.forEach(function (o) {
    $messages.push(o);
  });

  names.forEach(function (o) {
    $names.push(o);
  });
});
