var section = {}

section.overview = [
  {
    tag: "h1",
    html: "Overview"
  },
  {
    tag: "p",
    html: "The <span class='routing-js'></span> framework is one that is designed to be simple &mdash; a framework you can learn front to back in a single day. In the creation of this MVC-style framework I've taken the great parts of Angular and other frameworks and distilled them to simple concepts."
  },
  {
    tag: "p",
    html: "If you are looking for a framework that takes care of every step, this isn't it. A good portion of your project will still be decoupled from this framework however <span class='routing-js'></span> does aim to accomplish a total reduction of event listeners and element creation by way of node building in JavaScript."
  },
  {
    tag: "p",
    html: "There are a few major goals that this framework seeks to accomplish:",
  },
  {
    tag: "ol",
    data: [
      { value: "Framework that can be learned and used to its full extent within a day." },
      { value: "Simple mechanism for repeating HTML dynamically." },
      { value: "Reversed event-listener system that efficiently binds and queues callbacks." },
      { value: "View-based data storage." }
    ]
  },
  {
    tag: "p",
    html: "Let's continue below to &ldquo;Getting Started&rdquo; to find out more."
  }
];

section.getting_started = [
  {
    tag: "h1",
    html: "Getting Started"
  },
  {
    tag: "p",
    html: "The <span class='routing-js'></span> framework works by creating a view element in the <span class='code'>&lt;body&gt;</span> of your code, and then filling it dynamically with content based off of routes that you specify."
  },
  {
    tag: "h3",
    html: "A New RouteConfig Instance"
  },
  {
    tag: "JSCode",
    html:
`var route = new RouteConfig("#view");`
  },
  {
    tag: "p",
    html: "The first thing you need to do is create a new instance of the <span class='code'>RouteConfig</span> class."
  },
  {
    tag: "argumentTable",
    data: [
      { name: "selector", type: "String", description: "The selector of the node to be tied to the view." }
    ]
  }
];

section.routes_section = [
  {
    tag: "h1",
    html: "Routes"
  },
  {
    tag: "p",
    html: "Think of routes like webpages. The only difference is that instead of loading a new page, the hash is changed."
  },
  {
    tag: "h3",
    html: "route.add"
  },
  {
    tag: "JSCode",
    html:
`// attach a 'RouteConfig' to '#view'.
route.add("home", "path/to/home.html", "path/to/home.js");`
  },
  {
    tag: "p",
    html: "You can add a route with the <span class='code'>route.add</span> functionality &mdash; specify a route name, path to html, and path to js to complete a route!"
  },
  {
    tag: "argumentTable",
    data: [
      { name: "route_name", type: "String", description: "The name of the route. This will appear in the hash of the browser's address bar when the view loads." },
      { name: "html", type: "String", description: "A link to the HTML template you want to import." },
      { name: "js", type: "String", description: "A link to the JavaScript template." },
    ]
  },
  {
    tag: "JSCode",
    html:
`// customize route settings.
// disable caching.
route.config({ cache: false });`
  },
  {
    tag: "combinedArgumentTable",
    header: "route.config",
    p: "The <span class='code'>config</span> option allows you to set preferences for the routing system. Currently this only supports <span class='code'>cache</span> which is a <span class='code'>Boolean</span> that defaults to <span class='code'>true</span>.",
    data: [
      { name: "config", type: "Object", description: "An object of configuration properties for the route." },
    ]
  },
  {
    tag: "JSCode",
    html:
`// add an HTML full of templates.
route.template.add("path/to/template.html");`
  },
  {
    tag: "combinedArgumentTable",
    header: "route.template",
    p: "The <span class='code'>template</span> option allows you to add a sheet full of dynamic templates to use at a later time. Go to the section on Templating to find out more about how to construct a template.",
    data: [
      { name: "path", type: "String", description: "The path of where the template can be found." },
    ]
  },
  {
    tag: "JSCode",
    html:
`// deploy the route 'home'.
route.deploy("home");`
  },
  {
    tag: "combinedArgumentTable",
    header: "route.deploy",
    p: "The <span class='code'>deploy</span> feature sends a user to the route and renders the view of the `name` parameter.",
    data: [
      { name: "name", type: "String", description: "The name of the route to deploy to the view." },
    ]
  },
  {
    tag: "p",
    html: "If the route does not exist, it will <span class='code'>console.warn</span> and remain at the same route. In other cases, the controller runs a transition that can be defined by the user and then navigates to the new view."
  },
  {
    tag: "h3",
    html: "route.controller"
  },
  {
    tag: "JSCode",
    html:
`// this is in 'path/to/js.js'.
route.controller(function ($scope, $data, view) {
  // code in here.
});`
  },
  {
    tag: "p",
    html: "The <span class='code'>controller</span> feature allows for a view-specific controller. In here, you have access to the <span class='code'>$scope</span> of the view which will be populated with event listeners, b-repeats, and other custom objects. The <span class='code'>$data</span> argument is where you are free to store any data you find necessary to be attached to the particular view. This data can be saved and stored between browser sessions. Lastly, the <span class='code'>view</span> argument is an object of essential information such as the container the view is held in and the previous view."
  },
  {
    tag: "p",
    html: "The callback is where you'll be deploying most of your code. All the features of this library such as <span class='code'>$scope.repeat</span>, JS Templating, and event listener adding can only be deployed to a specific view <span class='code'>$scope</span> inside of the callback."
  },
  {
    tag: "argumentTable",
    data: [
      { name: "$scope", type: "Object", description: "A general view scope that also contains the <span class='code'>$data</span> object as <span class='code'>$scope.data</span>" },
      { name: "$data", type: "Object", description: "A general storage container." },
      { name: "view", type: "Object", description: "Meta view information." },
    ]
  }
];

