'use strict';
// Run every JS test: node pickem/tests/run.js
var path = require('path'), fs = require('fs');
var testEngine = require('./test_engine.js');
var M = require('./test_math.js');
var testParser = require('./test_parser.js');
var testCopy = require('./test_copy.js');
var here = __dirname;
var fixtures = [path.join(here, 'fixture-mock-week.json')];
// The raw handoff fixture (real handles, gitignored) runs too when present, so both stay in step.
var raw = path.join(here, '..', '..', 'pickem-handoff', 'fixture-mock-week.json');
if (fs.existsSync(raw)) fixtures.push(raw);
var privateDir = path.join(here, '..', 'private');
if (fs.existsSync(privateDir)) fs.readdirSync(privateDir).filter(function (f) { return /^fixture-.*\.json$/.test(f); }).forEach(function (f) { fixtures.push(path.join(privateDir, f)); });

var ok = true;
fixtures.forEach(function (f) { ok = testEngine(f) && ok; });
ok = M.testTiebreak() && ok;
ok = M.testSums(fixtures[0]) && ok;
ok = M.testMonteCarlo(fixtures[0], 200000) && ok;
ok = M.testPerformance() && ok;
ok = testParser() && ok;
ok = testCopy() && ok;
console.log(ok ? 'ALL PASS' : 'SOME FAILED');
process.exitCode = ok ? 0 : 1;
