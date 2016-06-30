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
route.add("home", "../path/to/home.html", "../path/to/js.html");
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
    $scope.output.self.innerText = this.value;
  });
});
```

The alternative syntax described above would look like:

```javascript
route.controller(function ($scope, $data, view) {
  // see, it's a bit shorter.
  $scope.nameInput = function () {
    $scope.output.self.innerText = "Hi, your name is" + this.value + ".";
  };
})
```

All nodes are placed inside the `$scope` object in the format `$scope[{{b-name}}]`. Inside there is a component for each event listener such as `click`, `mousemove`, or `input`. There is also a `self` component that refers to the node itself.

##Adding Event Listeners
Event listeners can be added in a ton of different ways, many with different features. Below is a list of those ways and the pros/cons associated with them.

1. Primitive Assignment.

Each object you create using the `b-name` attribute will have its own attribute in `$scope` in the structure `$scope[b-name]`. Inside that is the following structure:

```javascript
$scope[b-name] = {
  self: [[ Document Object ]],
  click: [[ Function ]],
  ...
};
```

Where self is a reference to the node itself and `click` among other possible attributes are events you've added. Any event listeners use those as callbacks to run functions, so therefore you can change the callback simply by writing:

```javascript
$scope[b-name].click = function () {
  // .. your code here.
};
```

And that changes the click event for `b-name`. This is not fully recommended however. The inherit issue with doing this is that if the `b-name` node selection doesn't exist yet, it will throw an error because `$scope[b-name]` doesn't exist yet. This also will mean that you can't apply the event to future instances of `b-name`. In order to use this syntax safely, use the `$scope.get(b-name)` syntax like below:

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

Or multiple events using the object syntax:

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

##Storing Object-Level Data
If you want to store data that is associated with a particular `b-name` object, you can use the `$scope.data` assignment which sets a key value pair like below:

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

##Transfering View-Level Data
If you want to transfer data from one view from another, you can use the `$scope.data.transfer` (also just `$data.transfer`) function to move a property.

In the example below, we create the `temperature` data property in the `home` view and transfer it to the `list` view.

```javascript
route.controller(function ($scope, $data, view) {
  $data.temperature = "78F";

  $data.transfer("temperature", "list");
});
```

So now if we go to the list view and run inside the controller, `$data.temperature` will exist and be set to "78F".