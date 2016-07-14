#routing.js
This library is essentially a scaled-down version of angular. It allows you to have views appear inside a single container, transition between views, store data associated with a view, and add event listeners from the HTML.

##Basic Usage

```javascript
// create a new routing system.
var route = new RouteConfig("#view");
```

##Creating a Route
To create a route, you must have a name for the route, an HTML path associated with the route, and a JS path associated with it.

JavaScript files for each view should go in `js/controllers` and views should go in `views`.

Once you've created the appropriate files, link to it as such:

```javascript
// create a new route.
route.add("home", "../path/to/home.html", "../path/to/js.js");
```

Great! You've created your first route. From here, let's create a basic app. A user should be able to type their name into an input box and have it appear in the format "Hi, your name is {{name}}." below the input.

Let's first write the markup for this. In **routing.js** there are two methods for adding events to elements. The first, and most encompassing (but most verbose) is to add a `b-name` attribute with the desired name of the element and `b-events` attribute to the element specifying all the event listeners you'd like to include; seperated by commas.

Let's do this for the input. We want to add an `input` event listener to it. For the output div we want to just add a name so that we can reference it later.

```html
<input type='text' b-name='name' b-events='input' />
<div b-name='output'></div>
```

Great! The alternative syntax which requires less JavaScript is to instead use the `b-input` attribute to specify a function inside the `$scope` to call on `input`. This looks like:

```html
<input type='text' b-name='name' b-input='nameInput' />
```

Now, to add the logic to this, we need to go into the JavaScript controller in the path you set above. In here, let's add the following code:

```javascript
// create a new controller instance.
// the controller already knows what view you are in.
route.controller(function ($scope, $data, view) {
  // get the element where the b-name='name'.
  $scope.event.add("name", "input", function () {
    // set the element where the b-name='output' to the value of b-name='name'.
    $scope.output.self[0].innerText = this.value;
  });
});
```

The alternative syntax described above would look like:

```javascript
route.controller(function ($scope, $data, view) {
  // see, it's a bit shorter.
  $scope.nameInput = function () {
    $scope.output.self[0].innerText = "Hi, your name is" + this.value + ".";
  };
})
```

All nodes are placed inside the `$scope` object in the format `$scope[{{b-name}}]`. Inside there is a component for each event listener such as `click`, `mousemove`, or `input`. There is also a `self` component that refers to the node itself.

##Adding Event Listeners
Event listeners can be added in a ton of different ways, many with different features. Below is a list of those ways and the pros/cons associated with them.

### Direct Assignment

If you want to directly tie a function to a type of event under a `b-name` class, such as a `click` event to the `ind-message` group, you can do so with the short-hand syntax like:

```html
<div b-name="ind-message" b-click="clickMe"></div>
```

Then in the controller, all you have to do is set the `$scope.clickMe` property to the function that should be called.

```javascript
route.controller(function ($scope, $data, view) {
  $scope.clickMe = function () {
    console.log("You clicked this.", this);
  };
});
```

### Safe Assignment

While you can technically set event listeners in the format `$scope[b-name][event]`, it isn't recommended as if the `b-name` doesn't exist yet, JavaScript will throw an `Uncaught ReferenceError`. In order to safely set event listeners to a `b-name` class, use the `$scope.get` syntax.

```javascript
$scope.get(b-name).click = function () {
  // .. your code here.
};
```

The benefit of this syntax is that it creates the wrapper for the `b-name` object even if it doesn't exist so that when it does, all event listeners added before will automatically work. This will output a `console.warn` however if you assign this before a node exists.

If you want to plainly (and safely) assign a single or multiple events to any object, you can use the key/value syntax like below to add events:

```javascript
$scope.events.add(b-name, "click", function () {
  // .. your code here.
})
```

###Multiple Assignment

You can assign multiple event listeners easily with the object notation to a `b-name`.

```javascript
$scope.events.add(b-name, {
  click: function () {
    // .. your code here.
  },
  mousemove: function () {
    // .. more code here.
  },
  dragstart: function () {
    // .. more code here.
  }
});
```

##Repeating HTML Dynamically
A rather convenient feature in **routing.js** is a dynamic repeater function. You can use the `b-repeat` function to create an empty array that is bound to DOM element creation. That means that whenever you add to this array or take away from it you also add or remove nodes live from the view.

For example let's say you have a simple messaging app and you want a new fragment with a message to appear every time you get data. Below we'll see how to do that. First is the HTML:

```html
<div b-repeat="messages">
  <div b-obj="username"></div>
  <div b-obj="message"></div>
</div>
```

Now in the JavaScript, we can add the listener that will connect to the b-repeat and append the `message` fragment every time you add data to the messages array.

