'use strict';

const fs = require('fs');


process.on('message', (fileName) => {
    var tmp = new Buffer([]);
    // Buffer.concat([new Buffer([1]), new Buffer([2])])
    var input = fs.createReadStream(fileName);
    input.on('data', function(data){
        console.log(data);
        tmp = Buffer.concat([data]);
    });
    input.on('error', function(err){
        console.log(`error=>`, err);
    });
    input.on('end', function() {
        console.log();
        console.log('Total Buffer: ', tmp);
        console.log();
        process.send(tmp);
        process.exit();
    });
});
