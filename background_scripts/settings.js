"use strict";
// Generated by CoffeeScript 1.8.0
(typeof exports !== "undefined" && exports !== null ? exports : window).Settings = {
  _buffer: {},
  get: function(key) {
    if (! (key in this._buffer)) {
      return this._buffer[key] = (key in localStorage) ? JSON.parse(localStorage[key]) : this.defaults[key];
    }
    return this._buffer[key];
  },
  set: function(key, value) {
    this._buffer[key] = value;
    if (value === this.defaults[key]) {
      if (key in localStorage) {
        delete localStorage[key];
      }
      // Sync.clear(key);
    } else {
      localStorage[key] = JSON.stringify(value);
      // Sync.set(key, localStorage[key]);
    }
    if (key = this.postUpdateHooks[key]) {
      key.call(this, value);
    }
  },
  clear: function(key) {
    this.set(key, this.defaults[key]);
  },
  has: function(key) {
    return key in localStorage;
  },
  postUpdateHooks: {
    keyMappings: function(value) {
      Commands.clearKeyMappingsAndSetDefaults();
      Commands.parseCustomKeyMappings(value);
      refreshCompletionKeysAfterMappingSave();
    },
    searchEngines: function(value) {
      this.parseSearchEngines(value);
    },
    exclusionRules: function(value) {
      Exclusions.postUpdateHook(value);
    },
    settingsVersion: function(value) {
      var key = "settingsVersion";
      this._buffer[key] = this.defaults[key];
      if (key in localStorage) {
        delete localStorage[key];
      }
      // Sync.clear(key);
    }
  },
  _searchEnginesMap: undefined,
  parseSearchEngines: function(searchEnginesText) {
    var a, pairs, key, val, name, _i, _j, _k, _len, rColon = /:\s*(.+)/;
    var titles = {}, map = this._searchEnginesMap = { ":": titles };
    a = searchEnginesText.replace(/\\\n/g, '').split('\n');
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      val = a[_i].trim();
      if (!val || val[0] === '#') continue;
      pairs = val.split(rColon, 4);
      if (pairs.length !== 3 || !(key = pairs[0].trimRight()) || !(val = pairs[1])) continue;
      pairs = key.split('|');
      _j = pairs.length;
      while (0 <= --_j) {
        if (!(key = pairs[_j].trim())) continue;
        _k = key.indexOf('=');
        if (_k > 0) {
          name = key.substring(_k + 1);
          key = key.substring(0, _k).trimRight();
          if (!key) continue;
          name = name.trimLeft() || key;
        } else if (_k < 0) {
          name = key;
        } else {
          continue;
        }
        map[key] = val;
        titles[key] = name;
      }
    }
  },
  getSearchEngines: function() {
    if (! this._searchEnginesMap) {
      this.parseSearchEngines(this.get("searchEngines") || "");
    }
    return this._searchEnginesMap;
  },
  defaults: {
    scrollStepSize: 100,
    smoothScroll: true,
    keyMappings: "# Insert your preferred key mappings here.",
    linkHintCharacters: "asdqwerzxcv",
    linkHintNumbers: "0123456789",
    filterLinkHints: false,
    hideHud: false,
    regexFindMode: false,
    userDefinedCss: "",
    exclusionRules: [
      {
        pattern: "http*://mail.google.com/*",
        passKeys: ""
      }
    ],
    previousPatterns: "prev,previous,back,<,\u2190,\xab,\u226a,<<",
    nextPatterns: "next,more,>,\u2192,\xbb,\u226b,>>",
    searchUrl: "http://www.baidu.com/s?ie=utf-8&wd=%s",
    searchEngines: "w = Wikipedia (en-US):\\\n  http://www.wikipedia.org/w/index.php?search=%s\nba=Baidu|baidu=Baidu:\\\n  www.baidu.com/s?ie=utf-8&wd=%s",
    newTabUrl: "/index.html",
    settingsVersion: Utils.getCurrentVersion()
  },
  ChromeInnerNewTab: "chrome-search://local-ntp/local-ntp.html"
};
