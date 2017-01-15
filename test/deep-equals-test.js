"use strict";

const deepEqual = require('../index.js').deepEqual;
const assert = require('assert');

describe("deepEquals", () => {
    describe("when expecting a string", () => {

        let looselyEqualStrings = [
            [true,"1"],
            [false,""],
            [false,"0"],
            [3,"3"],
            [[1,2],"1,2"]
        ];

        describe("and strict option = true", () => {
            looselyEqualStrings.forEach(([actual, expected]) => {
                describe(`and non-string ${JSON.stringify(actual)} is compared to string "${expected}"`, () => {
                    shouldNotValidate(actual, expected, {strict: true});
                });

                describe('given non-equal values', () => {
                    shouldNotValidate("1", false, {strict: true});
                });
            });
        });

        describe("and strict option = false", () => {
            looselyEqualStrings.forEach(([actual, expected]) => {
                describe(`and non-string ${JSON.stringify(actual)} is compared to string "${expected}"`, () => {
                    shouldValidate(actual, expected, {strict: false});
                });

                describe('given non-equal values', () => {
                    shouldNotValidate("1", false, {strict: false});
                });
            });
        });

        describe("with caseSensitive set to false", () => {
            describe("given strings that diff only by case", () => {
                shouldValidate("something", "SomeThinG", {caseSensitive: false});
            });

            describe("given identical strings", () => {
                shouldValidate("something", "something", {caseSensitive: false});
            });

            describe("given different strings", () => {
                shouldNotValidate("something", "else", {caseSensitive: false});
            });
        });

        describe("with caseSensitive set to false", () => {
            describe("given strings that diff only by case", () => {
                shouldNotValidate("something", "SomeThinG", {caseSensitive: true});
            });

            describe("given identical strings", () => {
                shouldValidate("something", "something", {caseSensitive: true});
            });

            describe("given different strings", () => {
                shouldNotValidate("something", "else", {caseSensitive: true});
            });
        });
    });

    describe("when expecting a number", () => {
        describe("with non-zero errorThreshold", () => {
            describe("with values that differ within errorThreshold", () => {
                describe("with strict option = true", () => {
                    let options;
                    beforeEach(() => {
                        options = {
                            strict: true,
                            errorThreshold: .1
                        };
                    });

                    describe("given an actual value that is numeric", () => {
                        describe("with positive difference", () => {
                            shouldValidate(1, 1.05, () => options);
                        });

                        describe("with negative difference", () => {
                            shouldValidate(1.05, 1, () => options);
                        });
                    });

                    describe("given an actual value that is a string", () => {
                        shouldNotValidate("1", 1.05, () => options);
                    });
                });

                describe("with strict option = false", () => {
                    let options;
                    beforeEach(() => {
                        options = {
                            strict: false,
                            errorThreshold: .1
                        };
                    });

                    describe("given an actual value that is numeric", () => {
                        shouldValidate(1, 1.05, () => options);
                    });

                    describe("given an actual value that is a string", () => {
                        shouldValidate("1", 1.05, () => options);
                    });
                });
            });

            describe("with values that differ beyond errorThreshold", () => {
                describe("with strict option = true", () => {
                    let options;
                    beforeEach(() => {
                        options = {
                            strict: true,
                            errorThreshold: .1
                        };
                    });

                    describe("given an actual value that is numeric", () => {
                        describe("with positive difference", () => {
                            shouldNotValidate(1, 1.2, () => options);
                        });

                        describe("with negative difference", () => {
                            shouldNotValidate(1.2, 1, () => options);
                        });
                    });

                    describe("given an actual value that is a string", () => {
                        shouldNotValidate("1", 1.2, () => options);
                    });
                });

                describe("with strict option = false", () => {
                    let options;
                    beforeEach(() => {
                        options = {
                            strict: false,
                            errorThreshold: .1
                        };
                    });

                    describe("given an actual value that is numeric", () => {
                        shouldNotValidate(1, 1.2, () => options);
                    });

                    describe("given an actual value that is a string", () => {
                        shouldNotValidate("1", 1.2, () => options);
                    });
                });
            });

        });

        describe("with default errorThreshold = 0", () => {
            describe("with equal values", () => {
                let actual, expected;
                before(() => {
                    actual = 1;
                    expected = 1;
                });

                describe("with strict = true", () => {
                    describe("and an actual value that is numeric", () => {
                        shouldValidate(() => actual, () => expected, {strict: true});
                    });

                    describe("and an actual value that is not numeric", () => {
                        shouldNotValidate(() => actual + "", () => expected, {strict: true});
                    });
                });

                describe("with strict = false", () => {
                    describe("and an actual value that is numeric", () => {
                        shouldValidate(() => actual, () => expected, {strict: false});
                    });

                    describe("and an actual value that is not numeric", () => {
                        shouldValidate(() => actual + "", () => expected, {strict: false});
                    });
                });
            });

            describe("with non-equal values", () => {
                let actual, expected;
                before(() => {
                    actual = 1 - Number.EPSILON;
                    expected = 1;
                });

                describe("with strict = true", () => {
                    describe("and an actual value that is numeric", () => {
                        shouldNotValidate(() => actual, () => expected, {strict: true});
                    });

                    describe("and an actual value that is not numeric", () => {
                        shouldNotValidate(() => actual + "", () => expected, {strict: true});
                    });
                });

                describe("with strict = false", () => {
                    describe("and an actual value that is numeric", () => {
                        shouldNotValidate(() => actual, () => expected, {strict: false});
                    });

                    describe("and an actual value that is not numeric", () => {
                        shouldNotValidate(() => actual + "", () => expected, {strict: false});
                    });
                });
            });
        });
    });

    describe("when expecting a boolean", () => {
        describe("with strict option = true", () => {
            let options;
            before(() => {
               options = {
                   strict: true
               };
            });

            describe("given loosely equal values", () => {
                shouldNotValidate("1", true, () => options);
            });

            describe("given strictly equal values", () => {
                shouldValidate(true, true, () => options);
            });

            describe("given unequal values", () => {
                shouldNotValidate(false, true, () => options);
            });

        });

        describe("with strict option = false", () => {
            let options;
            beforeEach(() => {
                options = {
                    strict: false
                };
            });
            describe("given loosely equal values", () => {
                shouldValidate("1", true, () => options);
            });

            describe("given strictly equal values", () => {
                shouldValidate(true, true, () => options);
            });

            describe("given unequal values", () => {
                shouldNotValidate(false, true, () => options);
            });
        });
    });

    describe("when expecting an object", () => {
       describe("given 2 objects", () => {
           describe("that are equal", () => {
              shouldValidate({a:1, b:true, c: {d: [], e:[1,2], f:"bla"}}, {a:1, b:true, c: {d: [], e:[1,2], f:"bla"}});
           });

           describe("that are equal except for extra key", () => {
               shouldNotValidate({a:1, b:true, c: {d: [], e:[1,2], f:"bla"}}, {a:1, b:true, c: {d: [], e:[1,2]}});
           });

           describe("that are equal except for missing key", () => {
               shouldNotValidate({b:true, c: {d: [], e:[1,2], f:"bla"}}, {a:1, b:true, c: {d: [], e:[1,2], f:"bla"}});
           });

           describe("that are unequal in one property value", () => {
               shouldNotValidate({a:1, b:true, c: {d: [], e:[1,2], f:"bla"}}, {a:1, b:true, c: {d: [], e:[1,3], f:"bla"}});
           });

           describe("and non-default options", () => {
               describe("and values that validate only if options are respected", () => {
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
                       caseSensitive: false
                   };

                   shouldValidate(actual, expected, options);
               });
           });
       });
    });
});

function shouldValidate(actual, expected, options) {
    it("should validate", () => {
        [actual, expected, options] = evaluateArgs(actual,expected,options);
        const {isValid, msg} = doesValidate(actual,expected,options);
        assert.ok(isValid, msg);
    });
}

function shouldNotValidate(actual, expected, options) {
    it("should not validate", () => {
        [actual, expected, options] = evaluateArgs(actual,expected,options);
        const {isValid, msg} = doesValidate(actual,expected,options);
        assert.ok(!isValid, msg);
    });
}

function evaluateArgs(... args) {
   return args.map((arg) => {
      return typeof arg == 'function' ? arg() : arg;
   });
}

function doesValidate(actual, expected, options) {
    try {
        deepEqual(actual, expected, options);
    } catch (e) {
        return {
            isValid: false,
            msg: e.message
        };
    }

    return {
        isValid: true
    };
}