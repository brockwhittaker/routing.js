var route = new RouteConfig("#view");

route
  .add("docs", "public/views/docs.html", "public/js/controllers/docs.js")
  .template.path("public/views/template.html");

route.deploy("docs");

$(function () {
  $("#view").click(function (e) {
    console.log(e.target, $(e.target).closest("#sidebar, #hamburger"));

    if (!$(e.target).closest("#sidebar, #hamburger").length)
      $("#sidebar").removeClass("show");
  });

  $("#hamburger").click(function () {
    $("#sidebar").toggleClass("show");
  });
});
