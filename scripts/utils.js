"use strict";

function listen(window, node, event, func, capture) {
  if (capture == null) capture = true;
  node.addEventListener(event, func, capture);
  function undoListen() {
    node.removeEventListener(event, func, capture);
  }
  var undoUnload = unload(undoListen, window);
  return function() {
    undoListen();
    undoUnload();
  };
}

function unload(callback, container) {
  let unloaders = unload.unloaders;
  if (unloaders == null) unloaders = unload.unloaders = [];
  if (callback == null) {
    unloaders.slice().forEach(function(unloader) unloader());
    unloaders.length = 0;
    return;
  }
  if (container != null) {
    container.addEventListener("unload", removeUnloader, false);
    let origCallback = callback;
    callback = function() {
      container.removeEventListener("unload", removeUnloader, false);
      origCallback();
  } }
  function unloader() {
    try {
      callback();
    } catch(ex) {}
  }
  unloaders.push(unloader);
  function removeUnloader() {
    var index = unloaders.indexOf(unloader);
    if (index != -1) unloaders.splice(index, 1);
  }
  return removeUnloader;
}

function watchWindows(callback) {
  function watcher(window) {
    try {
      var {documentElement} = window.document;
      if (documentElement.getAttribute("windowtype") == "navigator:browser") callback(window);
    } catch(ex) {}
  }
  function runOnLoad(window) {
    window.addEventListener("load", function runOnce() {
      window.removeEventListener("load", runOnce, false);
      watcher(window);
    }, false);
  }
  var windows = Services.wm.getEnumerator(null);
  while (windows.hasMoreElements()) {
    var window = windows.getNext();
    if (window.document.readyState == "complete") watcher(window);
    else runOnLoad(window);
  }
  function windowWatcher(subject, topic) {
    if (topic == "domwindowopened") runOnLoad(subject);
  }
  Services.ww.registerNotification(windowWatcher);
  unload(function() Services.ww.unregisterNotification(windowWatcher));
}
