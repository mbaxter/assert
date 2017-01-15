About
===
Some tools to make testing easier.

Installation
===
`npm install mbaxter/assert`

Api
===

deepEqual(actual,expect,options)
---
Provides a configurable deepEqual method with options for case-sensitivity, 
numeric error thresholds, and strictness.
```
const assertHelper = require('@mbaxter/assert');

const expected = {
   num: 1,
   str: "abc"
};
const actual = {
   num: ".999",
   str: "ABC"
};

const options = {
   errorThreshold: .01,
   strict: false,
   caseSensitive: false,
   message: "Test Case X"
};

// Assertion will pass
assertHelper.deepEqual(actual, expected, options);
```

Development
===
See package.json scripts for tools to build, watch, lint, and test code.