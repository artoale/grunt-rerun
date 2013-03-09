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
    setUp: function (done) {
        // setup here if necessary
        taskManager = require('../tasks/lib/taskmanager.js');
        done();
    },
    taskManager: function (test) {
        // test.expect(5);


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

        test.strictEqual(typeof taskman.isRunning, 'function', 'it should expose the "isRunning" method');

        test.ok(taskman.isRunning('connect'), 'A long running process should run for long');

        test.ok(taskman.stopOne('connect'), 'It should stop process');

        test.ok(!taskman.isRunning('connect'), 'A stopped task should not be running');
        test.done();
    },
    server: function (test) {
        test.expect(6);
        var server = require('../tasks/lib/server.js');
        test.ok(server, 'server should not be undefined');
        test.strictEqual(typeof server, 'function', 'server should be a function');
        var options = {
            tasks: ['clean', 'connect'],
            port: 1247
        };

        var taskman = taskManager(options.tasks, grunt);
        server(taskman, options);
        var opt = {

            hostname: '127.0.0.1',
            port: options.port,
            path: '/connect',
            method: 'POST'
        };

        taskman.startOne('connect');

        var req = require('http').request(opt, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
                test.ok(chunk.length !== 0, 'It should recive non-empty responses');
            });

            res.on('end', function () {
                test.strictEqual(body, 'Done', 'It should return done when a running task is stopped');
                continueTests();
            });
        });

        function continueTests() {        
            opt.path = '/clean';
            var req = require('http').request(opt, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                    test.ok(chunk.length !== 0, 'It should recive non-empty responses');
                });

                res.on('end', function () {
                    test.strictEqual(body, 'Error', 'It should return Error when the task is not running');
                    test.done();
                });

            });
            req.end();
        }
        req.end();

    },

};
