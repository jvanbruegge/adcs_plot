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
                .domain([new Date(), hoursAgo(2)])
                .range([0, 500]),
            y: scaleLinear()
                .domain(info.yDomain)
                .range([0, 500])
        });

        const scaledData$ : Stream<DataPoint[][]> = xs.combine(scale$, state)
            .map(([scales, arr]) => arr.map(data => {
                const x : number = scales.x(data.time);
                return info.dataFilter(data).map(y => [x, y] as DataPoint);
            }));

        const path$ : Stream<VNode[]> = scaledData$
            .map<DataPoint[][]>(data => data.reduce((acc, curr) => {
                const a : (i : number) => DataPoint[] = i => (acc[i] ? acc[i] : []) as DataPoint[];
                return curr.map((p, i) => [...a(i), p]);
            }, []))
            .map<string[]>(data => data.map(arr => line<DataPoint>()(arr)))
            .map<VNode[]>(lines => lines.map((s, i) => {
                return <path
                    d={ s }
                    stroke={ colors[i] }
                    stroke-width='4'
                    fill='none'
                />;
            }));

        const vdom$ : Stream<VNode> = path$
            .map(paths =>
                <svg viewBox='0 0 500 500'>
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
