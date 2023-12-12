import * as React from 'react';
import { VictoryBar, VictoryAxis, VictoryLabel, VictoryTooltip } from 'victory';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import WindowStore from 'shared/components/window/WindowStore';

import _ from 'lodash';
import { IMutationalCounts } from 'shared/model/MutationalSignature';
import {
    getColorsForSignatures,
    IColorDataBar,
    getLegendEntriesBarChart,
    getxScalePoint,
    DrawRectInfo,
    LabelInfo,
    getLengthLabelEntries,
    createLegendLabelObjects,
    formatLegendObjectsForRectangles,
    getCenterPositionLabelEntries,
    DataToPlot,
    addColorsForReferenceData,
} from './MutationalSignatureBarChartUtils';
import { CBIOPORTAL_VICTORY_THEME } from 'cbioportal-frontend-commons';

export interface IMutationalBarChartProps {
    signature: string;
    width: number;
    height: number;
    refStatus: boolean;
    svgId: string;
    svgRef?: (svgContainer: SVGElement | null) => void;
    data: IMutationalCounts[];
    version: string;
    sample: string;
    label: string;
    initialReference: string;
    updateReference: boolean;
}

const theme = _.cloneDeep(CBIOPORTAL_VICTORY_THEME);
theme.legend.style.data = {
    type: 'square',
    size: 5,
    strokeWidth: 0,
    stroke: 'black',
};
type FrequencyData = { channel: string; frequency: number };

type SignatureData = { [signature: string]: FrequencyData };

type VersionData = { [version: string]: SignatureData };

const cosmicReferenceData = require('./cosmic_reference.json');

