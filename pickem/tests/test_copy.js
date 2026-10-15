'use strict';
// Test 8: copy rules on the pages. No em dashes. No "lock" as a betting term,
// no "best bet", no "our pick". The footer line is present.
var H = require('./helpers.js');
module.exports = function () {
  var dir = H.path.join(__dirname, '..');
  var files = [];
  H.fs.readdirSync(dir).forEach(function (f) { if (/\.(html|css)$/.test(f)) files.push(H.path.join(dir, f)); });
  H.fs.readdirSync(H.path.join(dir, 'js')).forEach(function (f) { if (/\.js$/.test(f)) files.push(H.path.join(dir, 'js', f)); });
  var rules = [
    { re: /—/g, why: 'em dash' },
    { re: /\bbest bets?\b/gi, why: '"best bet"' },
    { re: /\bour picks?\b/gi, why: '"our pick"' },
    // The bare noun "lock" (a sure thing). "locked", "locks", "lock time", "picks lock at" are fine.
    { re: /\b(a|the|is a|mortal|stone cold)\s+lock\b/gi, why: '"lock" as a sure thing' },
    { re: /\block (it|this) in\b/gi, why: '"lock it in"' }
  ];
  files.forEach(function (f) {
    var txt = H.fs.readFileSync(f, 'utf8');
    rules.forEach(function (r) {
      var m = txt.match(r.re);
      if (m) H.check(false, H.path.relative(dir, f) + ': ' + r.why + ' x' + m.length + ' (' + m[0] + ')');
    });
  });
  var idx = H.path.join(dir, 'index.html');
  if (H.fs.existsSync(idx)) {
    var html = H.fs.readFileSync(idx, 'utf8') + H.fs.readFileSync(H.path.join(dir, 'js', 'app.js'), 'utf8');
    H.check(html.indexOf('Math, not picks. Win % from betting markets, frozen at kickoff.') >= 0, 'live board footer line missing');
    var sth = H.fs.readFileSync(H.path.join(dir, 'js', 'standings.js'), 'utf8');
    H.check(sth.indexOf('Math, not picks. Win % from betting markets, frozen at kickoff.') >= 0, 'standings footer line missing');
    H.check(/<meta name="robots" content="noindex/.test(html), 'index.html noindex missing');
  }
  var st = H.path.join(dir, 'standings.html');
  if (H.fs.existsSync(st)) H.check(/<meta name="robots" content="noindex/.test(H.fs.readFileSync(st, 'utf8')), 'standings.html noindex missing');
  return H.report('copy rules (' + files.length + ' files)');
};
