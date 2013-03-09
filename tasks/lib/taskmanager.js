/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

module.exports = function taskManager(taskList, grunt) {
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

    function isRunning(task) {
        var taskProcess = tasks[task];
        return taskProcess.status === 'RUNNING' && taskProcess.child; 
    }

    return {
        startOne: startTask,
        stopOne: stopTask,
        isRunning: isRunning
    };
};
