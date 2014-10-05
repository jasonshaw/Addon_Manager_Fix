"use strict";

var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

function printToLog(message, forceEnable) {
  if (forceEnable || pref("loggingEnabled"))
    Services.console.logStringMessage(ADDON_NAME + ": " + message);
}

function getURIForFile(filepath) {
  return ios.newURI(__SCRIPT_URI_SPEC__.replace("bootstrap.js", filepath), null, null);
}

function loadSheet(filepath) {
  sss.loadAndRegisterSheet(getURIForFile(filepath), sss.USER_SHEET);
  printToLog("Loaded " + filepath);
}

function unloadSheet(filepath) {
  var uri = getURIForFile(filepath);
  if (sss.sheetRegistered(uri, sss.USER_SHEET)) {
    sss.unregisterSheet(uri, sss.USER_SHEET);
    printToLog("Unloaded " + filepath);
} }

function loadAndObserve(prefName, fileName) {
  if (pref(prefName)) loadSheet(fileName);
  pref.observe([prefName], function() {pref(prefName) ? loadSheet(fileName) : unloadSheet(fileName);});
  unload(function() {
    unloadSheet(fileName);
  });
}


