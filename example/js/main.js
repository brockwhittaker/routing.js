var route = new RouteConfig("#view");

route.add("home", "pages/home.html", "js/controllers/home.js");
route.add("people", "pages/people.html", "js/controllers/people.js");

var hash = route.hash.get();

if (hash) {
  route.deploy(hash.view);
} else {
  route.deploy("home");
}
