#!/usr/bin/env node
'use strict';


const cluster = require('cluster');


if(cluster.isMaster) {
    console.log('I am master');

    var poolSize = 4;

    new Promise(function(res, rej){
        let flag = 0;
        // detect worker is end.
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            console.log('The end');
            flag += 1;
            if(flag === poolSize)
                res(flag);
        });
    }).catch((e) => rej(e)).then(function(val){
        console.log(val, `Total worker is done! ( all task is done! )`);
    });

    // Pass parameter to worker.
    // Ref: https://stackoverflow.com/questions/12495231/node-js-fork-function-and-passing-arguments-to-child-process
    for(let i = 0; i < poolSize; i++){
        cluster.fork({preload: JSON.stringify({ b: i + 1 })});
    }

    // will no exit master process util this worker is end. You can invoke process.exit() in the worker to make master not to be blocking.
    console.log('Final line For master');
} else if(cluster.isWorker) {
    console.log(`I am worker #${cluster.worker.id}, wid is: ${process.env.preload}`);
    console.log(JSON.parse(process.env.preload));

    // make worker to be end and the master will not be blocked there.
    let time = 1000 * JSON.parse(process.env.preload).b;
    console.log(`Time: ${time}`);
    setTimeout(()=> process.exit(), time);
}

console.log('Final line For all');
