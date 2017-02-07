import { Stream } from 'xstream';

import { Sources, Sinks, Component } from './interfaces';

import { createGraph } from './graph';

export function Graphs(sources : Sources) : Sinks
{
    const tempSinks : Sinks = createGraph({
        heading: 'Temperature',
        yScaleText: 't in °C',
        yDomain: [0, 1],
        dataFilter: data => Object.keys(data.temp).map(k => data.temp[k])
    })(sources);

    return tempSinks;
}
