var $ = function(id) {
  return document.getElementById(id);
}

var checked = false;
var iosDetected = navigator.userAgent.match("(iPad|iPod|iPhone)");
var timer = null;
var timerDelay = iosDetected ? 800 : 400;
var $note, $action, $preview, $plain_password, $info
var backendTimer;

function md2html(input) {
  if(document.getElementById("markCheck").checked) {
    return marked(input);
    checked = true;
  } else {
    checked = false;
    return escape(input);
  }
}

function saveDraft() {
  if ($action == "UPDATE") return;
  console.log("Autosaving draft...");
  $info.innerHTML = "Draft saved."
  localStorage.setItem("draft", $note.value);
}

function onLoad() {
  $note = $("note");
  $action = $("action").value;
  $preview = $("draft");
  $info = $("info");
  $plain_password = $("plain-password");
  updatePreview = function() {
    clearTimeout(timer);
    var content = $note.value;
    var delay = Math.min(timerDelay, timerDelay * (content.length / 400));
    // Feature in beta.. to be released in 1.0
    /*timer = setTimeout(function() {
      //$note.value = md2html(content);
      //$tableau.innerHTML = content.split(/\s+/).length + " words";
    }, delay);*/
  };
  if ($action == "UPDATE") updatePreview();
  else {
    $note.value = "";
    var draft = localStorage.getItem("draft");
    if (draft) {
       $note.value = draft;
       updatePreview();
    }
  }
  //$note.onkeyup = updatePreview;
  $("publish-button").onclick = function(e) {
    localStorage.removeItem("draft");
    self.onbeforeunload = null;;
    if ($plain_password.value != "") $("password").value = md5($plain_password.value);
    $plain_password.value = null;
    $("signature").value = md5($("session").value +
      $note.value.replace(/[\n\r]/g, ""));
  }
  if (iosDetected) $note.className += " ui-border";
  else $note.focus();
  self.onbeforeunload = saveDraft;
  setInterval(saveDraft, 1000)
}
