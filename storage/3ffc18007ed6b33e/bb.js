function $ (id) { return document.getElementById(id) }

function $$ (cl) { return document.getElementsByClassName(cl) }

function addEvent (el, event, fn) {
 el.addEventListener ?
  el.addEventListener(event, fn, false) :
  el.attachEvent("on" + event, function () { return fn.call(el, window.event) })
}

function readTextFile (file, callback) {
 var rawFile = new XMLHttpRequest();
 rawFile.open("GET", file, true);
 rawFile.onreadystatechange = function () {
  if (rawFile.readyState == 4 && rawFile.status == 200 || rawFile.status == 0) callback(rawFile.responseText)
 }
 rawFile.send(null);
}

function init () {
 addEvent($("post_msg"), "click", function (e) { e.stopPropagation() });
 $("post_msg").reset();
 readTextFile("names.json", function (t) {
  people = JSON.parse(t);
  readTextFile("posts.json", get_posts)
 })
 addEvent($("new_thread"), "click", function () {
  this.appendChild($("post_msg"));
  $("post_msg").replies_to.removeAttribute("value")
 })
}

var
 people = [],
 posts,
 threads = [],
 reply_to = [];

function get_posts (x) {
 var posts = JSON.parse(x), i, j, k, a, b, c, trail = [], d, t, tc, p;
 for (i = 0; posts[i]; i++) {
  if (posts[i].replies_to) {
   for (j = 0; !threads[j].splice( parseInt(posts[i].id), parseInt(posts[i].replies_to) ); j++) {}
  } else {
   threads.push( new Thread(parseInt(posts[i].id)) )
  };
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
  addEvent(c, "click", function (evt) {
   $("post_msg").style.display = $("post_msg").previousSibling == this && $("post_msg").style.display != "none" ? "none" : null;
   if ($("post_msg").parentNode == this.parentNode) {
    evt.stopPropagation();
    window.reply_to.unshift(this);
    reply_click()
   }
  });
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
  $("all_posts").insertBefore(e, $("new_thread"));
  addEvent(e, "click", function () {
   window.reply_to.unshift(this.lastChild);
   reply_click()
  })
  trail.push(posts[i].id);
 }
 $("post_msg").idField.value = Math.max.apply(null, trail) + 1;
 for (i = 0; threads[i]; i++) {
  for (j = 0; ( tc = threads[i].headContexts() )[j]; j++) {
   a = document.createElement("div");
   a.className = "context";
   t = $( "post_" + tc[j].pop() ).parentNode;
   a.id = "context_" + t.id.split("_")[1];
   $("all_posts").insertBefore(a, t);
   do {
    b = document.createElement("div");
    c = b.cloneNode(false);
    d = b.cloneNode(false);
    p = tc[j].pop()
    for (k = posts.length - 1; posts[k].id != p; k--);
    b.innerHTML = people[posts[k].author - 1];
    b.className = "author";
    c.innerHTML = posts[k].body;
    c.className = "itemBody";
    d.appendChild(b);
    d.appendChild(c);
    a.insertBefore(d, a.firstChild)
   } while (tc[j].length);
   a.className += a.childNodes.length % 2 == 0 ? " oddBanded" : " evenBanded";
   addEvent(a, "click", function () {
    if ((x = this.className.replace(" show", "")) == this.className) { this.className += " show" } else { this.className = x }
   })
  }
 }
}

function reply_click () {
 var it = window.reply_to[0].lastChild;
 it.style.transition = null;
 it.style.backgroundColor = "gold";
 it.offsetHeight;
 it.style.transition = "background-color 1s ease-in-out 1s";
 it.style.backgroundColor = null;
 $("post_msg").replies_to.value = window.reply_to[0].id.split("_")[1];
 setTimeout(function () {
  var index = window.reply_to.length;
  window.reply_to[index-1].lastChild.style.transition = null;
  window.reply_to.pop()
 }, 2000);
 setTimeout(function () {
  window.reply_to[0].parentNode.insertBefore($("post_msg"), window.reply_to[0].nextSibling)
 },20)
}

function Thread () {
 this.length = 0;
 this.push = [].push;
 this.heads = [];
 this.splice = function (newIndex, afterIndex) {
  if (typeof afterIndex !== "number") return this.push(newIndex);
  for (var a = this.length - 1, b; a >= 0; a--) {
   if (this[a] instanceof Thread) {
    if ( this[a].splice(newIndex, afterIndex) ) {
     if (b = this[a].heads.pop()) this.heads.push(b);
     return true
    }
   } else if (this[a] == afterIndex) {
    if (a == this.length - 1) {
     this.push(newIndex)
    } else {
     this.heads.push(newIndex);
     this[a] = new Thread(this[a], newIndex)
    }
    return true
   }
  }
  return false
 }
 for (var i = 0; i < arguments.length; i++) this.push(arguments[i]);
 this.headContexts = function () {
  for (var i = 0, hc = []; this.heads[i]; i++) hc.push( this.context(this.heads[i]) );
  return hc
 }

 this.context = function (index) {
  for (var a = 0, b = [], c; a < this.length; a++) {
   if (this[a] instanceof Thread) {
    if ((c = this[a].context(index)) instanceof Array) { return b.concat(c) } else { b.push(c) }
   } else if (this[a] == index) {
    return b.concat([this[a]])
   } else {
    b.push(this[a])
   }
  }
  return b[0]
 }

 this.toString = function () {
  for (var a = 0, b = ""; a < this.length; a++) b += ", " + this[a];
  return "[" + b.substring(2) + "]"
 }
}
