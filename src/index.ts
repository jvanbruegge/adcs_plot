import xs, { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { timeDriver } from '@cycle/time';

import { makeWebsocketDriver } from './websocketDriver';
import { Component, WebsocketData, Sources, Sinks, State } from './interfaces';

import { App } from './app';

//const url : string = window.location.href.split('/')[2].split(':')[0];
const url : string = '192.168.0.4';
console.log(url);

const main : Component = addState(App);

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    Time: timeDriver,
    websocket: makeWebsocketDriver('ws://' + url + ':4000')
};

run(main, drivers);

function addState(fn : Component) : Component
{
    return sources => {
        const stateProxy$ : Stream<WebsocketData> = xs.create<WebsocketData>();
        const state$ : Stream<State> = stateProxy$
            .fold(foldData, initialState());
        
        const sinks : Sinks = fn({ ...sources, state: state$ });
        stateProxy$.imitate(sinks.state);

        return sinks;
    };
}

function initialState() : State
{
    return {
        domains: Array(24).fill([0, 1] as [number, number]),
        values: Array(24).fill([])
    };
}

function foldData(acc : State, curr : WebsocketData) : State
{
    const flatData : [Date, number][] = flattenData(curr)
        .map(d => [curr.time, d] as [Date, number]);
    const domains : [number, number][] = acc.domains.map((d, i) => {
        return [
            Math.min(d[0], flatData[i][1]),
            Math.max(d[1], flatData[i][1])
        ] as [number, number];
    });
    const values : [Date, number][][] = acc.values.map((data, i) => [flatData[i], ...data]);
    return {
        domains: domains,
        values: values
    };
}

function flattenData(data : WebsocketData) : number[]
{
    return [
        data.accel.x, data.accel.y, data.accel.z,
        data.gyro.x, data.gyro.y, data.gyro.z,
        data.magVector.x, data.magVector.y, data.magVector.z,
        data.sunVector.x, data.sunVector.y, data.sunVector.z,
        data.temp.bmx, data.temp.t1, data.temp.t2, data.temp.t3,
        data.magRaw.x, data.magRaw.y, data.magRaw.z, data.magRaw.r,
        data.sunRaw.pad0, data.sunRaw.pad1, data.sunRaw.pad2, data.sunRaw.pad3
    ];
}
