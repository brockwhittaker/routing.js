var route = new RouteConfig("#view");

route
  .add("home", "pages/home.html", "js/controllers/home.js")
  .add("people", "pages/people.html", "js/controllers/people.js")
  .add("todo", "pages/todo.html", "js/controllers/todo.js");

var hash = route.hash.get();

if (hash) {
  route.deploy(hash.view);
} else {
  route.deploy("home");
}
