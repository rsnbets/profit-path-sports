/* PPS Pick'em: browser storage. Pool data never leaves the browser.
 * Every read and write is wrapped in try/catch. Keys are namespaced per week. */
(function (root) {
  'use strict';
  var NS = 'pickem:';
  function get(key, fallback) {
    try { var v = localStorage.getItem(NS + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function del(key) { try { localStorage.removeItem(NS + key); } catch (e) { /* ignore */ } }
  function keys() {
    var out = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(NS) === 0) out.push(k.slice(NS.length)); } } catch (e) { /* ignore */ }
    return out;
  }
  // Clear every pick'em key (picks, season, snapshots, finals, you).
  function clearAll() { keys().forEach(del); }
  function weekKey(season, week) { return season + '-w' + (week < 10 ? '0' + week : week); }
  root.PickemStore = { get: get, set: set, del: del, keys: keys, clearAll: clearAll, weekKey: weekKey };
}(typeof self !== 'undefined' ? self : this));
