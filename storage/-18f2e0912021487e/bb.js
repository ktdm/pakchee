function $ (id) { return document.getElementById(id) }

function $$ (cl, rn) { return ( a = (rn || document).getElementsByClassName(cl) ).length == 1 ? a[0] : a }

function addEvent (el, event, fn) {
    el.addEventListener ?
        el.addEventListener(event, fn, false) :
        el.attachEvent("on" + event, function () { return fn.call(el, window.event) })
}

function ajax (url, params, method, callback, headers) {
    var req, enc, m = method.toUpperCase(), a, b = "?";
    if (XMLHttpRequest) req = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
        for (var i = 0; i < versions.length; i++) {
            try {
                req = new ActiveXObject(versions[i]);
                break
            } catch (e) {}
        }
    }
    for (a in params) b += a + "=" + encodeURIComponent(params[a]) + "&";
    if (m == "POST") enc = b.replace(/%20/g, '+').slice(1, -1)
    else if (m == "GET") url += b.slice(0, -1);
    req.onreadystatechange = function () {
        if (req.readyState < 4 || req.status != 200) return;
        if (req.readyState == 4 || req.status == 0) callback(req)
    }
    req.open(method, url, true);
    if (m == "POST") req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (headers) for (c in headers) req.setRequestHeader(c, headers[c]);
    req.send(m == "GET" ? '' : enc);
}

function init () {
    addEvent($("post_msg"), "click", function (e) { e.stopPropagation() });
    addEvent($("post_msg"), "submit", function (e) {
        e.preventDefault();
        $("post_msg").style.display = "none";
        for (var params = {}, a = 0; this.elements[a]; a++) params[this.elements[a].name] = this.elements[a].value;
        params["post[timestamp]"] = new Date().getTime();
        ajax(this.action, params, this.method, function (r) { ajaxNotice.call($("post_msg"), r) })
    });
    $("post_msg").reset();
    addEvent($("rename_self"), "submit", function (e) {
        e.preventDefault();
        //minimise
        for (var params = {}, a = 0; this.elements[a]; a++) params[this.elements[a].name] = this.elements[a].value;
        ajax(this.action, params, this.method, function (r) { ajaxNotice.call($("rename_self"), r) })
    });
    function ajaxNotice (r) {
        var a = document.createElement("div");
        a.innerHTML = JSON.parse(r.responseText).notice;
        a.className = "notice";
        this.parentNode.insertBefore(a, this).offsetHeight;
        this.reset();
        a.style.backgroundColor = "#ddd";
        setTimeout(function () { location.reload(false) }, 2000);
        window.scroll(0, document.body.scrollHeight)
    }
    ajax("names.json", null, "GET", function (t) {
        people = JSON.parse(t.responseText);
        ajax("posts.json", null, "GET", get_posts)
        ajax("/post", {name: "", authenticity_token: $("post_msg").authenticity_token.value}, "POST", function (r) {
            $("author").innerHTML = people[JSON.parse(r.responseText).notice]
        });
    });
    addEvent($("new_thread"), "click", function () { 
        this.insertBefore($("post_msg"), $("rename_self")).replies_to.removeAttribute("value");
        $("post_msg").style.display = null
    })
    addEvent($("rename_toggle"), "click", function () {
        var a;
        if (this.value == "Change name") {
            (a = $$("itemBody", $("rename_self"))).className = a.className.replace(" hide", "");
            $("rename_submit").removeAttribute("class");
            this.value = "Minimise"
        } else if (this.value == "Minimise") {
            $$("itemBody", $("rename_self")).className += " hide";
            $("rename_submit").className = "hide";
            this.value = "Change name"
        }
    })
}


var people = {},
    posts,
    threads = [],
    reply_to = [];

function get_posts (x) {
    var i, j, k, a, b, posts = JSON.parse(x.responseText), trail = [];
    for (i = 0; posts[i]; i++) {
        if (posts[i].replies_to) {
            for (j = 0; !threads[j].splice( parseInt(posts[i].id), parseInt(posts[i].replies_to) ); j++);
        } else {
            threads.push( new Thread(parseInt(posts[i].id)) )
        };
        a = $$("post stamp").cloneNode(true);
        a.className = a.className.replace(" stamp", "");
        a.id = "post_" + posts[i].id;
        $$("author", a).innerHTML = people[posts[i].author];
        $$("itemBody", a).insertAdjacentHTML("afterbegin", posts[i].body);
        $$("timestamp", a).innerHTML = new Date( parseInt(posts[i].timestamp) ).toLocaleString();
        addEvent(a, "click", function (evt) {
            $("post_msg").style.display = $("post_msg").previousSibling == this && $("post_msg").style.display != "none" ? "none" : null;
            if ($("post_msg").parentNode == this.parentNode) {
                evt.stopPropagation();
                window.reply_to.unshift(this);
                reply_click()
            }
        });
        if (posts[i].replies_to) {
            for (j = trail.length - 1; trail[j] != posts[i].replies_to && j >= 0; j--);
            if (!$( "post_" + trail[j] ).nextSibling && j >= 0) {
                $( "post_" + trail[j] ).parentNode.appendChild(a);
                trail.push(posts[i].id);
                continue
            }
        }
        b = document.createElement("div");
        b.id = "thread_" + $("all_posts").childNodes.length;
        b.className = "thread";
        b.appendChild(a);
        $("all_posts").insertBefore(b, $("new_thread"));
        addEvent(b, "click", function () {
            window.reply_to.unshift(this.lastChild);
            reply_click()
        })
        trail.push(posts[i].id);
    }
    $("post_msg").idField.value = Math.max.apply(null, trail) + 1;

    var thread, contexts, post;
    for (i = 0; threads[i]; i++) {
        for (j = 0, contexts = threads[i].headContexts(); contexts[j]; j++) {
            a = document.createElement("div");
            a.className = "context";
            thread = $( "post_" + contexts[j].pop() ).parentNode;
        a.id = "context_" + thread.id.split("_")[1];
            $("all_posts").insertBefore(a, thread);
            do {
                b = $$("post stamp").cloneNode(true);
                b.removeAttribute("id");
                b.removeAttribute("class");
                post = contexts[j].pop();
                for (k = posts.length - 1; posts[k].id != post; k--);
                $$("author", b).innerHTML = people[posts[k].author];
                $$("itemBody", b).innerHTML = posts[k].body;
                a.insertBefore(b, a.firstChild)
            } while (contexts[j].length);
            a.className += a.childNodes.length % 2 ? " oddBanded" : " evenBanded";
            addEvent(a, "click", function () {
                if ((x = this.className.replace(" show", "")) == this.className) { this.className += " show" } else { this.className = x }
            })
        }
    }
}

function reply_click () {
    for (var it, post = window.reply_to[0]; (it = post.lastChild).nodeType == 3;) post.removeChild(post.lastChild);
    it.style.transition = null;
    it.style.backgroundColor = "gold";
    it.offsetHeight;
    it.style.transition = "background-color 1s ease-in-out .7s";
    it.style.backgroundColor = null;
    $("post_msg").replies_to.value = post.id.split("_")[1];
    setTimeout(function () {
        var index = window.reply_to.length;
        window.reply_to[index-1].lastChild.style.transition = null;
        window.reply_to.pop()
    }, 2000);
    setTimeout(function () {
        post.parentNode.insertBefore($("post_msg"), post.nextSibling)
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