@observer
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    constructor(props: IMutationalBarChartProps) {
        super(props);
    }

    @computed get xTickLabels(): string[] {
        return getColorsForSignatures(this.props.data).map(item => item.label);
    }

    @computed get yAxisDomain(): number[] {
        const maxValue = this.props.data.reduce(
            (previous: IMutationalCounts, current: IMutationalCounts) => {
                return current.value > previous.value ? current : previous;
            }
        );
        const minValue = this.props.data.reduce(
            (previous: IMutationalCounts, current: IMutationalCounts) => {
                return current.value < previous.value ? current : previous;
            }
        );
        if (minValue.value !== maxValue.value) {
            return [Math.round(minValue.value), Math.round(maxValue.value)];
        } else {
            return [0, 10];
        }
    }

    @computed get getGroupedData() {
        if (this.props.data[0].mutationalSignatureLabel != '') {
            return _.groupBy(getColorsForSignatures(this.props.data), 'group');
        } else {
            return this.props.data;
        }
    }
    @computed get getMutationalSignaturesGroupLabels(): string[] {
        return Object.keys(this.getGroupedData);
    }

    @computed get formatLegendTopAxisPoints() {
        const labelObjects = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.label,
                color: entry.colorValue,
                subcategory: entry.subcategory,
            })
        );
        const legendObjects = getLegendEntriesBarChart(labelObjects);
        const lengthLegendObjects = getCenterPositionLabelEntries(
            legendObjects
        );
        const legendOjbectsToAdd = createLegendLabelObjects(
            lengthLegendObjects,
            legendObjects,
            this.getMutationalSignaturesGroupLabels
        );
        const centerOfBoxes = this.formatColorBoxLegend;
        const xScale = getxScalePoint(
            labelObjects,
            60,
            WindowStore.size.width - 90
        );
        return legendOjbectsToAdd.map((item, i) => {
            return (
                <VictoryLabel
                    x={
                        this.props.version != 'ID'
                            ? centerOfBoxes[i].props.x +
                              0.5 * centerOfBoxes[i].props.width
                            : xScale(item.value)
                    }
                    y={8}
                    width={this.props.width}
                    text={item.group}
                    style={{ fontSize: '15px', padding: 5, fontWeight: 'bold' }}
                    textAnchor={'middle'}
                />
            );
        });
    }

    @computed get formatColorBoxLegend() {
        const legendLabels = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.mutationalSignatureLabel,
                color: entry.colorValue,
                subcategory: entry.subcategory,
            })
        );
        const xScale = getxScalePoint(
            legendLabels,
            60,
            WindowStore.size.width - 115
        );
        const legendEntries = getLegendEntriesBarChart(legendLabels);
        const lengthLegendObjects = getLengthLabelEntries(legendEntries);
        const legendInfoBoxes = formatLegendObjectsForRectangles(
            lengthLegendObjects,
            legendEntries,
            this.getMutationalSignaturesGroupLabels,
            this.props.version
        );
        console.log(legendInfoBoxes);
        const legendRectsChart: JSX.Element[] = [];
        legendInfoBoxes.forEach((item: DrawRectInfo) => {
            legendRectsChart.push(
                <rect
                    x={xScale(item.start)! - 1}
                    y={15}
                    fill={item.color}
                    width={
                        xScale(item.end)! - xScale(item.start)! > 0
                            ? xScale(item.end)! - xScale(item.start)!
                            : 6
                    }
                    height="20"
                />
            );
        });
        return legendRectsChart;
    }

    @computed get getSubLabelsLegend() {
        const groupedData = _.groupBy(
            getColorsForSignatures(this.props.data),
            g => g.group
        );
        const legendLabels = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.mutationalSignatureLabel,
                color: entry.colorValue,
                subcategory: entry.subcategory,
                value: entry.label,
            })
        );
        const uniqueSubLabels = legendLabels.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    t =>
                        t.group === value.group &&
                        t.subcategory === value.subcategory
                )
        );

        const centerOfBoxes = this.formatColorBoxLegend;
        const subLabelsForBoxes = formatLegendObjectsForRectangles(
            [uniqueSubLabels.length],
            uniqueSubLabels,
            uniqueSubLabels.map(item => item.subcategory!),
            this.props.version
        );
        const legendLabelsChart: JSX.Element[] = [];
        subLabelsForBoxes.forEach((item: LabelInfo, i: number) => {
            legendLabelsChart.push(
                <VictoryLabel
                    x={
                        centerOfBoxes[i].props.x +
                        0.5 * centerOfBoxes[i].props.width
                    }
                    y={25}
                    width={this.props.width}
                    text={item.category}
                    style={{ fontSize: '15', fontWeight: 'bold' }}
                    textAnchor={'middle'}
                />
            );
        });
        return legendLabelsChart;
    }

    @computed get getSubLabelsAxis() {
        const groupedData = _.groupBy(
            getColorsForSignatures(this.props.data),
            g => g.group
        );
        const legendLabels = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.mutationalSignatureLabel,
                color: entry.colorValue,
                subcategory: entry.subcategory,
                value: entry.label,
            })
        );
        const uniqueSubLabels = legendLabels.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    t =>
                        t.group === value.group &&
                        t.subcategory === value.subcategory
                )
        );

        const centerOfBoxes = this.formatColorBoxLegend;
        const subLabelsForBoxes = formatLegendObjectsForRectangles(
            [uniqueSubLabels.length],
            uniqueSubLabels,
            uniqueSubLabels.map(item => item.subcategory!),
            this.props.version
        );
        const legendLabelsChart: JSX.Element[] = [];
        subLabelsForBoxes.forEach((item: LabelInfo, i: number) => {
            legendLabelsChart.push(
                <VictoryLabel
                    x={
                        centerOfBoxes[i].props.x +
                        0.5 * centerOfBoxes[i].props.width
                    }
                    y={25}
                    width={this.props.width}
                    text={item.category}
                    style={{ fontSize: '15', fontWeight: 'bold' }}
                    textAnchor={'middle'}
                />
            );
        });
        return legendLabelsChart;
    }

    @computed get formatLabelsCosmicStyle(): string[] {
        const labels = this.getLabels(this.props.data);
        const cosmicLabel: string[] = [];
        if (this.props.version == 'SBS') {
            labels.map(label => {
                const labelSplit = label
                    .split('_')
                    .map((x, i) => {
                        return i == 1 ? '(' + x.split('-')[0] + ')' : x;
                    })
                    .join('');
                cosmicLabel.push(labelSplit);
            });
        } else if (this.props.version == 'DBS') {
            labels.map(label => {
                const labelSplit: string = label.split('-')[1];
                cosmicLabel.push(labelSplit);
            });
        } else if (this.props.version == 'ID') {
            labels.map(label => {
                const labelSplit = label.split('_');
                cosmicLabel.push(labelSplit[3]);
            });
        }
        return cosmicLabel;
    }

    @computed get getReferenceSignatureToPlot() {
        const currentSignature: string =
            typeof this.props.signature !== 'undefined'
                ? this.props.signature.split(' ')[0]
                : this.props.initialReference.split(' ')[0];
        const referenceSignatureToPlot: FrequencyData[] =
            cosmicReferenceData['v3.3']['GRCh37'][this.props.version][
                currentSignature
            ];
        const referenceData: DataToPlot[] = referenceSignatureToPlot.map(
            (sig: FrequencyData) => {
                return {
                    mutationalSignatureLabel: sig.channel,
                    value: -1 * (sig.frequency * 100),
                };
            }
        );
        const referenceSorted = this.getSortedReferenceSignatures(
            referenceData
        );
        return addColorsForReferenceData(referenceSorted);
    }

    @computed get yAxisDomainReference(): number[] {
        const currentSignature: string =
            typeof this.props.signature !== 'undefined'
                ? this.props.signature.split(' ')[0]
                : this.props.initialReference.split(' ')[0];
        const currentReferenceData: FrequencyData[] =
            cosmicReferenceData['v3.3']['GRCh37'][this.props.version][
                currentSignature
            ];
        const maxValue = currentReferenceData.reduce(
            (previous: FrequencyData, current: FrequencyData) => {
                return current.frequency > previous.frequency
                    ? current
                    : previous;
            }
        );
        const minValue = currentReferenceData.reduce(
            (previous: FrequencyData, current: FrequencyData) => {
                return current.frequency < previous.frequency
                    ? current
                    : previous;
            }
        );
        return [maxValue.frequency * 100, minValue.frequency * 100];
    }

    @action getLabels(data: IMutationalCounts[]): string[] {
        return getColorsForSignatures(data).map(
            item => item.mutationalSignatureLabel
        );
    }

    @action getSortedReferenceSignatures(referenceData: any) {
        const labelsOrder = getColorsForSignatures(this.props.data).map(
            item => item.label
        );
        const referenceOrder = referenceData.map(
            (itemReference: any) => itemReference.mutationalSignatureLabel
        );
        if (_.isEqual(labelsOrder, referenceOrder)) {
            return referenceData;
        } else {
            const sorted = referenceData.sort(
                (a: DataToPlot, b: DataToPlot) => {
                    return (
                        labelsOrder.findIndex(
                            p => p === a.mutationalSignatureLabel
                        ) -
                        labelsOrder.findIndex(
                            p => p === b.mutationalSignatureLabel
                        )
                    );
                }
            );
            return sorted;
        }
    }

    @computed get referenceAxisLabel() {
        const referenceString = 'COSMIC Reference';
        return this.props.version === 'SBS'
            ? referenceString + '\n' + this.props.signature + ' (%)'
            : this.props.version === 'DBS'
            ? referenceString + '\n' + this.props.signature + ' (%)'
            : referenceString + '\n' + this.props.signature + ' (%)';
    }

    @observable showReferencePlot: boolean = false;

    @action getTranslateDistance(defaultValue: number): number {
        return this.props.version == 'SBS'
            ? defaultValue + 0
            : this.props.version == 'DBS'
            ? defaultValue - 15
            : defaultValue - 25;
    }

    public render() {
        return (
            <div style={{ paddingTop: '10', paddingLeft: '50' }}>
                <svg
                    height={600}
                    width={WindowStore.size.width - 50}
                    style={{ paddingLeft: '30', paddingTop: 20 }}
                    xmlns="http://www.w3.org/2000/svg"
                    ref={this.props.svgRef}
                >
                    {this.formatLegendTopAxisPoints}
                    {this.formatColorBoxLegend}
                    {this.props.version == 'ID' && this.getSubLabelsLegend}
                    <g transform={'translate(10,0)'}>
                        <VictoryAxis
                            dependentAxis
                            label={this.props.label}
                            domain={this.yAxisDomain}
                            tickFormat={(t: number) =>
                                Number.isInteger(t) ? t.toFixed(0) : ''
                            }
                            height={300}
                            width={WindowStore.size.width - 100}
                            offsetX={45}
                            style={{
                                axis: { strokeWidth: 1 },
                                axisLabel: {
                                    padding:
                                        this.props.label == 'Mutational count'
                                            ? 35
                                            : 30,
                                    letterSpacing: 'normal',
                                },
                                ticks: { size: 5, stroke: 'black' },
                                tickLabels: {
                                    padding: 2,
                                },
                                grid: {
                                    stroke: 'lightgrey',
                                    strokeWidth: 0.3,
                                    strokeDasharray: 10,
                                },
                            }}
                            standalone={false}
                        />
                    </g>
                    {this.props.updateReference && (
                        <g
                            transform={
                                'translate(10,' +
                                this.getTranslateDistance(250) +
                                ')'
                            }
                        >
                            <VictoryAxis
                                dependentAxis
                                orientation="left"
                                invertAxis
                                label={this.referenceAxisLabel}
                                domain={this.yAxisDomainReference}
                                offsetX={45}
                                height={300}
                                width={WindowStore.size.width - 100}
                                style={{
                                    axis: { strokeWidth: 1 },
                                    axisLabel: {
                                        padding:
                                            this.props.label ==
                                            'Mutational count'
                                                ? 25
                                                : 25,
                                        letterSpacing: 'normal',
                                    },
                                    ticks: { size: 5, stroke: 'black' },
                                    tickLabels: {
                                        padding: 2,
                                    },
                                    grid: {
                                        stroke: 'lightgrey',
                                        strokeWidth: 0.3,
                                        strokeDasharray: 10,
                                    },
                                }}
                                standalone={false}
                            />
                        </g>
                    )}
                    <g
                        transform={
                            'translate(10,' + this.getTranslateDistance(0) + ')'
                        }
                    >
                        <VictoryAxis
                            tickValues={this.formatLabelsCosmicStyle}
                            width={WindowStore.size.width - 100}
                            style={{
                                axisLabel: {
                                    fontSize: '8px',
                                    padding: 20,
                                },
                                tickLabels: {
                                    fontSize: '12px',
                                    padding: 40,
                                    angle: this.props.version == 'ID' ? 0 : 270,
                                    textAnchor:
                                        this.props.version == 'ID'
                                            ? 'middle'
                                            : 'start',
                                    verticalAnchor: 'middle',
                                },
                                axis: { strokeWidth: 0 },
                                grid: { stroke: 0 },
                            }}
                            standalone={false}
                        />
                    </g>
                    <g transform={'translate(10,0)'}>
                        <VictoryBar
                            barRatio={1}
                            barWidth={8}
                            width={WindowStore.size.width - 100}
                            height={300}
                            labels={this.formatLabelsCosmicStyle}
                            labelComponent={
                                <VictoryTooltip
                                    style={{
                                        fontSize: '12px',
                                        fontColor: 'black',
                                    }}
                                    cornerRadius={3}
                                    pointerLength={0}
                                    flyoutStyle={{
                                        stroke: '#bacdd8',
                                        strokeWidth: 1,
                                        fill: 'white',
                                    }}
                                />
                            }
                            alignment="middle"
                            data={getColorsForSignatures(this.props.data)}
                            x="label"
                            y="value"
                            style={{
                                data: {
                                    fill: (d: IColorDataBar) => d.colorValue,
                                },
                            }}
                            standalone={false}
                        />
                    </g>
                    {!this.props.updateReference && (
                        <g
                            transform={
                                'translate(' +
                                this.getTranslateDistance(
                                    (WindowStore.size.width - 200) / 2
                                ) +
                                ',' +
                                this.getTranslateDistance(400) +
                                ')'
                            }
                            style={{ borderStyle: 'dotted' }}
                        >
                            <text>
                                Select a reference signature to show the
                                reference plot
                            </text>
                        </g>
                    )}
                    {this.props.version == 'ID' && this.getSubLabelsAxis}
                    {this.props.updateReference && (
                        <g
                            transform={
                                'translate(10,' +
                                this.getTranslateDistance(250) +
                                ')'
                            }
                        >
                            <VictoryBar
                                barRatio={1}
                                barWidth={8}
                                width={WindowStore.size.width - 100}
                                height={300}
                                data={this.getReferenceSignatureToPlot}
                                x="label"
                                y="value"
                                style={{
                                    data: {
                                        fill: (d: IColorDataBar) =>
                                            d.colorValue,
                                    },
                                }}
                                alignment="middle"
                                labels={this.formatLabelsCosmicStyle}
                                labelComponent={
                                    <VictoryTooltip
                                        style={{ fontSize: '8px' }}
                                        cornerRadius={3}
                                        pointerLength={0}
                                        flyoutStyle={{
                                            stroke: '#bacdd8',
                                            strokeWidth: 1,
                                            fill: 'white',
                                        }}
                                    />
                                }
                                standalone={false}
                            />
                        </g>
                    )}
                </svg>
            </div>
        );
    }
}
