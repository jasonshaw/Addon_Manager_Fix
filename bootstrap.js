const ADDON_NAME = "Addon Manager Fix";
const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
       
(function(global) global.include = function include(src) {
  var o = {};
  Cu.import("resource://gre/modules/Services.jsm", o);
  var uri = o.Services.io.newURI(src, null, o.Services.io.newURI(__SCRIPT_URI_SPEC__, null, null));
  o.Services.scriptloader.loadSubScript(uri.spec, global);
})(this);

include("scripts/helpers.js");
include("scripts/pref.js");
include("scripts/utils.js");

function startup(data, reason) {
  var gB = Services.prefs.getBranch(pref.root), prefList = gB.getChildList("", {});
  var skin = Services.prefs.getBranch("general.skins.").getCharPref("selectedSkin");
  for (var i in prefList) {
    var bool = gB.getPrefType(prefList[i]);
    // 128 = boolean, 64 = integer, 32 = string
    if (bool == 128 && prefList[i].indexOf("View") < 0) loadAndObserve(prefList[i], "styles/" + prefList[i] + ".css");
  }
  loadSheet("styles/global.css");
  if (skin.indexOf("nightlaunch") != -1) {
    unloadSheet("styles/default.css");
    loadSheet("styles/nasa.css");
  } else {
    unloadSheet("styles/nasa.css");
    loadSheet("styles/default.css");
  } 
  loadSetting();
}

function loadSetting() {
  if (pref("headersearch")) {
    unloadSheet("styles/boxOff.css");
    loadSheet("styles/boxOn.css");
  } else {
    unloadSheet("styles/boxOn.css");
    loadSheet("styles/boxOff.css");
  } 
}

function togglePref(a, b) {
  var win = Services.wm.getMostRecentWindow("navigator:browser");
  win.content.document.getElementById(a).setAttribute("checked", pref(b));
}  

function shutdown(data, reason) {
  if (reason == APP_SHUTDOWN) return;
  if (reason == ADDON_DISABLE) {
    var gB = Services.prefs.getBranch(pref.root).getChildList("", {});
    for (var i in gB) unloadSheet("styles/" + gB[i] + ".css");
    unloadSheet("styles/boxOff.css");
    unloadSheet("styles/boxOn.css");
    unloadSheet("styles/default.css");
    unloadSheet("styles/global.css");
    unloadSheet("styles/nasa.css");
} }

function install(data, reason) {}
function uninstall(data, reason) {}
