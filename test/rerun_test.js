'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var taskManager;
exports.rerun = {
    // setUp: function (done) {
    //     // setup here if necessary
    //     done();
    // },
    // taskManager: function (test) {
    //     test.expect(2);
    //     var body = '';
    //     process.stdout.on('data',function (data) {
    //         data += body;
    //         console.log(data);
    //     });

    //     process.stdout.on('exit', function () {
    //         test.notEqual(body.indexOf('clean'),-1,'it should start the clean process');
    //         test.notEqual(body.indexOf('connect'),-1,'it should start the connect process');
    //         test.done();
    //     });
    //     grunt.task.run('rerun:test');
        
    // },

};


