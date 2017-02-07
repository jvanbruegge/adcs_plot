import xs, { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

import { makeWebsocketDriver } from './websocketDriver';
import { Component, WebsocketData, Sources, Sinks } from './interfaces';

import { App } from './app';

const url : string = window.location.href.split('/')[2];

const main : Component = addState(App);

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    websocket: makeWebsocketDriver('ws://' + url + '/websocket')
};

run(main, drivers);

function addState(fn : Component) : Component
{
    return sources => {
        const stateProxy$ : Stream<WebsocketData> = xs.create<WebsocketData>();
        const state$ : Stream<WebsocketData[]> = stateProxy$
            .fold((acc, curr) => [curr, ...acc], []);
        
        const sinks : Sinks = fn({ ...sources, state: state$ });
        stateProxy$.imitate(sinks.state);

        return sinks;
    };
}