section.controller = [
  {
    tag: "h1",
    html: "Controllers"
  },
  {
    tag: "HTMLCode",
    html:
`&lt;div b-repeat="people" b-click="deleteMe"&gt;
  &lt;div b-prop="name" class="name"&gt;&lt;div&gt;
  &lt;div b-prop="age" class="age"&gt;&lt;div&gt;
&lt;/div&gt;`
  },
  {
    tag: "p",
    html: "The controller is a <span class='code'>route</span> function that deploys inside of the specified JavaScript path for a particular route/view. Inside of this controller are three variables that give you access to all the features that <span class='routing-js'></span> has to offer. Aside from that, the callback also functions as a general <span class='code'>viewHasLoaded</span> callback that ensures any manipulation you do will affect the current view."
  },
  {
    tag: "ol",
    data: [
      { value: "<span class='code'>$scope</span> &mdash; The parent object of the scope that has direct access to repeater functions, event listeners, input and property manipulation and collection, unloading, and a lot more. Many of the functions in the <span class='code'>$scope</span> have builder properties like the <span class='code'>$scope.repeat</span> example on the right which is set to variable <span class='code'>$people</span>." },
      { value: "<span class='code'>$data</span> &mdash; This is only a shorthand reference to <span class='code'>$scope.data</span>. It is a storage for all data that should be tied to a view. Included are a few key features for saving data between browser loads. Working in tandem with localStorage you can use the <span class='code'>apply</span> and <span class='code'>save</span> to save state." },
      { value: "<span class='code'>view</span> &mdash; The view is an object of metadata associated with the view/route itself. The three properties currently are <span class='code'>container</span>, <span class='code'>loaded</span>, and <span class='code'>loads</span>. The container is a reference to the main container node that the view is presented in. The loaded and loads are similar, however loaded is a <span class='code'>Boolean</span> value stating whether the view has been loaded before, and <span class='code'>views</span> tracks the total number of views to this point."}
    ]
  },
  {
    tag: "JSCode",
    html:
`var people = [
  { name: "Brock Whittaker", age: 19 },
  { name: "Andrew Peterson", age: 20 },
  { name: "John Doe", age: 38 }
];

route.controller(function ($scope, $data, view) {
  // retrieve any old data from localStorage
  // and apply it to the current view.
  $data.apply();

  // create a new repeater for the 'b-repeat' named 'people'.
  var $people = $scope.repeat("people");

  // push all the people in the array to create HTML
  // elements for each and push stored people if exists,
  // otherwise use the people array above for reference.
  $people.push($data.people ? $data.people : people);

  // an 'b-click' event in the HTML called 'deleteMe' would
  // trigger this function to delete a person from the HTML
  // and data list.
  $scope.deleteMe = function () {
    $people.remove(this);
    $data.people = $people.get();
  };

  // when leaving the view, save the data stored in '$data'
  // to localStorage.
  $scope.unload = function () {
    $data.save();
  }
});`
  },
  {
    tag: "h3",
    html: "A &ldquo;Hello World&rdquo; Code Run-Through"
  },
  {
    tag: "p",
    html: "The code on the right may appear a bit complex at first, but let's briefly break it down. First, we are initializing a list of people &mdash; each with a name and an age. This is outside of the <span class='code'>route.controller</span> callback because it is independent of the view having loaded already."
  },
  {
    tag: "p",
    html: "Next, we call the <span class='code'>route.controller</span> and provide a callback of things to happen once the view has loaded. The first thing you see in that callback is <span class='code'>$data.apply</span>. What this does is retrieves any old state data that was stored in localStorage and applies it to the view again. This way we can save data, refresh the page, and the data can persist."
  },
  {
    tag: "p",
    html: "We create a new variable <span class='code'>$people</span>, which is the result of initializing <span class='code'>$scope.repeat</span> on an element that has the HTML attribute <span class='code'>b-repeat='people'</span>. This creates a dynamic array that can be pushed to, popped, filtered, and spliced. This array is directly linked to the DOM and will do all of those actions to the elements present on the screen."
  },
  {
    tag: "p",
    html: "In the next line of code, we push either the retrieved <span class='code'>$data.people</span> from localStorage, or the initial <span class='code'>people</span> if no data has been stored."
  },
  {
    tag: "p",
    html: "Below that is our first event listener. Up in the HTML in the top level div we have an attribute <span class='code'>b-click='deleteMe'</span>. That event listener directly ties to the <span class='code'>$scope.deleteMe</span> reference, so we'll create a function for it to execute. Inside the scope of the function, the <span class='code'>this</span> argument refers to the node that was clicked. We can then use the <span class='code'>remove</span> property of <span class='code'>$scope.repeat()</span> to remove it. When we do this two things happen:"
  },
  {
    tag: "ol",
    data: [
      { value: "The node is removed from the DOM." },
      { value: "The data is removed from the repeater array." }
    ]
  },
  {
    tag: "p",
    html: "That means that if we click on a person to delete them and then run <span class='code'>$people.get()</span>, it will return an array of data with only two people. Let's set the result into <span class='code'>$data</span> so we can maintain this state if we refresh the page."
  },
  {
    tag: "p",
    html: "Last, we have a <span class='code'>$scope.unload</span> function. This runs right before the view is transitioned to another view. In here, we run <span class='code'>$data.save</span> to save the new <span class='code'>people</span> list, so that when we refresh the browser next time we will see the list we already filtered to two people instead of the original with all three people."
  }
];

