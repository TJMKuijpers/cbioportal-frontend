import * as React from 'react';
import {
    VictoryBar,
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryStack,
    VictoryTooltip,
} from 'victory';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

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
    data: DataMutSig[];
}

export function transformMutationalSignatureData(dataset: any) {
    let transformedDataSet = dataset.map((obj: DataMutSig) => {
        var referenceTransformed = -Math.abs(obj.reference);
        return { ...obj, referenceTransformed };
    });
    return transformedDataSet;
}

// Mutational bar chart will visualize the mutation count per signature
// Input: data object per signature with an id (base mutation) and a value (count)
@observer
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    constructor(props: IMutationalBarChartProps) {
        super(props);
    }

    public render() {
        if (this.props.refstatus) {
            return (
                <div>
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
                                data={transformMutationalSignatureData(
                                    this.props.data
                                )}
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
                                data={transformMutationalSignatureData(
                                    this.props.data
                                )}
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
                </div>
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
                            data={this.props.data}
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
