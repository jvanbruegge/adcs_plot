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
   createRandomWebsocketData(),
   { ...createRandomWebsocketData(), time: new Date() }
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