section.$scope = [
  {
    tag: "h1",
    html: "$scope"
  },
  {
    tag: "p",
    html: "The scope is the all-encompassing object for adding events, repeats, and objects to a particular view. Let's take a look below at the different builders and functions available within <span class='code'>$scope</span>."
  },
  {
    tag: "HTMLCode",
    html:
`&lt;div b-click="deleteMe"&gt;Delete Me&lt;div&gt;`
  },
  {
    tag: "h3",
    html: "Direct Event Assignment"
  },
  {
    tag: "p",
    html: "For a less verbose way to add single event listeners that are non-removable (but replaceable/nullable), try the direct-assignment method. In the HTML you will specify a <span class='code'>b-{event}</span> attribute and set it equal to a function name which you will then call in the <span class='code'>$scope</span>. This will apply to all elements that have that particular b-click &mdash; not just elements of a <span class='code'>b-name</span>."
  },
  {
    tag: "JSCode",
    html:
`// delete the node that was clicked from the DOM.
$scope.deleteMe = function () {
  this.parentNode.removeChild(this);
};`
  },
  {
    tag: "p",
    html: "These events can be added every time a view loads however because they are removed when nodes are unloaded or swapped from the DOM."
  },
  {
    tag: "p",
    html: "The function can be changed at any time, as it is only referenced by a generic callback function, so removing this event is as simple as deleting the function."
  },
  {
    tag: "warning",
    html: "Currently this method is only supported with <span class='code'>b-click</span>, <span class='code'>b-input</span>, and <span class='code'>b-mousemove</span>. More may be added later but for other events you will want to use the <span class='code'>$scope.event.add</span> function which supports all Event types including custom Events."
  },
  {
    tag: "JSCode",
    html:
`// add these events to all nodes present and future where
// 'b-name="person"'.
$scope.event.add("person", {
  click: {
    sayMyName: function () {
      console.log(this.innerText);
    }
  },
  dblclick: {
    deleteMe: function () {
      this.parentNode.removeChild(this);
    }
  },
  contextmenu: {
    preventMenu: function (e) {
      e.preventDefault();
    }
  }
});`
  },
  {
    tag: "combinedArgumentTable",
    header: "$scope.event.add",
    p: "The <span class='code'>$scope.event.add</span> feature allows for events to be added to existing and future nodes with a particular <span class='code'>b-name</span>. This works by adding generic event listeners when nodes are first created that point to queues of functions. This means that this same system allows for the deletion of event listeners by their names.",
    data: [
      { name: "b_name", type: "String", description: "The <span class='code'>b-name</span> of the nodes that you want to add an event listener to." },
      { name: "b_name", type: "Object[Object]", description: "A two-level deep object where the outer level has keys that match the event type that you want to add a listener to, and an inner layer with event listener functions that are matched with named keys." },
    ]
  },
  {
    tag: "p",
    html: "These events are then set into a queue and fired in rapid succession when a general <span class='code'>click</span>, <span class='code'>dblclick</span>, <span class='code'>contextmenu</span>, or other event are fired. They are all passed the same <span class='code'>e</span> value. This method is also more efficient than standard event listeners due to only one event being triggered instead of potentially dozens."
  },
  {
    tag: "p",
    html: "Using this system of adding events also ensures that multiples of the same event cannot be added. An event will be rejected if it has the same name and if of the same event type as an existing event in the queue."
  },
  {
    tag: "JSCode",
    html:
`// remove the 'sayMyName' event we just added.
$scope.event.remove("person", "click", "sayMyName");`
  },
  {
    tag: "combinedArgumentTable",
    header: "$scope.event.remove",
    p: "The <span class='code'>$scope.event.remove</span> feature will remove a particular event from a node given a <span class='code'>b-name</span>, <span class='code'>type</span> and <span class='code'>func_name</span>",
    data: [
      { name: "b_name", type: "string", description: "The <span class='code'>b-name</span> of the nodes." },
      { name: "type", type: "string", description: "The type of event you want to remove." },
      { name: "func_name", type: "string", description: "The specific name of the event you are removing." }
    ]
  },
  {
    tag: "JSCode",
    html:
`// collect values from 'b-names' in array.
// clear the input after.
var data = $scope.input.val(
  ["username", "password", "education"],
  $scope._.CLEAR_INPUT
);

console.log(data);
// { username: "brock", password: "hunter2", education:
//   ["Mountain Pointe High School", "Arizona State University"]
// }
`
  },
  {
    tag: "combinedArgumentTable",
    header: "$scope.input.val",
    p: "The <span class='code'>$scope.input.val</span> feature retrieves the values of all the <span class='code'>b-name</span> nodes specified in an array and returns an object of keys matching the <span class='code'>b-name</span> of the nodes the values were retrieved from. If only a single value is retrieved, it will be paired directly with a key, otherwise it will be pushed to an array that is paired with the key.",
    data: [
      { name: "b_names", type: "Array", description: "An Array of all <span class='code'>b-name</span> nodes to collect input from." },
      { name: "clear_input", type: "Boolean", description: "Clears the input of those elements after collecting. Defaults to <span class='code'>false</span>, and can be set as <span class='code'>true</span> either directly or with <span class='code'>$scope._.CLEAR_INPUT</span>." }
    ]
  },
  {
    tag: "h3",
    html: "$scope.repeat"
  },
  {
    tag: "JSCode",
    html:
`var forecast = [
  { high: 68, low: 58, condition: "Cloudy", city: "San Francisco" },
  { high: 72, low: 63, condition: "Partly Cloudy", city: "San Mateo" },
  { high: 76, low: 54, condition: "Sunny", city: "Berkeley" },
  { high: 91, low: 64, condition: "Sunny", city: "Sonoma" },
  { high: 64, low: 56, condition: "Foggy", city: "Bodega Bay" },
]

route.controller(function ($scope, $data, view) {
  var $forecast = $scope.repeat("forecast");

  // modify the high and low temperature to read 'temp&degF' in the HTML
  // while keeping the unchanged version in the data store.
  $forecast.modifyView({
    high: function (temp) {
      return temp + "&deg;F";
    },
    low: function (temp) {
      return this.high(temp);
    }
  });

  // push the entire forecast array.
  $forecast.push(forecast);

  // pop the last element off.
  $forecast.pop();

  // filter to only locations with great weather.
  $forecast.filter(function (obj) {
    return /Sunny|Partly Cloudy/.test(obj.condition);
  });

  // on '$scope.switchToCelsius' which is bound to some b-{action},
  // change the view modifier to Celsius.
  $scope.switchToCelsius = function () {
    $forecast.modifyView({
      high: function (temp) {
        return (temp - 32) / 1.8 + "&deg;C";
      },
      low: function (temp) {
        return this.high(temp);
      }
    });
  }
});
`
  },
  {
    tag: "p",
    html: "If you checked out the &ldquo;Hello World&rdquo; example above, you got a skin-deep sneak-peek at the <span class='code'>$scope.repeat</span> functionality. Let's explore its library a bit more in depth here. The <span class='code'>$scope.repeat</span> object directly binds data to elements in the DOM. What that means is that you can throw in an array of data and it will link up to a <span class='code'>b-repeat</span> inside the HTML and automatically update the DOM without any other actions."
  },
  {
    tag: "p",
    html: "There are several built-ins for adding and removing data to a repeater."
  },
  {
    tag: "ol",
    data: [
      { value: "<span class='code'>push</span> &mdash; Adds data and the element to the end of a sequence." },
      { value: "<span class='code'>unshift</span> &mdash; Adds data and the element to the beginning of a sequence." },
      { value: "<span class='code'>at</span> &mdash; Adds data and a particular index in the sequence." },
      { value: "<span class='code'>remove</span> &mdash; Removes data and a particular index in the sequence or when given a reference to a particular node." },
      { value: "<span class='code'>filter</span> &mdash; Filters the data array dependent on the characteristics of the data. Works very similarly to JavaScript&rsquo;s <span class='code'>Array.prototype.filter</span> built-in." },
      { value: "<span class='code'>modifyView</span> &mdash; A function accepting an object with callbacks to modify a certain property in added data to reflect how it should look in the view." },
      { value: "<span class='code'>modify</span> &mdash; A function that takes a particular node or <span class='code'>b-repeat</span> index and allows you to modify the core data within it." },
      { value: "<span class='code'>modifyEach</span> &mdash; A wrapper around <span class='code'>modify</span> that runs through all nodes in the <span class='code'>b-repeat</span> to allow modification." },
    ]
  },
  {
    tag: "h1",
    html: "$repeat"
  },
  {
    tag: "p",
    html: "The <span class='code'>$repeat</span> method is not a directly accessible element but rather the builder product of running <span class='code'>$scope.repeat(b_name)</span>. This is a class in itself that has many properties for manipulating the data store and HTML."
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.push, $repeat.unshift, $repeat.at",
    p: "These three data-adding functions work similarly and have the same arguments.",
    data: [
      { name: "obj", type: "object", description: "An object of data to push to the data store and fill into the HTML." }
    ]
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.remove",
    p: "A function for removing a single node.",
    data: [
      { name: "ref", type: "Number/Node", description: "Removes a node by reference to that particular node or by the index of it in the <span class='code'>b-repeat</span> sequnce." }
    ]
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.filter",
    p: "A second-order function for removing several nodes depending on the attributes of the nodes.",
    data: [
      { name: "callback", type: "Function", description: "Provides two parameters &mdash; the object and index in the <span class='code'>b-repeat</span>. Return <span class='code'>true</span> in the callback to keep the node and <span class='code'>false</span> to destroy it and associated data." }
    ]
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.modifyView",
    p: "Recieves an object of callbacks on how to modify various passed in properties before inserting into the DOM. For example if <span class='code'>obj.temperature</span> is an <span class='code'>Integer</span> but you would like to display it as a String in degrees Fahrenheit you would use <span class='code'>$repeat.modifyView</span> to provide a callback to format the string to <span class='code'>temp&deg;F</span>.",
    data: [
      { name: "modifier", type: "Object", description: "An object of callbacks in the same structure as the data given to the <span class='code'>b-repeat</span>. Properties that don't have a corresponding callback resort to raw-data form. All others result to the return of the callback." }
    ]
  },
  {
    tag: "JSCode",
    html:
`var pets = [
  { species: "Dog", name: "Axl", age: 7 },
  { species: "Dog", name: "Willow", age: 3 },
  { species: "Cat", name: "Kali", age: 5 }
]

// create a new repeater for the 'b-repeat="pets"'
var $pets = $scope.repeat("pets");

// modify the first pet 'Axl' to have an age of 8, and update in the HTML.
$pets.modify(0, {
  age: 8
});

console.log($pets.get()[0].age); // 8
`
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.modify",
    p: "Given a particular <span class='code'>b-repeat</span> node or index in a repeat sequence, pass in new data to modify the existing core data and update the HTML correspondingly. Data is additive in a way similar to <span class='code'>Object.assign</span> which means that any attributes that are omitted are left untouched.",
    data: [
      { name: "data", type: "Object", description: "An object of properties to overwrite existing data in a particular repeat sequence index or node." }
    ]
  },
  {
    tag: "combinedArgumentTable",
    header: "$repeat.modifyEach",
    p: "This is essentially <span class='code'>$repeat.modify</span> meets <span class='code'>Array.prototype.forEach</span>. No need to specify an index anymore, just pass in an object with the new attributes.",
    data: [
      { name: "data", type: "Object", description: "An object of properties to overwrite existing data in a particular repeat sequence index or node." }
    ]
  }
];

