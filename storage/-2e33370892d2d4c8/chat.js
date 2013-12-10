function $ (id) { return document.getElementById(id) }

function $$ (cl, rn) { return ( a = (rn || document).getElementsByClassName(cl) ).length == 1 ? a[0] : a }

function addEvent (el, event, fn) {
 var a = event.split(" "), b = a.length;
 while (b--) el.addEventListener ?
  el.addEventListener(a[b], fn, false) :
  el.attachEvent("on" + a[b], function () { return fn.call(el, window.event) })
}

function delay (fn) { window.setTimeout(fn, 0) }

function ajax(url, params, method, callback, headers) {
    var req, enc, m = method.toUpperCase(), a, b = "?", i = 5;
    if (XMLHttpRequest) req = new XMLHttpRequest();
    else {
        while (i--) {
             try {
                req = new ActiveXObject(["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"][i]);
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

var participants = {1: "Aidan", 4: "Yumi"}, postHeight;
function init () {
    postHeight = {min: $("body").offsetHeight, last: $("body").offsetHeight};
    ajax("posts.json", null, "GET", function (r) {
        var x, i, s;
        x = JSON.parse(r.responseText);
        i = x.length;
        while (i--) {
            s = $("item_stamp").cloneNode(true)
            s.id = "item_" + (i+1);
            s.className = "post";
            $$("author", s).innerHTML = participants[x[i].author];
            $$("body", s).insertAdjacentHTML("afterbegin", x[i].body);
            $$("timestamp", s).innerHTML = new Date( parseInt(x[i].timestamp) ).toLocaleString()
            $("conversation").insertBefore(s, $("conversation").firstChild)
        }
    });
    ajax("/post", {name: "name", authenticity_token: $("post").authenticity_token.value}, "post", function (r) {
        $("author").innerHTML = participants[JSON.parse(r.responseText).notice]
    });
    addEvent($("post"), "submit", function (e) {
        e.preventDefault();
        //$("post").style.display = "none";
        for (var params = {}, a = 0; this.elements[a]; a++) params[this.elements[a].name] = this.elements[a].value;
        params["post[timestamp]"] = new Date().getTime();
        ajax(this.action, params, this.method, function (r) {
            alert(JSON.parse(r.responseText).notice);
            location.reload()
        })
    });
    function resize () {
        var x = $("body"),
            scr = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
        if (x.scrollHeight > postHeight.min) {
            x.style.height = "auto";
            x.style.height = x.scrollHeight + "px"
            postHeight.last = x.scrollHeight
        } else if (x.scrollHeight <= postHeight.min) {
            x.style.height = null
        }
        window.scroll(0, scr)
    }
    addEvent($("body"), "change", resize);
    addEvent($("body"), "drop keydown cut paste", function () { delay(resize) })
}
