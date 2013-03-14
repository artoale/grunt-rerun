/*
 * grunt-rerun
 * https://github.com/ArtoAle/grunt-rerun
 *
 * Copyright (c) 2013 Alessandro Artoni
 * Licensed under the MIT license.
 */

module.exports = function server(taskman, options, grunt) {
    var http = require('http');
    var switcher = {
        go: function (task) {
            var status = taskman.stopOne(task);
            return taskman.startOne(task) && status;
        },
        stop: function (task) {
            return taskman.stopOne(task);
        },
        start: function (task) {
            return taskman.startOne(task);
        }
    };
    var httpserver = http.createServer(function (req, res) {
        var command = req.url.substr(1);
        var commandlist = command.split(':');
        var task = commandlist[0];
        if (commandlist[1] && switcher[commandlist[1]]) {
            var status = switcher[commandlist[1]](task);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            if (status) {
                res.end(JSON.stringify({
                    result: !!status,
                    msg: "Done"
                }));
            } else {
                res.end(JSON.stringify({
                    result: !!status,
                    msg: "Error"
                }));
            }
        } else {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify({
                result: false,
                msg: 'Missing command or command unknown'
            }));
        }

    });

    return {
        listen: function () {
            httpserver.listen(options.port, "127.0.0.1");
            grunt.log.writeln('Server listening on http://' + '127.0.0.1'.green + ':' + (options.port + '').yellow + '/');
        }
    };


};
