"use strict";

function pref(key) {
  var {branch, defaults} = pref;
  if (branch == null) branch = Services.prefs.getBranch(pref.root);
  switch (typeof defaults[key]) {
    case "boolean": return branch.getBoolPref(key);
    case "number": return branch.getIntPref(key);
    case "string": return branch.getCharPref(key);
  }
  return null;
}

pref.root = "extensions.addonmanagerfix.";
pref.defaults = {
  checkbox: false,
  counts: false,
  darktheme: true,
  disabledicon: false,
  headersearch: true,
  icons: false,
  menu: true,
  menuitems: false,
  navigate: true,
  restart: false,
  searchbox: false,
  slimlist: false,
  custombuttonsView: true,
  editView: false,
  extensionsView: true,
  pluginsView: true,
  scriptsView: true,
  scriptView: true,
  stylesView: true,
  themesView: true,
  category1: "",
  category2: "",
  category3: "",
  category4: "",
  category5: "",
  category6: "",
  category7: "",
  category8: "",
  category9: "",
  category10: "",
  category11: "",
  category12: "",
  category13: "",
  category14: "",
  organize: ""
};

pref.observe = function(prefs, callback) {
  var {root} = pref;
  function observe(subject, topic, data) {
    if (topic != "nsPref:changed") return;
    let pref = data.slice(root.length);
    if (prefs.indexOf(pref) == -1) return;
    togglePref("sonco-" + pref, pref);
    if (pref == "headersearch") loadSetting();
    callback(pref);
  }
  Services.prefs.addObserver(root, observe, false);
  unload(function() Services.prefs.removeObserver(root, observe));
};

let (branch = Services.prefs.getDefaultBranch(pref.root)) {
  for (var [key, val] in Iterator(pref.defaults)) {
    switch (typeof val) {
      case "boolean": branch.setBoolPref(key, val); break;
      case "number": branch.setIntPref(key, val); break;
      case "string": branch.setCharPref(key, val); break;
} } }
