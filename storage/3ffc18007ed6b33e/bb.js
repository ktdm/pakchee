function $ (id) { return document.getElementById(id) }

function addEvent (el, event, fn) {
 el.addEventListener ?
  el.addEventListener(event, fn, false) :
  el.attachEvent("on" + event, function () { return fn.call(el, window.event) })
}

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
 var posts = JSON.parse(x), i, a, b, c, trail = [], d;
 for (i = 0; posts[i]; i++) {
  a = document.createElement("div");
  b = a.cloneNode(false);
  c = a.cloneNode(false);
  a.innerHTML = people[posts[i].author - 1];
  a.className = "author";
  b.innerHTML = posts[i].body;
  b.className = "itemBody";
  c.id = "post_" + posts[i].id;
  c.className = "post";
  c.appendChild(a);
  c.appendChild(b);
  if (posts[i].replies_to) {
   for (d = trail.length - 1; trail[d] != posts[i].replies_to && d >= 0; d--);
   if (!$( "post_" + trail[d] ).nextSibling && d >= 0) {
    $( "post_" + trail[d] ).parentNode.appendChild(c);
    trail.push(posts[i].id);
    continue
   }
  }
  e = document.createElement("div");
  e.id = "thread_" + $("all_posts").childNodes.length;
  e.className = "thread";
  e.appendChild(c);
  $("all_posts").appendChild(e);
  addEvent(e, "click", function () {
   window.reply_to.unshift(this.lastChild.lastChild);
   window.reply_to[0].style.backgroundColor = "gold";
   window.reply_to[0].offsetHeight;
   document.forms[0].reply_to.value = this.lastChild.id.split("_")[1]
   setTimeout(function () {
    window.reply_to[0].style.transition = "background-color 1s ease-in-out 1s";
    window.reply_to[0].style.backgroundColor = null
   }, 0);
   setTimeout(function () {
    var index = window.reply_to.length;
    window.reply_to[index-1].style.transition = null;
    window.reply_to.pop()
   }, 2000)
  })
  trail.push(posts[i].id)
 }
}

var people = ["Aidan", "Cameron", "Nico", "Mel"],
    reply_to = []
