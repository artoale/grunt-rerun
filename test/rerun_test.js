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

exports.rerun = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    taskManager: function (test) {
        // test.expect(5);
        var taskManager = require('../tasks/lib/taskmanager.js');

        test.ok(taskManager, 'taskmanager should not be undefined');
        test.strictEqual(typeof taskManager, 'function', 'taskManager should be a function');

        var options = {
            tasks: ['clean', 'connect'],
            port: 1247
        };

        var taskman = taskManager(options.tasks, grunt);

        test.ok(taskman, 'taskManager should create taskman');
        test.strictEqual(typeof taskman, 'object', 'taskman should be an object');

        test.ok(!taskman.startOne('dummy'), 'It should return false for unknown tasks');
        test.ok(taskman.startOne('clean'), 'It should return true for known tasks');
        test.ok(taskman.startOne('connect'), 'It should return true for known tasks');

        test.strictEqual( typeof taskman.isRunning, 'function', 'it should expose the "isRunning" method');

        test.ok( taskman.isRunning('connect'), 'A long running process should run for long');

        test.ok( taskman.stopOne('connect'),'It should stop process');

        test.ok( !taskman.isRunning('connect'), 'A stopped task should not be running');
        test.done();
    },
};
