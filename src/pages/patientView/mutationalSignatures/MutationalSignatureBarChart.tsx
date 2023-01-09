import * as React from 'react';
import {
    VictoryBar,
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryStack,
    VictoryTooltip,
} from 'victory';
import { computed } from 'mobx';
import { BarDatum } from 'pages/studyView/charts/barChart/BarChart';

export type DataMutSig = {
    id: string;
    count: number;
    reference: number;
    label: string;
};

export interface IMutationalBarChartProps {
    signature: string;
    width: number;
    height: number;
    refstatus: boolean;
}

let sigData = [
    { id: 'a>c', count: 0, reference: 10, label: 'Mutation a>c' },
    { id: 'a>t', count: 0, reference: 25, label: 'Mutation a>t' },
    { id: 'a>g', count: 0, reference: 50, label: 'Mutation a>g' },
    { id: 't>g', count: 0, reference: 20, label: 'Mutation t>g' },
    { id: 't>c', count: 10, reference: 10, label: 'Mutation t>c' },
    { id: 't>a', count: 25, reference: 25, label: 'Mutation t>a' },
    { id: 'c>t', count: 40, reference: 80, label: 'Mutation c>t' },
    { id: 'c>a', count: 10, reference: 50, label: 'Mutation c>a' },
    { id: 'c>g', count: 30, reference: 30, label: 'Mutation c>g' },
    { id: 'g>c', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'g>t', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'g>a', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID1', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID2', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID3', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID4', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID5', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID6', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID7', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID8', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID9', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID10', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID11', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID12', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID13', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID14', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID15', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID16', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID17', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID18', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID19', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID20', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID21', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID22', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID23', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID24', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID25', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID26', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID27', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID28', count: 10, reference: 0, label: 'Mutation a>c' },
    { id: 'ID29', count: 30, reference: 0, label: 'Mutation a>c' },
    { id: 'ID30', count: 70, reference: 0, label: 'Mutation a>c' },
    { id: 'ID31', count: 5, reference: 0, label: 'Mutation a>c' },
    { id: 'ID32', count: 15, reference: 0, label: 'Mutation a>c' },
];

export function transformMutationalSignatureData(dataset: any) {
    let transformedDataSet = dataset.map((obj: DataMutSig) => {
        var referenceTransformed = -Math.abs(obj.reference);
        return { ...obj, referenceTransformed };
    });
    return transformedDataSet;
}

// Mutational bar chart will visualize the mutation count per signature
// Input: data object per signature with an id (base mutation) and a value (count)
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    public render() {
        if (this.props.refstatus) {
            return (
                <VictoryChart
                    domainPadding={10}
                    padding={{ top: 50, bottom: 50, right: 0, left: 50 }}
                    height={this.props.height}
                    width={this.props.width}
                >
                    <VictoryLabel
                        x={this.props.width / 2}
                        y={25}
                        textAnchor="middle"
                        text={this.props.signature}
                    />
                    <VictoryStack>
                        <VictoryBar
                            labelComponent={<VictoryTooltip />}
                            barRatio={0.8}
                            barWidth={5}
                            data={transformMutationalSignatureData(sigData)}
                            x="id"
                            y="count"
                            style={{
                                data: {
                                    fill: '#EE4B2B',
                                    stroke: 'black',
                                    strokeWidth: 0.8,
                                },
                            }}
                        />
                        <VictoryBar
                            labelComponent={<VictoryTooltip />}
                            barRatio={0.8}
                            barWidth={5}
                            data={transformMutationalSignatureData(sigData)}
                            x="id"
                            y="referenceTransformed"
                            style={{
                                data: {
                                    fill: '#1e97f3',
                                    stroke: 'black',
                                    strokeWidth: 0.8,
                                },
                            }}
                        />
                    </VictoryStack>
                    <VictoryAxis dependentAxis domain={[-100, 100]} />

                    <VictoryAxis domain={[0, 50]} tickFormat={() => ''} />
                </VictoryChart>
            );
        } else {
            return (
                <VictoryChart
                    domainPadding={10}
                    padding={{ top: 50, bottom: 50, right: 0, left: 50 }}
                    height={this.props.height}
                    width={this.props.width}
                >
                    <VictoryLabel
                        x={this.props.width / 2}
                        y={25}
                        textAnchor="middle"
                        text={this.props.signature}
                    />
                    <VictoryStack>
                        <VictoryBar
                            labelComponent={<VictoryTooltip />}
                            barRatio={0.8}
                            barWidth={5}
                            data={sigData}
                            x="id"
                            y="count"
                            style={{
                                data: {
                                    fill: '#EE4B2B',
                                    stroke: 'black',
                                    strokeWidth: 0.8,
                                },
                            }}
                        />
                    </VictoryStack>
                    <VictoryAxis dependentAxis domain={[0, 100]} />

                    <VictoryAxis domain={[0, 50]} tickFormat={() => ''} />
                </VictoryChart>
            );
        }
    }
}
