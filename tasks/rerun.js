/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

'use strict';

var taskManager = require('./lib/taskmanager.js'),
    server = require('./lib/server.js'),
    colors = require('colors'),
    Module = require('di').Module,
    Injector = require('di').Injector;
var injector;
module.exports = function (grunt) {

    grunt.registerMultiTask('rerun', 'Rerun (kill and relaunch) a long living task', function () {
        var defaultsOptions = {
            tasks: [],
            port: 1247,
            hostname: 'localhost',
        }, options = this.options(defaultsOptions);

        var modules = {
            'options': ['value', options],
            'grunt': ['value', grunt],
            'gruntTask': ['value', this],
            'taskman': ['factory', taskManager],
            'server': ['factory', server] ,
            'logger': ['value',grunt.log]
        };

        injector = new Injector([modules]);
        var taskman = injector.get('taskman');
        injector.invoke(require('./lib/taskjob'));
    });

    


};
