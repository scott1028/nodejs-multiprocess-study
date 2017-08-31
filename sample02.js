#!/usr/bin/env node
'use strict';


var colors = require('colors');
const cluster = require('cluster');


if(cluster.isMaster) {
    console.log('I am master'.magenta);

    var poolSize = 4;

    new Promise(function(res, rej){
        let flag = 0;
        // detect worker is end.
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`.green);
            console.log('The end'.cyan);
            flag += 1;
            if(flag === poolSize)
                res(flag);
        });
    }).catch((e) => rej(e)).then(function(val){
        console.log(`Total: ${val} workers is done! ( all task is done! )`.cyan);
    });

    // Pass parameter to worker.
    // Ref: https://stackoverflow.com/questions/12495231/node-js-fork-function-and-passing-arguments-to-child-process
    for(let i = 0; i < poolSize; i++){
        let worker = cluster.fork({preload: JSON.stringify({ delta: i + 1 })});
        worker.send(new Date);  // pass obj, module, instance, etc, but the obj must can be serialize to a json.
    }

    // will no exit master process util this worker is end. You can invoke process.exit() in the worker to make master not to be blocking.
    console.log('Final line For master'.green);
} else if(cluster.isWorker) {
    console.log(`I am worker #${cluster.worker.id}, data is: ${process.env.preload}`.green);
    console.log(JSON.parse(process.env.preload));

    // make worker to be end and the master will not be blocked there.
    let time = 1000 * JSON.parse(process.env.preload).delta;
    console.log(`Time: ${time}`.magenta);
    process.on('message', function(data){
        console.log(`Got message from master:`.yellow, data);
    });
    setTimeout(()=> process.exit(), time);  // or your worker got a exception, or raise a exception.
}

console.log('Final line For all'.cyan);
