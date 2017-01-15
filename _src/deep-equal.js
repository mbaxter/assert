"use strict";
const chai = require('chai');
const assert = chai.assert;

const isArray = require('lodash/isArray');
const isUndefined = require('lodash/isUndefined');
const isBoolean = require('lodash/isBoolean');
const isNumber = require('lodash/isNumber');
const isString = require('lodash/isString');
const isObject = require('lodash/isObject');
const keys = require('lodash/keys');
const each = require('lodash/each');
const has = require('lodash/has');

/**
 * Does a deep comparison between objects with some additional configuration options.
 * @param {*} actual
 * @param {*} expected
 * @param {{}} [options]
 * @param {boolean} [options.caseSensitive = true] Whether strings should be compared in a case-sensitive way
 * @param {Number} [options.errorThreshold=0] The tolerance to allow when comparing numbers
 * @param {Number} [options.maxDepth=5] How deep to recurse when comparing nested objects
 * @param {String} [options.message] The message to display on error
 * @param {boolean} [options.strict = false] Whether to use a strict comparison
 * @param {String[]} [options._context] Used internally by the method - additional context to log with error messages
 * @param {Number} [options._depth=0] Used internally by the method - the current depth
 */
module.exports = function deepEqual(actual, expected, options) {
    options = options || {};
    // Setup defaults
    let {
        caseSensitive = true,
        errorThreshold = 0,
        strict = false,
        message,
        maxDepth = 5,
        // Context and depth are bookeeping parameters used internally by the function
        _context,
        _depth = 0,
    } = options;

    if(_depth > maxDepth) {
        throw "Exceeded depth limit";
    }

    const contextString = isArray(_context) ? ` (Context: ${_context.join('->')})` : '';
    const prefix = isUndefined(message) ? '' : `[${message}] `;
    const formatMsg = (msg) => {
        return `${prefix}${msg}${contextString}`;
    };

    if (isBoolean(expected)) {
        // Compare booleans
        let isEqual = strict ? assert.strictEqual : assert.equal;
        isEqual(actual, expected, formatMsg(`Expected boolean: ${JSON.stringify(expected)}`));
    } else if(isNumber(expected)) {
        // Compare numbers using errorThreshold
        if (strict) {
            assert.ok(isNumber(actual), formatMsg("Value should be a number"));
        } else if (!isNumber(actual)) {
            let originalValue = actual;
            actual = parseFloat(actual);
            // Make sure the parsing produced roughly equal values
            assert.equal(actual, originalValue, formatMsg("Unable to convert value to number"));
        }
        const error = Math.abs(actual - expected);
        assert.ok(error <= errorThreshold, formatMsg(`Error between actual (${actual}) and expected (${expected}) exceeds threshold: ${error}`));
    } else if (isString(expected)) {
        if (strict) {
            assert.ok(isString(actual), formatMsg(`Expected a string but got ${typeof actual}`));
        }
        // Compare strings using lowerCase config
        if (!caseSensitive && isString(actual)) {
            assert.equal(actual.toLowerCase(), expected.toLowerCase(), formatMsg("String values are not equal"));
        } else {
            assert.equal(actual, expected, formatMsg("Value should be a string"));
        }
        // Compare objects
    } else if (isObject(expected)) {
        // Recursively compare objects and arrays
        assert.ok(isObject(actual), formatMsg("Actual value should be an object"));
        assert.equal(keys(actual).length, keys(expected).length, formatMsg("Expected and actual should have the same number of keys"));
        each(expected, function(value, key){
            // Assert same number of keys
            assert.ok(has(actual, key), formatMsg("Value should contain key " + key));
            _context = _context || [];
            _context.push(key);
            deepEqual(actual[key], value, {
                ... options,
                _depth: _depth + 1,
                _context,
            });
        });
    } else {
        // Unsupported type - throw error
        // shouldn't get here
        throw new Error(formatMsg(`Unexpected datatype "${typeof expected}"`));
    }
};