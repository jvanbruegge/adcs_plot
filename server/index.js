const ws = require('nodejs-websocket');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var connections = [];

const server = ws.createServer(function(conn){
    console.log('New connection');
    connections.push(conn);

    conn.on('close', function() {
        connections.splice(connections.indexOf(conn), 1);
    });
}).listen(4000);

process.stdin.on('data', function(chunk) {
    connections.forEach(function(conn) {
        conn.sendText(JSON.stringify(parseChunk(chunk)));
    });
});

process.stdin.on('end', function() {
    console.log('input ended')
});


var start = 2;

function parseChunk(chunk) {
    const res = {
        time: new Date(),
        accel: {
            x: readValue('ay=', chunk),
            y: readValue('az=', chunk),
            z: readValue('gx=', chunk),
        },
        gyro: {
            x: readValue('gy=', chunk),
            y: readValue('gz=', chunk),
            z: readValue('mx=', chunk),
        },
        magVector: {
            x: readValue('my=', chunk),
            y: readValue('mz=', chunk),
            z: readValue('sx=', chunk),
        },
        sunVector: {
            x: readValue('sy=', chunk),
            y: readValue('sz=', chunk),
            z: readValue('tbmx=', chunk),
        },
        temp: {
            bmx: readValue('t1=', chunk, 5),
            t1: readValue('t2=', chunk),
            t2: readValue('t3=', chunk),
            t3: readValue('mrx=', chunk),
        },
        magRaw: {
            x: readValue('mry=', chunk, 4),
            y: readValue('mrz=', chunk, 4),
            z: readValue('mrr=', chunk, 4),
            r: readValue('sv0=', chunk, 4),
        },
        sunRaw: {
            pad0: readValue('sv1=', chunk, 4),
            pad1: readValue('sv2=', chunk, 4),
            pad2: readValue('sv3=', chunk, 4),
            pad3: parseFloat(chunk.substring(start + 4, chunk.length).trim())
        }
    };
    start = 2;
    return res;
}

function readValue(end, chunk, additional) {
    additional = additional || 3;
    return parseFloat(chunk.substring(start + additional, (start = chunk.indexOf(end)) - 1));
}
