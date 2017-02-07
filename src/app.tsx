import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

import { Sources, Sinks } from './interfaces';

import { Graphs } from './graphs';

export function App(sources : Sources) : Sinks
{
    const { websocket } = sources;

    const graphs : Sinks = Graphs(sources);

    return {
        ...graphs,
        state: websocket
    };
}
