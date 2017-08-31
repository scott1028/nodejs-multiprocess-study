#!/usr/bin/env node
'use strict';


const cluster = require('cluster');


if(cluster.isMaster) {
    console.log('I am master');
    // Pass parameter to worker.
    // Ref: https://stackoverflow.com/questions/12495231/node-js-fork-function-and-passing-arguments-to-child-process
    cluster.fork({preload: JSON.stringify({ b: 1 })});
    cluster.fork({preload: JSON.stringify({ b: 2 })});

    // will no exit master process util this worker is end. You can invoke process.exit() in the worker to make master not to be blocking.
} else if(cluster.isWorker) {
    console.log(`I am worker #${cluster.worker.id}, wid is: ${process.env.preload}`);
    console.log(JSON.parse(process.env.preload));
    // make worker to be end and the master will not be blocked there.
    process.exit();
}
