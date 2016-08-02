var ListOperations = function ($list, $data) {
  return {
    get: function () {
      return $list.get();
    },
    save: function () {
      $data.list = this.get();
      $data.save();
    },
    add: function (list) {
      if (list) {
        $list.push(list);
        this.save();
      }
    }
  };
};

route.controller(function ($scope, $data, view) {
  window.$list = $scope.repeat("list");
  window.$scope = $scope;

  $data.apply();

  var listOp = new ListOperations($list, $data);
  listOp.add($data.list);

  $list.modifyView({
    checkbox: function (val) {
      return "<div b-click='clickCheckbox' class='checkbox " + (val ? "checked" : "") + "' />";
    },
    urgency: function (val) {
      return "!".repeat(val);
    }
  });

  $scope.event.add("todoInput", {
    keydown: {
      enter: function (e) {
        if ((e.keyCode || e.which) == 13)
          $scope.newTodo();
      }
    }
  });

  $scope.newTodo = function () {
    var input = $scope.input.val(["todoInput", "urgency"]);
    listOp.add({ checkbox: false, title: input.todoInput, urgency: input.urgency });
  };

  $scope.clickCheckbox = function () {
    // get the container before modification and then the b-parent.
    var parent = this.parentNode.bParent;

    $list.modify(parent, (function (obj) {
      obj.checkbox = !/checked/.test(this.className);
      listOp.save();
    }).bind(this));
  };

  $scope.removeCompleted = function () {
    $list.filter(function (o) {
      return !o.checkbox;
    });
  };
});


// add AREA filter in BfSinglePage in the search mechanism to the right.
// fix double digit numbers on search module.
