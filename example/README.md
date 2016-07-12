#routing.js Example

##"home" view

In the example in `index.html`, there is a controller with two views &mdash; the **home** and **people** view. Both controllers are located in `js/controllers` and the views are located in `pages`.

The **home** view is a look into simple use of the `b-repeat` feature with the `$repeat.push` and `$repeat.remove` functions. There are two functions: `$scope.submit` and `$scope.deleteMe`. The `submit` function waits for a submit click and reads the value of the input before pushing to the `b-repeat`. The `deleteMe` function checks for a click on an individual message and then deletes it from the `b-repeat` array and DOM.

![Simple Messenger Example](assets/messages-demo.gif)

##"people" view

In the **people** view, a JSON array of randomly generated people is used as a source for a `b-repeat`, where their first and last name, email, gender, and IP address are all printed dynamically.
