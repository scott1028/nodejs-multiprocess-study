#!/usr/bin/env node
'use strict';


const { spawn, fork } = require('child_process');
// const fs = require('fs');


// parallel task#1
function testcaseShell(){
    const ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.log(ls.killed);
    });
};

// parallel task#2
function testcaseModule(){
    const sp = fork('./worker.js');
    sp.send('./sample01.js');
    sp.on('message', function(e){
        console.log('Receive Buffer: ', new Buffer(e.data));
    });
    sp.on('close', function(e){
        console.log();
        console.log(`child process closed!`);
    })
};

// main
testcaseModule();
testcaseShell();
