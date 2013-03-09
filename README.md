# grunt-rerun [![Build Status](https://travis-ci.org/ArtoAle/grunt-rerun.png)](https://travis-ci.org/ArtoAle/grunt-rerun)

> Launch, relaunch and stop grunt task.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-rerun --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-rerun');
```

## The "rerun" task

### Overview
In your project's Gruntfile, add a section named `rerun` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  rerun: {
      yourtarget: {
        options: {
          tasks: ['express'],
          keepalive: false,
          port: 12456
        },
      },
    },
})
```

### Options

#### options.task
Type: `Array`
Default value: []

An array of grunt task to be 're-run'. Those should be long-living grunt task (like testacular server, express with keepalive and so on)

#### options.keepalive
Type: `Boolean`
Default value: `false`

Wheter or not the rerun task should block or not. The preferred way is to leave `keepalive` to false and to useit in conjunction
with other long-living task like `watch`

#### options.port
Type: `Number`
Default value: `1247`

The default port used for internal communication. The `rerun:target` task will launch a server listening on this port, wich will 
recive further comunication via the `rerun:target:task:go` task. 
### Usage Examples

In this example, the default options are used to so keepalive will be `false` and the port used internally will be `1247`. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  watch: {
      dev: {
        files: ['server/*.js'],

        //Note the :go flag used for sending the reload message to the rerun server
        tasks: ['clean','rerun:dev:express:go']
      },
    },
    express: {
        dev: {
            options: {
                port: 3000,
                bases: ['/public'],
                keepalive: true,
                server: path.resolve('./server/app.js')
            }
        }
    },
    // Configuration to be run (and then tested).
    rerun: {
      dev: {
        options: {
          tasks: ['express']
        },
      },
    }
})
```


## Contributing
The project is in very ealry stage, so any suggestion, pull request and issue are welcomed. 
Please use github for any communication

## Release History
_(Nothing yet)_
