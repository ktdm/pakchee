$(document).ready(function () {

 $("#toggle").data({ checked: false, toggle: "none" })
 $("#toggle").click(function () {
  $(this).data({ checked: !$(this).data("checked"), toggle: $(this).data("toggle") == "none" ? "all" : "none" });
  $("input:checkbox").prop("checked", $(this).data("checked"));
  $("#toggle").val($(this).data("toggle"))
 })

})
