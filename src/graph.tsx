/** @jsx snabb.svg */
import xs, { Stream } from 'xstream';
import { scaleTime, scaleLinear, ScaleLinear, ScaleTime } from 'd3-scale';
import { line, Line } from 'd3-shape';
import { VNode } from '@cycle/dom';

import { Sources, Sinks, Component, WebsocketData } from './interfaces';

export interface GraphInfo {
    heading : string;
    yScaleText : string;
    dataFilter : (d : WebsocketData) => number[];
}

export interface Scales {
    x : ScaleTime<number, number>;
    y : ScaleLinear<number, number>;
}

export type DataPoint = [number, number];

const colors : string[] = [
    'red',
    'green',
    'blue',
    'black'
];

export function createGraph(info : GraphInfo) : Component
{
    return function({ state } : Sources) : Sinks
    {
        const scale$ : Stream<Scales> = state.map(data => ({
            x: scaleTime()
                .domain([new Date(), hoursAgo(0.1)])
                .range([0, 2000]),
            y: scaleLinear()
                .domain(getDomain(data, info))
                .range([0, 400])
        }));

        const scaledData$ : Stream<DataPoint[][]> = xs.combine(scale$, state)
            .map(([scales, arr]) => arr.map(data => {
                const x : number = scales.x(data.time);
                return info.dataFilter(data).map(v => [x, scales.y(v)] as DataPoint);
            }));

        const path$ : Stream<VNode[]> = scaledData$
            .map<DataPoint[][]>(data => data.reduce((acc, curr) => {
                return curr.map((p, i) => [...(acc[i] ? acc[i] : []), p]);
            }, []))
            .map<string[]>(data => data.map(arr => line<DataPoint>()(arr)))
            .map<VNode[]>(lines => lines.map((s, i) => {
                return <path
                    d={ s }
                    stroke={ colors[i] }
                    class-path={ true }
                />;
            }));

        const vdom$ : Stream<VNode> = path$
            .map(paths =>
                <svg
                    viewBox='0 0 2000 400'
                    preserveAspectRatio='xMinYMin slice'
                    class-graph={ true }
                >
                    { paths }
                </svg>
            );

        return {
            DOM: vdom$
        };
    };
}

function getDomain(data : WebsocketData[], info : GraphInfo) : [number, number]
{
    const mins : number[] = data.map(arr => {
        return info.dataFilter(arr).reduce((acc, curr) => curr < acc ? curr : acc, Infinity);
    });

    const maxs : number[] = data.map(arr => {
        return info.dataFilter(arr).reduce((acc, curr) => curr > acc ? curr : acc, -Infinity);
    });

    const min : number = mins.reduce((acc, curr) => curr < acc ? curr : acc, Infinity);
    const max : number = maxs.reduce((acc, curr) => curr > acc ? curr : acc, -Infinity);
    return min !== max ? [min, max] : [min - 1, max + 1];
}

function hoursAgo(count : number) : Date
{
    return new Date(
        new Date().getTime() - 1000 * 60 * 60 * count
    );
}
