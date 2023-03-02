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

export interface IMutationalBarChartProps {
    signature: string;
    width: number;
    height: number;
    refStatus: boolean;
    data: IMutationalCounts[];
    version: string;
}

export interface IColorDataBar extends IMutationalCounts {
    colorValue: string;
    label: string;
}

export interface colorMapProps {
    name: string;
    category: string;
    color: string;
}

const colorMap: colorMapProps[] = [
    {
        name: 'C>A',
        category: 'Single base substitution (C>A)',
        color: 'lightblue',
    },
    {
        name: 'C>G',
        category: 'Single base substitution (C>G)',
        color: 'darkblue',
    },
    { name: 'C>T', category: 'Single base substitution (C>T)', color: 'red' },
    { name: 'T>A', category: 'Single base substitution (T>A)', color: 'grey' },
    { name: 'T>C', category: 'Single base substitution (T>C)', color: 'green' },
    { name: 'T>G', category: 'Single base substitution (T>G)', color: 'pink' },
    { name: 'reference', category: 'reference', color: '#1e97f3' },
    {
        name: 'AC>',
        category: 'Doublet base substitution (AC>NN)',
        color: 'skyblue',
    },
    {
        name: 'AT>',
        category: 'Doublet base substitution (AT>NN)',
        color: 'blue',
    },
    {
        name: 'CC>',
        category: 'Doublet base substitution (CC>NN)',
        color: 'lightgreen',
    },
    {
        name: 'CG>',
        category: 'Doublet base substitution (CG>NN)',
        color: 'darkgreen',
    },
    {
        name: 'CT>',
        category: 'Doublet base substitution (CT>NN)',
        color: 'pink',
    },
    {
        name: 'CG>',
        category: 'Doublet base substitution (CG>NN)',
        color: 'darkred',
    },
    {
        name: 'TA>',
        category: 'Doublet base substitution (TA>NN)',
        color: 'sand',
    },
    {
        name: 'TC>',
        category: 'Doublet base substitution (TC>NN)',
        color: 'orange',
    },
    {
        name: 'TG>',
        category: 'Doublet base substitution (TG>NN)',
        color: 'lila',
    },
    {
        name: 'TT>',
        category: 'Doublet base substitution (TT>NN)',
        color: 'purple',
    },
    {
        name: 'GC>',
        category: 'Doublet base substitution (GC>NN)',
        color: 'gold',
    },
    { name: '1:Del:C', category: '1bp insertion (T)', color: '#f39c12' },
    { name: '1:Del:T', category: '1bp insertion (T)', color: '#d68910' },
    { name: '1:Ins:C', category: '1bp insertion (C)', color: '#82E0AA' },
    { name: '1:Ins:T', category: '1bp insertion (T)', color: '#28b463' },
    { name: '2:Del:R', category: '2bp deletion at repeats', color: '#f1948a' },
    { name: '3:Del:R', category: '3bp deletion at repeats', color: '#ec7063' },
    { name: '4:Del:R', category: '4bp deletion at repeats', color: '#e74c3c' },
    { name: '5:Del:R', category: '5bp deletion at repeats', color: '#cb4335' },
    { name: '2:Ins:M', category: '2bp insertion at repeats', color: '#aed6f1' },
    { name: '3:Ins:M', category: '3bp insertion at repeats', color: '#85c1e9' },
    { name: '4:Ins:M', category: '4bp insertion at repeats', color: '#85c1e9' },
    { name: '5:Ins:M', category: '5bp insertion at repeats', color: '#3498db' },
    {
        name: 'Microhomology (Deletion length 2)',
        category: 'Microhomology (Deletion length 2)',
        color: '#c39bd3',
    },
    {
        name: 'Microhomology (Deletion length 3)',
        category: 'Microhomology (Deletion length 3)',
        color: '#9b59b6',
    },
    {
        name: 'Microhomology (Deletion length 4)',
        category: 'Microhomology (Deletion length 4)',
        color: '#7d3c98',
    },
    {
        name: 'Microhomology (Deletion length 5)',
        category: 'Microhomology (Deletion length 5)',
        color: '#4a235a',
    },
];

