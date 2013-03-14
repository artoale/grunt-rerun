/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

'use strict';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      prova: {
        files: ['tasks/*.js'],
        tasks: ['clean','rerun:default_options:connect:go']
      },
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },
    connect: {
      pippo: {
        options: {
          port: 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: 'localhost',
          keepalive: true,
          middleware: function (connect) {
            return [
            mountFolder(connect, 'test'), ];
          }
        }
      }

    },
    // Configuration to be run (and then tested).
    rerun: {
      default_options: {
        options: {
          tasks: ['clean', 'connect'],
          keepalive: false,
        },
      },
      test: {
        options: {
          tasks: ['clean', 'connect'],
          keepalive: false,
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'nodeunit']);
  grunt.registerTask('prova',['rerun','watch']);
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
