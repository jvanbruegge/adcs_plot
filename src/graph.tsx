/** @jsx snabb.svg */
import xs, { Stream } from 'xstream';
import { scaleTime, scaleLinear, ScaleLinear, ScaleTime } from 'd3-scale';
import { line, Line } from 'd3-shape';
import { VNode } from '@cycle/dom';

import { Sources, Sinks, Component, WebsocketData } from './interfaces';

export interface GraphInfo {
    heading : string;
    yScaleText : string;
    yDomain : [number, number];
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
        const scale$ : Stream<Scales> = xs.of({
            x: scaleTime()
                .domain([new Date(), hoursAgo(0.5)])
                .range([0, 2000]),
            y: scaleLinear()
                .domain(info.yDomain)
                .range([0, 400])
        });

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

function hoursAgo(count : number) : Date
{
    return new Date(
        new Date().getTime() - 1000 * 60 * 60 * count
    );
}
