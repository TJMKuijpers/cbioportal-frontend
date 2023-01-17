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
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

export type DataMutSig = {
    id: string;
    count: number;
    reference: number;
    label: string;
};

export type DataTableSignature = {
    id: string;
    count: number;
    reference: number;
    label: string;
    color: string;
};

export interface IMutationalBarChartProps {
    signature: string;
    width: number;
    height: number;
    refstatus: boolean;
    data: DataMutSig[];
    version: string;
}

const colorMap = [
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
    { name: '1bp Deletion (C)', color: '#f39c12' },
    { name: '1bp Deletion (T)', color: '#d68910' },
    { name: '1bp Insertion (C)', color: '#82E0AA' },
    { name: '1bp Insertion (C)', color: '#28b463' },
    { name: '1bp deletion at repeats (2)', color: '#f1948a' },
    { name: '1bp deletion at repeats (3)', color: '#ec7063' },
    { name: '1bp deletion at repeats (4)', color: '#e74c3c' },
    { name: '1bp deletion at repeats (5+)', color: '#cb4335' },
    { name: '1bp Insertion at repeats (2)', color: '#aed6f1' },
    { name: '1bp Insertion at repeats (3)', color: '#85c1e9' },
    { name: '1bp Insertion at repeats (4)', color: '#85c1e9' },
    { name: '1bp Insertion at repeats (5+)', color: '#3498db' },
    { name: 'microhomology deletion length 2', color: '#c39bd3' },
    { name: 'microhomology deletion length 3', color: '#9b59b6' },
    { name: 'microhomology deletion length 4', color: '#7d3c98' },
    { name: 'microhomology deletion length 5+', color: '#4a235a' },
];

export function transformMutationalSignatureData(dataset: any) {
    let transformedDataSet = dataset.map((obj: DataMutSig) => {
        var referenceTransformed = -Math.abs(obj.reference);
        return { ...obj, referenceTransformed };
    });
    return transformedDataSet;
}

function getColorsForSignatures(dataset: any) {
    let colorTableData = dataset.map((obj: any) => {
        let colorIdentity = colorMap.filter(cmap => {
            if (cmap.name === obj.label) {
                return cmap.color;
            }
        });
        let colorValue =
            colorIdentity.length > 0 ? colorIdentity[0].color : '#EE4B2B';
        return { ...obj, colorValue };
    });
    return colorTableData;
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

    @action formatLegendColor(data: any) {
        let labelsPresent = this.props.data.map(obj => {
            return obj.label;
        });
        let dataLegend = data.filter((obj2: any) => {
            if (labelsPresent.includes(obj2.name)) {
                return obj2;
            }
        });
        let legend = dataLegend.map((obj: any) => {
            let entry = { name: obj.name, symbol: { fill: obj.color } };
            return entry;
        });
        return legend;
    }

    public render() {
        return (
            <div>
                <VictoryChart
                    domainPadding={10}
                    padding={{ top: 30, bottom: 100, right: 50, left: 50 }}
                    height={this.props.height}
                    width={this.props.width}
                >
                    <VictoryLegend
                        x={this.props.width / 2.5}
                        y={this.props.refstatus ? 500 : 500}
                        centerTitle
                        orientation="horizontal"
                        gutter={20}
                        style={{ title: { fontSize: 20 } }}
                        itemsPerRow={6}
                        data={this.formatLegendColor(colorMap)}
                    />

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
                            data={getColorsForSignatures(this.props.data)}
                            x="id"
                            y="count"
                            style={{
                                data: {
                                    fill: (d: any) => d.colorValue,
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
                            label={'Mutation count'}
                            style={{
                                axis: { stroke: 'black', strokeWidth: 1 },
                                grid: { stroke: 'grey', strokeWidth: 0.5 },
                                axisLabel: { padding: 40 },
                            }}
                        />
                    )}
                    {!this.props.refstatus && (
                        <VictoryAxis
                            dependentAxis
                            domain={[0, 100]}
                            label={'Mutation count'}
                            style={{
                                axis: { stroke: 'black', strokeWidth: 1 },
                                grid: { stroke: 'grey', strokeWidth: 0.5 },
                                axisLabel: { padding: 40 },
                            }}
                        />
                    )}
                    {this.props.refstatus && (
                        <VictoryAxis
                            domain={[0, 50]}
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: 'white', strokeWidth: 2 },
                            }}
                        />
                    )}
                    {!this.props.refstatus && (
                        <VictoryAxis
                            domain={[0, 50]}
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: 'black', strokeWidth: 1 },
                            }}
                        />
                    )}
                </VictoryChart>
            </div>
        );
    }
}
