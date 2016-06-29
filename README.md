#routing.js
This library is essentially a scaled-down version of angular. It allows you to have views appear inside a single container, transition between views, store data associated with a view, and add event listeners from the HTML.

#Basic Usage

```javascript
// create a new routing system.
var route = new RouteConfig("#view");
```

#Creating a Route
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
    $scope.output.self.innerText = this.value;
  };
})
```

All nodes are placed inside the `$scope` object in the format `$scope[{{b-name}}]`. Inside there is a component for each event listener such as `click`, `mousemove`, or `input`. There is also a `self` component that refers to the node itself.

##Storing Data
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
