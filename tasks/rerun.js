/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

'use strict';

var taskManager = require('./lib/taskmanager.js');

module.exports = function (grunt) {
    //Module for output coloring
    var colors = require('colors');

    grunt.registerMultiTask('rerun', 'Rerun (kill and relaunch) a long living task', function () {
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
        console.log('Server running at http://127.0.0.1:' + options.port + '/');
    };

};