export function transformMutationalSignatureData(dataset: IMutationalCounts[]) {
    const transformedDataSet = dataset.map((obj: IMutationalCounts) => {
        let referenceTransformed = -Math.abs(obj.count);
        return { ...obj, referenceTransformed };
    });
    return transformedDataSet;
}

export function getColorsForSignatures(dataset: IMutationalCounts[]) {
    const colorTableData = dataset.map((obj: IMutationalCounts) => {
        if (obj.hasOwnProperty('mutationalSignatureClass')) {
            let colorIdentity = colorMap.filter(cmap => {
                if (cmap.name === obj.mutationalSignatureClass) {
                    return cmap.color;
                }
            });
            const label = obj.mutationalSignatureLabel;
            const colorValue =
                colorIdentity.length > 0 ? colorIdentity[0].color : '#EE4B2B';
            return { ...obj, colorValue, label };
        } else {
            const label = '';
            const colorValue = '#EE4B2B';
            return { ...obj, colorValue, label };
        }
    });
    if (colorTableData[0].hasOwnProperty('mutationalSignatureClass')) {
        const colorTableDataSorted = _.sortBy(
            colorTableData,
            'mutationalSignatureClass'
        );
        return colorTableDataSorted;
    } else {
        return colorTableData;
    }
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
        let dataLegend = data.filter((obj2: colorMapProps) => {
            if (labelsPresent.includes(obj2.name)) {
                return obj2;
            }
        });
        let legend = dataLegend.map((obj: colorMapProps) => {
            let entry = {
                name: obj.category,
                symbol: { fill: obj.color },
            };
            return entry;
        });
        return legend;
    }
    @action yAxisDomain(): number[] {
        const maxValue = this.props.data.reduce(
            (previous: IMutationalCounts, current: IMutationalCounts) => {
                return current.count > previous.count ? current : previous;
            }
        );
        const minValue = this.props.data.reduce(
            (previous: IMutationalCounts, current: IMutationalCounts) => {
                return current.count < previous.count ? current : previous;
            }
        );
        return [minValue.count, maxValue.count + 0.1 * maxValue.count];
    }

    public render() {
        return (
            <div>
                <VictoryChart
                    domainPadding={10}
                    padding={{ top: 30, bottom: 10, right: 250, left: 60 }}
                    height={this.props.height}
                    width={this.props.width}
                >
                    <VictoryLegend
                        x={this.props.width - 240}
                        y={10}
                        symbolSpacer={4}
                        itemsPerRow={10}
                        orientation="vertical"
                        style={{ labels: { fontSize: 6 } }}
                        data={this.formatLegendColor(colorMap)}
                    />

                    <VictoryStack>
                        <VictoryBar
                            labelComponent={
                                <VictoryTooltip
                                    style={{ fontSize: '7px' }}
                                    cornerRadius={3}
                                    pointerLength={0}
                                    flyoutStyle={{
                                        stroke: '#bacdd8',
                                        strokeWidth: 1,
                                        fill: 'white',
                                    }}
                                />
                            }
                            barRatio={0.8}
                            barWidth={5}
                            data={getColorsForSignatures(this.props.data)}
                            x="label"
                            y="count"
                            style={{
                                data: {
                                    fill: (d: IColorDataBar) => d.colorValue,
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
                                axisLabel: { fontSize: 8, padding: 30 },
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
                                axisLabel: { fontSize: 8, padding: 30 },
                                tickLabels: { fontSize: 8, padding: 5 },
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
                                axisLabel: { fontSize: 8, padding: 30 },
                                tickLabels: { fontSize: 8, padding: 5 },
                            }}
                        />
                    )}
                </VictoryChart>
            </div>
        );
    }
}
