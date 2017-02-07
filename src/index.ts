import { run } from '@cycle/xstream-run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

import { makeWebsocketDriver } from './websocketDriver';
import { Component, WebsocketData } from './interfaces';

import { App } from './app';

const url = windows.location.split('/')[2];

const main : Component = addState(App);

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
    websocket: makeWebsocketDriver('ws://' + url + '/websocket')
};

run(main, drivers);

function addState(main : Component) : Component
{
    return sources => {
        const stateProxy$ : Stream<WebsocketData[]> = xs.create();
        const sinks : Sinks = main({ ...sources, state: stateProxy$ });
        const state$ : Stream<WebsocketData[]> = sinks.state
            .fold((acc, curr) => [curr, ...acc], []);
        stateProxy$.imitate(state$);
    };
}
