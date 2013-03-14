/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */


module.exports = function taskJob(gruntTask, options, taskman, server, logger) {

    //tasks option must be an array
    if (!Array.isArray(options.tasks)) {
        logger.error('Error in configuration: tasks option should be an array');
        return false;
    }

    if (gruntTask.flags.go || gruntTask.flags.stop || gruntTask.flags.start ) {
        var done = gruntTask.async();
        var uri = '/' + gruntTask.args.join(':');
        var opt = {

            hostname: options.hostname,
            port: options.port,
            path: uri,
            method: 'POST'
        };

        var req = require('http').request(opt);
        req.on('error', function (e) {
            logger.error('problem with request: ' + e.message);
        });
        req.end();
        return true;

    }



    options.tasks.forEach(function (taskname) {
        taskman.startOne(taskname);
    });

    server.listen();

    if (options.keepalive) {
        logger.writeln('Rerun is running forever. Hit Crt-C to stop it');
        gruntTask.async();
    }

};
