/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    //Module for output coloring
    var colors = require('colors');

    grunt.registerMultiTask('rerun', 'Your task description goes here.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var defaultsOptions = {
            tasks: [],
            port: 1247
        };

        var options = this.options(defaultsOptions);

        //tasks option must be an array
        if (!Array.isArray(options.tasks)) {
            grunt.log.error('Error in configuration: tasks option should be an array');
            return false;
        }

        if (this.flags.go) {
            var done = this.async();
            var opt = {

                hostname: '127.0.0.1',
                port: options.port,
                path: '/' + this.args[0],
                method: 'POST'
            };

            var req = require('http').request(opt);
            req.on('error', function (e) {
                grunt.log.error('problem with request: ' + e.message);
            });
            req.end();
            return;

        }
        var taskman = taskManager(options.tasks);
        options.tasks.forEach(function (taskname) {
            taskman.startOne(taskname);
        });

        // taskman.startOne('connect');
        server(taskman,options);
        if (options.keepalive) {
            grunt.log.writeln('Rerun is running forever. Hit Crt-C to stop it');
            this.async();
        }
    });


    var taskManager = function taskManager(taskList) {
        var tasks = Object.create(null);
        taskList.forEach(function (elem) {
            tasks[elem.toString()] = {
                status: 'NOT RUNNING',
                child: null
            };
        });

        /**
         * Start a registered task, given its name
         * @param  {String} task The task to start
         * @return {Boolean}
         */

        function startTask(task) {
            var cmd;
            if (!tasks[task]) {
                grunt.log.error('Task ' + task + ' not defined.');
                return false;
            }
            if (tasks[task].status !== 'NOT RUNNING') {
                grunt.log.error('Task ' + task + ' already running.');
                return false;

            }
            cmd = 'grunt ' + task;
            grunt.log.writeln('Running task: ' + task.cyan);
            tasks[task].status = 'RUNNING';
            tasks[task].child = require('child_process').exec(cmd);

            tasks[task].child.on('exit', function (code, signal) {
                grunt.log.writeln('Task ' + task.cyan + ' completed');


                tasks[task].status = 'NOT RUNNING';
                delete tasks[task].child;
            });
            tasks[task].child.stdout.on('data', function (data) {
                grunt.log.write(data);
            });
            return true;
        }


        /**
         * Stop a running task
         * @param  {string} task The task to stop
         * @return {Boolean}
         */

        function stopTask(task) {
            if (!tasks[task]) {
                grunt.log.error('Task ' + task.cyan + ' not defined.');
                return false;
            }

            var taskProcess = tasks[task];
            if (taskProcess.status !== 'RUNNING' || !taskProcess.child) {
                grunt.log.error('Task ' + task.cyan + ' is not running.');
                return false;
            }

            taskProcess.status = 'NOT RUNNING';
            taskProcess.child.removeAllListeners();
            taskProcess.child.kill();
            grunt.log.writeln('Task ' + task.cyan + ' killed.');
            // taskProcess.child = null;
            delete taskProcess.child;
            return true;

        }

        return {
            startOne: startTask,
            stopOne: stopTask
        };
    };
    

    var server = function server(taskManager, options) {
        var http = require('http');
        http.createServer(function (req, res) {
            var command = req.url.substr(1);
            var commandlist = command.split(':');
            var task = commandlist[0];
            var status = taskManager.stopOne(task);
            status = taskManager.startOne(task) && status;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            if (status) {
                res.end('Done.\n');
            } else {
                res.end('Error\n');
            }
        }).listen(options.port, "127.0.0.1");
        console.log('Server running at http://127.0.0.1:1337/');
    };

};
