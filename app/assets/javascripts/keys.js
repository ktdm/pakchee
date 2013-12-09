$(document).ready(function () {

 if ($("#site_do_init_existing").is(":checked")) $("#save_key").attr("data-remote", "true");
 if ($("#site_do_init_new").is(":checked")) $("#key_role_mod").prop("checked", true);
 $("#site_do_init_new").change(function () {
  if ($("#site_do_init_new").is(":checked")) {
   $("#key_role_mod").prop("checked", true);
   $("#save_key").removeAttr("data-remote");
   $("#save_key").removeData("remote")
  }
 });
 $("#site_do_init_existing").change(function () {
  if ($("#site_do_init_existing").is(":checked")) $("#save_key").attr("data-remote", "true")
 })

 $("#save_key").on("ajax:success", function (e, data, status, xhr) {
  xr = JSON.parse(xhr.responseText);
  if (xr instanceof Array) {
   for (var a = 0; xr[a]; a++) {
    $("<div/>", {id: "site_" + xr[a].id}).appendTo("#attach_site");
    $("<span/>", {text: xr[a].id}).appendTo("#site_" + xr[a].id);
    $("<input/>", {type: "radio", value: xr[a].id, name: "key[site_id]"}).appendTo("#site_" + xr[a].id)
   }
   $("#save_key").removeAttr("data-remote");
   $("#save_key").removeData("remote")
  } else {
   $("#attach_site").text(xr.error)
  }
 }).bind("ajax:error", function (e, xhr, status, error) {
  $("<h2/>", {"class": "error", text: error.message}).appendTo("#attach_site")
 });

})
