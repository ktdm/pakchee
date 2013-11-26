$(document).ready(function () {

 $("input[id^=delete]").click(function () {$(this).closest("#ops > *").remove()})

 $("#add_op").click(function () {
  $("<div><div><input name=\"op[][name]\" type=\"text\" /><input type=\"button\" value=\"-\"/></div><div><textarea name=\"op[][erb]\"></textarea></div></div>").appendTo("#ops");
  $("#ops > :last-child input[type=button]")
   .attr("id", "delete_op_" + ( $("#ops > *").size() - 2 ))
   .click(function () {$(this).closest("#ops > *").remove()})
 })

})
