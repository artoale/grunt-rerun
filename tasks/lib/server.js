module.exports = function server(taskManager, options) {
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
                res.end('Done');
            } else {
                res.end('Error');
            }
        }).listen(options.port, "127.0.0.1");
        console.log('Server running at http://127.0.0.1:' + options.port + '/');
    };
