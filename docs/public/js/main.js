var route = new RouteConfig("#view");

route
  .add("docs", "public/views/docs.html", "public/js/controllers/docs.js")
  .template.path("public/views/template.html");

route.deploy("docs");
