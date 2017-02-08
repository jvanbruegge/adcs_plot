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
        dataFilter: getDataFilter('accel')
    })(sources);

    const gyroSinks : Sinks = createGraph({
        heading: 'Gyroscope',
        yScaleText: '',
        dataFilter: getDataFilter('gyro')
    })(sources);

    const magVectorSinks : Sinks = createGraph({
        heading: 'Magnet Vector',
        yScaleText: '',
        dataFilter: getDataFilter('magVector')
    })(sources);

    const sunVectorSinks : Sinks = createGraph({
        heading: 'Sun Vector',
        yScaleText: '',
        dataFilter: getDataFilter('sunVector')
    })(sources);

    const tempSinks : Sinks = createGraph({
        heading: 'Temperature',
        yScaleText: 't in °C',
        dataFilter: getDataFilter('temp')
    })(sources);

    const magRawSinks : Sinks = createGraph({
        heading: 'Raw Magnet Values',
        yScaleText: '',
        dataFilter: getDataFilter('magRaw')
    })(sources);

    const sunRawSinks : Sinks = createGraph({
        heading: 'Raw Sun Values',
        yScaleText: '',
        dataFilter: getDataFilter('sunRaw')
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
