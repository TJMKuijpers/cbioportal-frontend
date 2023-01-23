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
import { action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { IMutationalCounts } from 'shared/model/MutationalSignature';

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
    refStatus: boolean;
    data: IMutationalCounts[];
    version: string;
}

export interface colorMapProps {
    name: string;
    color: string;
}

const colorMap: colorMapProps[] = [
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
    { name: '2bp deletion at repeats', color: '#f1948a' },
    { name: '3bp deletion at repeats', color: '#ec7063' },
    { name: '4bp deletion at repeats', color: '#e74c3c' },
    { name: '5bp deletion at repeats', color: '#cb4335' },
    { name: '2bp Insertion at repeats', color: '#aed6f1' },
    { name: '3bp Insertion at repeats', color: '#85c1e9' },
    { name: '4bp Insertion at repeats', color: '#85c1e9' },
    { name: '5bp Insertion at repeats', color: '#3498db' },
    { name: 'Microhomology (Deletion length 2)', color: '#c39bd3' },
    { name: 'Microhomology (Deletion length 3)', color: '#9b59b6' },
    { name: 'Microhomology (Deletion length 4)', color: '#7d3c98' },
    { name: 'Microhomology (Deletion length 5+)', color: '#4a235a' },
];

// This function will need a reference signature
export function transformMutationalSignatureData(dataset: IMutationalCounts[]) {
    let transformedDataSet = dataset.map((obj: IMutationalCounts) => {
        var referenceTransformed = -Math.abs(obj.count);
        return { ...obj, referenceTransformed };
    });
    return transformedDataSet;
}

export function getColorsForSignatures(dataset: IMutationalCounts[]) {
    let colorTableData = dataset.map((obj: any) => {
        let colorIdentity = colorMap.filter(cmap => {
            if (cmap.name === obj.mutationalSignatureClass) {
                return cmap.color;
            }
        });
        let label = obj.mutationalSignatureLabel;
        let colorValue =
            colorIdentity.length > 0 ? colorIdentity[0].color : '#EE4B2B';
        return { ...obj, colorValue, label };
    });
    const colorTableDataSorted = _.sortBy(
        colorTableData,
        'mutationalSignatureClass'
    );
    return colorTableDataSorted;
}

@observer
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    constructor(props: IMutationalBarChartProps) {
        super(props);
    }

    @action formatLegendColor(data: colorMapProps[]) {
        let labelsPresent = this.props.data.map(obj => {
            return obj.mutationalSignatureClass;
        });
        let dataLegend = data.filter((obj2: any) => {
            if (labelsPresent.includes(obj2.name)) {
                return obj2;
            }
        });
        let legend = dataLegend.map((obj: any) => {
            let entry = {
                name: obj.name,
                symbol: { fill: obj.color },
            };
            return entry;
        });
        return legend;
    }
    @action yAxisDomain(): number[] {
        const maxValue = this.props.data.reduce(
            (previous: any, current: any) => {
                return current.count > previous.count ? current : previous;
            }
        );
        const minValue = this.props.data.reduce(
            (previous: any, current: any) => {
                return current.count < previous.count ? current : previous;
            }
        );
        return [minValue.count, maxValue.count];
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
                        x={this.props.width / 5}
                        y={this.props.refStatus ? 400 : 400}
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
                        style={[{ fill: 'black', fontSize: 18 }]}
                        textAnchor="middle"
                        text={
                            'Mutational Signature of ' +
                            this.props.data[0].patientId
                        }
                    />
                    <VictoryStack>
                        <VictoryBar
                            labelComponent={<VictoryTooltip />}
                            barRatio={0.8}
                            barWidth={5}
                            data={getColorsForSignatures(this.props.data)}
                            x="label"
                            y="count"
                            style={{
                                data: {
                                    fill: (d: any) => d.colorValue,
                                    stroke: 'black',
                                    strokeWidth: 0.4,
                                },
                            }}
                        />
                        {this.props.refStatus && (
                            <VictoryBar
                                labelComponent={<VictoryTooltip />}
                                barRatio={0.8}
                                barWidth={1}
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
                    {this.props.refStatus && (
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
                    {!this.props.refStatus && (
                        <VictoryAxis
                            dependentAxis
                            domain={this.yAxisDomain()}
                            label={'Mutation count'}
                            style={{
                                axis: { stroke: 'black', strokeWidth: 1 },
                                grid: { stroke: 'grey', strokeWidth: 0.5 },
                                axisLabel: { padding: 40 },
                            }}
                        />
                    )}
                    {this.props.refStatus && (
                        <VictoryAxis
                            offsetX={70}
                            domain={[0, 50]}
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: 'white', strokeWidth: 2 },
                            }}
                        />
                    )}
                    {!this.props.refStatus && (
                        <VictoryAxis
                            domain={[0, 100]}
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: 'black', strokeWidth: 2 },
                            }}
                        />
                    )}
                </VictoryChart>
            </div>
        );
    }
}
