$(document).ready(function () {

 $("#about").click(function () {
  $(this).css({
   cursor: "default",
   maxWidth: "inherit",
   maxHeight: "inherit"
  });
  $("#abtTxt > p").css({ whiteSpace: "inherit"});
  $("#submit").css({display: "block"})
 });

 $("#reqTxt").keydown(function (e) {
  if ($("#msgStr").length || e.which == 8 && $("#req").text() == "\u200c") e.preventDefault() //prevents f5 for 2s :(
 });

 $("#minimise").click(function (e) {
  $("#about").css({
   cursor: "",
   maxWidth: "",
   maxHeight: ""
  });
  $("#abtTxt > p").css({whiteSpace: ""});
  $("#submit").css({display: ""});
  e.stopPropagation()
 });

 $("#req").data({val: ""});
 $("#reqTxt").on("keydown keyup", function (e) {
  if ($(this).text().length > 10) {
   if (!$("#msgStr").length) msg("Too long"); // queue?
   $(this).text($("#req").data("val"))
  } else {
   if ($("#req").data("paste")) {
    $(this).text($(this).text());
    $("#req").removeData("paste")
   }
   $("#req").data({val: $(this).text()})
  }
 });
 $("#reqTxt").on("paste", function () { $("#req").data({paste: true}) });

 $("#submit").click(function () {
  $("#request_text").val($("#reqTxt").text());
  $("#req").submit();
 });

 $("#req").on("ajax:success", function (e, data, status, xhr) {
  msg("Success!");
  $("#reqTxt").empty();
  $("#request_text").val("");
  setTimeout(function () { $("#minimise").click() }, 2000)
 }).bind("ajax:error", function (e, xhr, status, error) {
  msg("Error")
 });

 $("#key").focus();
 ( window.getSelection ? window.getSelection() : document.selection.createRange() ).modify("move", "forward", "line")

});

function msg(str) {
 $("<div/>", {id: "msgStr", text: str}).appendTo("#msg");
 $("#minimise").css({ display: "none" });
 setTimeout(function () { $("#msgStr").addClass("fadeout") }, 0);
 setTimeout(function () {
  document.getElementById("minimise").offsetHeight;
  $("#minimise").css({ display: "block" });
  $("#msgStr").remove()
 }, 2000);
}