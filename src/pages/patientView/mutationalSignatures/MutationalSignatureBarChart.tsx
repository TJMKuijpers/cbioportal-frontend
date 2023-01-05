import * as React from 'react';
import { VictoryBar, VictoryAxis, VictoryChart, VictoryLabel } from 'victory';
import { computed } from 'mobx';

export type DataMutSig = {
    id: string;
    value: number;
};
export interface IMutationalBarChartProps {
    width: number;
    height: number;
}
const test1 = [0, 10, 20, 30, 40, 50];

const sigData = [
    { id: 'a>c', y: 10 },
    { id: 'a>t', y: 25 },
    { id: 'c>t', y: 40 },
    { id: 'c>g', y: 50 },
    { id: 't>g', y: 50 },
];

// Mutational bar chart will visualize the mutation count per signature
// Input: data object per signature with an id (base mutation) and a value (count)
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    @computed getXValues() {
        // calculate the xticks based on the mutation names
        var xValues = sigData.map(obj => {
            return obj.id;
        });
        var xValues = sigData.map(obj => {
            return obj.id;
        });
        return xValues;
    }

    public render() {
        return (
            <VictoryChart
                domainPadding={10}
                padding={{ top: 50, bottom: 50, right: 0, left: 50 }}
                data={sigData}
            >
                <VictoryLabel
                    x={225}
                    y={25}
                    textAnchor="middle"
                    text="Signature: "
                />
                <VictoryBar style={{ data: { fill: 'tomato', width: 25 } }} />
                <VictoryAxis dependentAxis tickValues={test1} />
                <VictoryAxis
                    tickFormat={this.getXValues}
                    tickValues={[0.1, 1, 2, 3, 4]}
                />
            </VictoryChart>
        );
    }
}