section.$data = [
  {
    tag: "h1",
    html: "$data"
  },
  {
    tag: "p",
    html: "The <span class='code'>$data</span> object is a general purpose storage system for a particular view. Aside from using it as a general privately scoped storage container, you can also use methods like <span class='code'>$scope.save</span> to allow data to persist through sessions and <span class='code'>$scope.apply</span> to retrieve data for a given view from localStorage."
  },
  {
    tag: "h3",
    html: "$data.save"
  },
  {
    tag: "JSCode",
    html:
`$data.animals = ["Dog", "Cat", "Rat", "Porcupine", "Dolphin"];

// save animal list for later session.
$data.save();`
  },
  {
    tag: "p",
    html: "The <span class='code'>$data.save</span> method takes all data present in this view&rsquo;s scope and stores it for later use in localStorage. Keep in mind that this data persists across all views of the same name on your site. Pick unique keys for storing data as you would in any other centralized system. This means you can also access data on different pages in the same domain."
  },
  {
    tag: "p",
    html: "This function has no arguments."
  },
  {
    tag: "h3",
    html: "$data.apply"
  },
  {
    tag: "JSCode",
    html:
`// fetch all stored data in localStorage for this view.
$data.apply();

console.log($data.animals);
// ["Dog", "Cat", "Rat", "Porcupine", "Dolphin"]`
  },
  {
    tag: "p",
    html: "The <span class='code'>$data.apply</span> method searches in localStorage for all data associated with the current scope and applies it to the <span class='code'>$data</span> object for current use. Keep in mind that different views named the same in other parts of the domain will store under the same storage compartment. Make sure your keys are unique."
  },
  {
    tag: "p",
    html: "This function has no arguments."
  },
  {
    tag: "h3",
    html: "$data.remove"
  },
  {
    tag: "JSCode",
    html:
`// keeps a current copy of $data.animals but removes
// from storage.
$data.remove();`
  },
  {
    tag: "p",
    html: "The <span class='code'>$data.remove</span> method keeps the <span class='code'>$data</span> instance of the variable while removing the copy in localStorage. This means that the data will still be available in this session but on browser reload it will not be available anymore."
  },
  {
    tag: "p",
    html: "This function has no arguments."
  },
  {
    tag: "h3",
    html: "$data.lastUpdated"
  },
  {
    tag: "JSCode",
    html:
`console.log($data.lastUpdated());
// 1470416953628`
  },
  {
    tag: "p",
    html: "The <span class='code'>$data.lastUpdate</span> method gives a timestamp of when the last attribute in <span class='code'>$data</span> was stored to localStorage. It is here to help you decide whether or not it is necessary to retrieve fresh information."
  },
  {
    tag: "p",
    html: "This function has no arguments."
  }
];

section.templating = [
  {
    tag: "h1",
    html: "Templating"
  }
];

var sections = [];
for (var x in section) {
  sections = sections.concat(section[x]);
}

// \*\*([^*]*)\*\*
