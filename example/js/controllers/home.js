var messages = [
  { link: "https://wwww.google.com", username: "brock", message: "Hey, what's up?", bool: true, style: { color: "red", fontWeight: 300, webkitFilter: "blur(1px)" } },
  { link: "https://wwww.google.com", username: "anon", message: "Not much, you?", bool: false, },
  { link: "https://wwww.google.com", username: "brock", message: "Just walking home from work.", bool: true, },
  { username: "anon", message: "Where are you from?", bool: true, },
  { username: "brock", message: "San Francisco.", bool: true, }
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

  $messages.modifyView({
    username: function (name) {
      return "username: " + name;
    },
    message: function (msg) {
      return "This message is hidden.";
    },
    bool: function (flag) {
      if (flag) return "<div class='green bool'></div>";
      else return "<div class='red bool'></div>";
    }
  });

  $messages.push(messages);
  $names.push(names);

  $scope.event.add("messageInput", {
    keydown: {
      enter: function (e) {
        if (e.keyCode == 13) $scope.submit();
      }
    }
  });

  $scope.event.add("messages", {
    click: {
      removeMe: function () {
        $messages.remove(this);
      }
    }
  });

  window.$messages = $messages;
});
