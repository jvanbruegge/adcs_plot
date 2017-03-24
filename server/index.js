const ws = require('nodejs-websocket');

const express = require('express');
const app = express();

app.use(express.static('build'));
app.listen(4000, () => {
    console.log('server runs on port 4000, websocket on 4001');
});

var connections = [];

const server = ws.createServer(function(conn){
    console.log('New connection');
    connections.push(conn);

    conn.on('close', function() {
        kickUser(conn);
    });
}).listen(4001);

setInterval(() => {
    const chunk = generateChunk();
    connections.forEach(function(conn) {
        try {
            conn.sendText(JSON.stringify(chunk));
        } catch(e) {
            kickUser(conn);
        }
    });
}, 333); //Update with 3Hz

function kickUser(conn) {
    console.log('Removed connection');
    connections.splice(connections.indexOf(conn), 1);
}

function generateChunk() {
    return {
        time: new Date(),
        accel: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        },
        gyro: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        },
        magVector: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        },
        sunVector: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        },
        temp: {
            bmx: Math.random(),
            t1: Math.random(),
            t2: Math.random(),
            t3: Math.random()
        },
        magRaw: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            r: Math.random()
        },
        sunRaw: {
            pad0: Math.random(),
            pad1: Math.random(),
            pad2: Math.random(),
            pad3: Math.random()
        }
    };
}