```javascript
route.controller(function ($scope, $data, view) {
  $messages = $scope.repeat("messages");

  // appends a new b-repeat='message' fragment below the last.
  $messages.push({
    username: "brockwhittaker",
    message: "Let's grab coffee at 3?"
  });
});
```

We can also remove nodes dependent on object qualifiers using the `filter` function. Let's say for example a user "anon" just got banned from the server and you want to remove all his messages from the view along with the associated data. No problem. Just filter the data to reject any index where the username property is equal to "anon".

```javascript
route.controller(function ($scope, $data, view) {
  $messages = $scope.repeat("messages");

  // removes all nodes and data associated with the object.username "anon".
  $messages.filter(function (o) {
    return o.username !== "anon";
  });
})
```

Other array operations include `unshift` which works like `$(sel).prepend` in jQuery, and `at`, which appends the element at a specified index.

The benefit of using the `b-repeat` feature is that it can be done at any time as long as you append to the object created by `$scope.repeat(name)`. All event listeners are also added on the fly, which means that you have full functionality with all dynamically created elements. For example below, let's create a message like above but with an event listener that onclick deletes the node.

```html
<div b-repeat="messages" b-click="deleteMe">
  <div b-obj="username"></div>
  <div b-obj="message"></div>
</div>
```

```javascript
route.controller(function ($scope, $data, view) {
  $scope.deleteMe = function () {
    // removing the clicked on element.
    this.parentNode.removeChild(this);
  }

  // create the $messages array access object.
  $messages = $scope.repeat("messages");

  // create a new DOM element with the information below.
  $messages.push({ username: "Brock", message: "Hello World!" });
});
```

##Quick Property Setting
For a fast way to set properties for any element with a `b-name` attribute, use the `$scope.edit` function to set the following values:

1. html: Set the innerHTML of the element.
2. text: set the innerText of the element.

You can do this with a simple key-value object where the keys are the `b-name` and the values are the value to place within. So below in the HTML, you'd create markup with `b-name` attributes that can be accessed and referenced in the `$scope`.

```html
<div class="bio">
  <div b-name="name"></div>
  <div b-name="major"></div>
</div>
```

And in the JavaScript run the `$scope.edit.text` function to set the innerText property of them.

```javascript
$scope.edit.text({
  name: "Brock Whittaker",
  major: "Finance",
});
```

If you have multiple elements of the same `b-name`, you can opt to provide a callback mechanism to set the values as you want. Below for instance reads a data-attr `data-ticker` from each element, queries an object with info, and then returns the current price of the stock. in either `green` or `red` dependent on whether it is up or down for the day.

```javascript
var stockInfo = {
  AAPL: { price: 97.36, change: 0.38 },
  AMZN: { price: 750.84, change: -0.41 },
  MO: { price: 69.36, change: -0.77 }
};

$scope.edit.html({
  name: function (node, index) {
    let data = stockInfo[node.dataset.ticker],
        color = obj.change > 0 ? "green" : "red";

    return `<span class="${color}">${obj.price}</span>`;
  }
});
```

##Storing Class-Level Data
If you want to store data that is associated with a particular `b-name` class, you can use the `$scope.data` assignment which sets a key value pair like below:

```javascript
$scope.data.prop(b-name, "temperature", "78.6F");
```

The data is then bound to `b-name` in the current `$scope` view only. It will appear inside the `$scope` in `$scope[b-name].data["temperature"]`.

##Storing View-Level Data
If you want to store data associated with a view, you can use the `$data` object.

For example, if you make a data request to another site which returns a list of results, you probably don't want to to fetch that resource every time you land on the view again. If that's the case, use the $data object to check if data exists and retrieve its value.

In the example below, we are going to use jQuery to retrieve data from an endpoint and store it in `$data` if it doesn't already exist.

```javascript
route.controller(function ($scope, $data, view) {
  // checks if $data.stockInfo already exists, and if not sends a request.
  if (!$data.stockInfo) {
    $.get("../path/to/site.html", function (response) {
      $data.stockInfo = response;
    });
  }
});
```

Now if you were to go to another view, say "search", and then back to the "home" view, the $data.stockInfo will still be there, so there will be no need to send off a `GET` request again.

##Transferring View-Level Data
If you want to transfer data from one view from another, you can use the `$scope.data.transfer` (also just `$data.transfer`) function to move a property.

In the example below, we create the `temperature` data property in the `home` view and transfer it to the `list` view.

```javascript
route.controller(function ($scope, $data, view) {
  $data.temperature = "78F";

  $data.transfer("temperature", "list");
});
```

So now if we go to the list view and run inside the controller, `$data.temperature` will exist and be set to "78F".
