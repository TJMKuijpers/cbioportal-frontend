import * as React from 'react';
import {
    VictoryBar,
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryStack,
    VictoryTooltip,
    VictoryLegend,
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
    version: string;
}

const colormap = [
    { name: 'C>A', color: 'lightblue' },
    { name: 'C>G', color: 'darkblue' },
    { name: 'C>T', color: 'red' },
    { name: 'T>A', color: 'grey' },
    { name: 'T>C', color: 'green' },
    { name: 'T>G', color: 'pink' },
    { name: 'reference', color: '#1e97f3' },
    { name: 'AC>NN', color: 'skyblue' },
    { name: 'AT>NN', color: 'blue' },
    { name: 'CC>NN', color: 'green' },
    { name: 'CG>NN', color: 'darkgreen' },
    { name: 'CT>NN', color: 'pink' },
    { name: 'CG>NN', color: 'darkred' },
    { name: 'TA>NN', color: 'sand' },
    { name: 'TC>NN', color: 'orange' },
    { name: 'TG>NN', color: 'lila' },
    { name: 'TT>NN', color: 'purple' },
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
@observer
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    constructor(props: IMutationalBarChartProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <VictoryChart
                    domainPadding={10}
                    padding={{ top: 50, bottom: 80, right: 50, left: 50 }}
                    height={this.props.height}
                    width={this.props.width}
                >
                    {this.props.version === 'v3' && (
                        <VictoryLegend
                            x={this.props.width / 2}
                            y={this.props.refstatus ? 420 : 460}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{ title: { fontSize: 20 } }}
                            data={[
                                {
                                    name: 'Mutation profile',
                                    symbol: { fill: '#EE4B2B' },
                                },
                                {
                                    name: 'Reference profile',
                                    symbol: { fill: '#1e97f3' },
                                },
                            ]}
                        />
                    )}
                    {this.props.version === 'v2' && (
                        <VictoryLegend
                            x={this.props.width / 2.1}
                            y={this.props.refstatus ? 420 : 460}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{ title: { fontSize: 20 } }}
                            data={[
                                { name: 'C>A', symbol: { fill: 'lightblue' } },
                                { name: 'C>G', symbol: { fill: 'darkblue' } },
                                { name: 'C>T', symbol: { fill: 'red' } },
                                { name: 'T>A', symbol: { fill: 'grey' } },
                                { name: 'T>C', symbol: { fill: 'green' } },
                                { name: 'T>G', symbol: { fill: 'pink' } },
                                {
                                    name: 'reference',
                                    symbol: { fill: '#1e97f3' },
                                },
                            ]}
                        />
                    )}

                    <VictoryLabel
                        x={this.props.width / 2}
                        y={25}
                        style={[{ fill: 'black', fontSize: 25 }]}
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
                                    fill: (d: any) =>
                                        d.label === 'C>A'
                                            ? 'lightblue'
                                            : d.label === 'C>G'
                                            ? 'darkblue'
                                            : d.label === 'C>T'
                                            ? 'red'
                                            : d.label === 'T>A'
                                            ? 'grey'
                                            : d.label === 'T>C'
                                            ? 'green'
                                            : d.label === 'T>G'
                                            ? 'pink'
                                            : '#EE4B2B',
                                    stroke: 'black',
                                    strokeWidth: 0.8,
                                },
                            }}
                        />
                        {this.props.refstatus && (
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
                        )}
                    </VictoryStack>
                    {this.props.refstatus && (
                        <VictoryAxis
                            dependentAxis
                            domain={[-100, 100]}
                            style={{
                                grid: { stroke: 'grey', strokeWidth: 0.5 },
                            }}
                        />
                    )}
                    {!this.props.refstatus && (
                        <VictoryAxis dependentAxis domain={[0, 100]} />
                    )}
                    <VictoryAxis
                        domain={[0, 50]}
                        tickFormat={() => ''}
                        style={{ axis: { stroke: 'white', strokeWidth: 2 } }}
                    />
                </VictoryChart>
            </div>
        );
    }
}
