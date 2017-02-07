import xs, { Stream } from 'xstream';

import { WebsocketData, Vector } from './interfaces';

const testData : WebsocketData[] = [
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData(), 
   createRandomWebsocketData()
].slice(0).sort((a, b) => b.time.getTime() - a.time.getTime());

export function makeWebsocketDriver(url : string) : () => Stream<WebsocketData>
{
    //const websocket : WebSocket = new WebSocket(url);

    return () => {
        return xs.merge(/*xs.create({
            start: listener => {
                websocket.onmessage = (msg : MessageEvent) => listener.next(msg);
            },
            stop: () => {}
        }) 
        .map((msg : MessageEvent) => JSON.parse(msg.data)),*/
            xs.fromArray(testData));
    };
}

function createRandomWebsocketData() : WebsocketData
{
    return {
        time: new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60 * 2),
        accel: randomVector(),
        gyro: randomVector(),
        magVector: randomVector(),
        sunVector: randomVector(),
        temp: {
            bmx: Math.random() * 100,
            t1: Math.random() * 100,
            t2: Math.random() * 100,
            t3: Math.random() * 100
        }
    };
}

function randomVector() : Vector
{
    return {
        x: Math.random() * 500,
        y: Math.random() * 500,
        z: Math.random() * 500
    };
}
