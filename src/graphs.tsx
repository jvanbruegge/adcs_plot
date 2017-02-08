import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { filterProp, mergeSinks } from 'cyclejs-utils';

import { Sources, Sinks, Component, WebsocketData } from './interfaces';

import { createGraph } from './graph';

export function Graphs(sources : Sources) : Sinks
{
    const accelSinks : Sinks = createGraph({
        heading: 'Accelerometer',
        yScaleText: '',
        dataIndex: [0, 1, 2]
    })(sources);

    const gyroSinks : Sinks = createGraph({
        heading: 'Gyroscope',
        yScaleText: '',
        dataIndex: [3, 4, 5]
    })(sources);

    const magVectorSinks : Sinks = createGraph({
        heading: 'Magnet Vector',
        yScaleText: '',
        dataIndex: [6, 7, 8]
    })(sources);

    const sunVectorSinks : Sinks = createGraph({
        heading: 'Sun Vector',
        yScaleText: '',
        dataIndex: [9, 10, 11]
    })(sources);

    const tempSinks : Sinks = createGraph({
        heading: 'Temperature',
        yScaleText: 't in °C',
        dataIndex: [12, 13, 14, 15]
    })(sources);

    const magRawSinks : Sinks = createGraph({
        heading: 'Raw Magnet Values',
        yScaleText: '',
        dataIndex: [16, 17, 18, 19]
    })(sources);

    const sunRawSinks : Sinks = createGraph({
        heading: 'Raw Sun Values',
        yScaleText: '',
        dataIndex: [20, 21, 22, 23]
    })(sources);

    const vdom$ : Stream<VNode> = xs.combine(
        accelSinks.DOM,
        gyroSinks.DOM,
        magVectorSinks.DOM,
        sunVectorSinks.DOM,
        tempSinks.DOM,
        magRawSinks.DOM,
        sunRawSinks.DOM
    ).map(arr =>
        <div>
            { arr }
        </div>
    );

    const sinks : Sinks = filterProp(
        mergeSinks(
            accelSinks,
            gyroSinks,
            magVectorSinks,
            sunVectorSinks,
            tempSinks,
            magRawSinks,
            sunRawSinks
        ),
        'DOM'
    );

    return { ...sinks, DOM: vdom$ };
}

function getDataFilter(key : keyof WebsocketData) : (d : WebsocketData) => number[]
{
    return data => Object.keys(data[key]).map(k => data[key][k]);
}
