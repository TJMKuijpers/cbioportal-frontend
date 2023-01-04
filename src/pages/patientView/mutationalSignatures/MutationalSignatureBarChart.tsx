import * as React from 'react';
import { VictoryBar, VictoryChart } from 'victory';

export interface IMutationalBarChartProps {
    width: number;
    height: number;
}

export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    public render() {
        return (
            <VictoryChart
                domainPadding={10}
                domain={{ x: [0, 5], y: [0, 5] }}
                padding={{ top: 50, bottom: 50, right: 0, left: 50 }}
            >
                <VictoryBar
                    style={{ data: { fill: '#c43a31' } }}
                    alignment="middle"
                ></VictoryBar>
            </VictoryChart>
        );
    }
}
