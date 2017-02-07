import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

import { Sources, Sinks } from './interfaces';

export function App(sources : Sources) : Sinks
{
    const { websocket } = sources;
    const vdom$ : Stream<VNode> = xs.of(
        <div>My Awesome Cycle.js app</div>
    );

    return {
        DOM: vdom$
        state: websocket;
    };
}
