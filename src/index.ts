import { run } from '@cycle/xstream-run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

import { makeWebsocketDriver } from './websocketDriver';

import { Component } from './interfaces';
import { App } from './app';

const url = windows.location.split('/')[2];

const main : Component = App;

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
    websocket: makeWebsocketDriver('ws://' + url + '/websocket')
};

run(main, drivers);
