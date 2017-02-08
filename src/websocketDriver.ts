import xs, { Stream } from 'xstream';

import { WebsocketData, Vector } from './interfaces';

export function makeWebsocketDriver(url : string) : () => Stream<WebsocketData>
{
    const websocket : WebSocket = new WebSocket(url);

    return () => {
        return xs.create({
            start: listener => {
                websocket.onmessage = (msg : MessageEvent) => listener.next(msg);
            },
            stop: () => {}
        })
        .map((msg : MessageEvent) => {
            const json : any = JSON.parse(msg.data);
            return {
                ...json,
                time: new Date(json.time)
            };
        });
    };
}

function createRandomWebsocketData() : WebsocketData
{
    return {
        time: new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60 * 0.5),
        accel: randomVector(),
        gyro: randomVector(),
        magVector: randomVector(),
        sunVector: randomVector(),
        temp: {
            bmx: Math.random(),
            t1: Math.random(),
            t2: Math.random(),
            t3: Math.random()
        },
        magRaw: { ...randomVector(), r: Math.random() },
        sunRaw: {
            pad0: Math.random(),
            pad1: Math.random(),
            pad2: Math.random(),
            pad3: Math.random()
        }
    };
}

function randomVector() : Vector
{
    return {
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
    };
}
