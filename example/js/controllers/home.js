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
  var $messages = $scope.repeat("messages");
  var $names = $scope.repeat("names");

  /* -- $scope listeners -- */
  $scope.submit = function () {
    var data = $scope.input.val(["messageInput"], $scope._.CLEAR_INPUT);

    $messages.push({ username: "brock", message: data.messageInput });
  };

  $messages.push(messages);
  $names.push(names);

  $scope.event.add("messages", {
    click: {
      deleteMe: function () {
        $messages.remove(this);
      }
    }
  });
});
