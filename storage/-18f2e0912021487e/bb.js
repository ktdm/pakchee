function $ (id) { return document.getElementById(id) }

function init () {
 readTextFile("posts.json")
}

function readTextFile (file) {
 var rawFile = new XMLHttpRequest();
 rawFile.open("GET", file, true);
 rawFile.onreadystatechange = function () {
  if (rawFile.readyState == 4 && rawFile.status == 200 || rawFile.status == 0) get_posts(rawFile.responseText)
 }
 rawFile.send(null);
}

function get_posts (x) {
 var posts = JSON.parse(x), i, a;
 for (i = 0; posts[i]; i++) {
  a = document.createElement("div");
  a.innerHTML = posts[i].item;
  $("all_posts").appendChild(a)
 }
}
