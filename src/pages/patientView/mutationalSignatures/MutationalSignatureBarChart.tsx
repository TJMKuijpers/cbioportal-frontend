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
    LegendLabelsType,
    createXAxisAnnotation,
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
    selectedScale: string;
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

const cosmicReferenceData = require('./cosmic_reference.json');
const offSetYAxis = 45;
const heightYAxis = 300;
const xMaxOffset: { [version: string]: { offset: number } } = {
    SBS: { offset: 28 },
    DBS: { offset: 14 },
    ID: { offset: 25 },
};
@observer
export default class MutationalBarChart extends React.Component<
    IMutationalBarChartProps,
    {}
> {
    constructor(props: IMutationalBarChartProps) {
        super(props);
    }

    //@observable graphWidth = WindowStore.size.width - 100;
    @observable graphWidth = 1800;
    @computed get xTickLabels(): string[] {
        return getColorsForSignatures(
            this.props.data,
            this.props.selectedScale
        ).map(item => item.label);
    }

    @computed get yAxisDomain(): number[] {
        if (this.props.selectedScale == '%') {
            return [0, 100];
        } else {
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
    }

    @computed get getGroupedData() {
        if (this.props.data[0].mutationalSignatureLabel != '') {
            return _.groupBy(
                getColorsForSignatures(
                    this.props.data,
                    this.props.selectedScale
                ),
                'group'
            );
        } else {
            return this.props.data;
        }
    }
    @computed get getMutationalSignaturesGroupLabels(): string[] {
        return Object.keys(this.getGroupedData);
    }

    @computed get formatLegendTopAxisPoints() {
        const lengthLegendObjects = getCenterPositionLabelEntries(
            this.getLegendObjects
        );
        const legendOjbectsToAdd = createLegendLabelObjects(
            lengthLegendObjects,
            this.getLegendObjects,
            this.getMutationalSignaturesGroupLabels
        );
        const centerOfBoxes = this.colorRectangles;
        const xScale = getxScalePoint(this.labelObjects, 60, this.graphWidth);
        return legendOjbectsToAdd.map((item, i) => {
            return (
                <VictoryLabel
                    x={
                        this.props.version != 'ID'
                            ? centerOfBoxes[i].props.x +
                              0.5 * centerOfBoxes[i].props.width
                            : this.getXScale(item.value)! + 25
                    }
                    y={8}
                    width={this.graphWidth}
                    text={item.group}
                    style={{ fontSize: '15px', padding: 5, fontWeight: 'bold' }}
                    textAnchor={'middle'}
                />
            );
        });
    }

    @computed get labelObjects() {
        return getColorsForSignatures(
            this.props.data,
            this.props.selectedScale
        ).map(entry => ({
            group: entry.group,
            label: entry.mutationalSignatureLabel,
            color: entry.colorValue,
            subcategory: entry.subcategory,
            value: entry.label,
        }));
    }

    @computed get legendInfo() {
        const lengthLegendObjects = getLengthLabelEntries(
            this.getLegendObjects
        );
        return formatLegendObjectsForRectangles(
            lengthLegendObjects,
            this.getLegendObjects,
            this.getMutationalSignaturesGroupLabels,
            this.props.version,
            'subcategory'
        );
    }
    @action calculateXPositionRectangle(
        item: DrawRectInfo,
        index: number,
        xScale: any
    ) {
        if (this.props.version == 'SBS') {
            return index == 0 ? xScale(item.start)! : xScale(item.start)!;
        } else if (this.props.version == 'DBS') {
            return index == 0 ? xScale(item.start)! : xScale(item.start)! - 5;
        } else {
            return index == 0 ? xScale(item.start)! : xScale(item.start)!;
        }
    }

    @computed get getXScale() {
        return getxScalePoint(
            this.labelObjects,
            55,
            this.graphWidth - xMaxOffset[this.props.version].offset
        );
    }

    @computed get colorRectangles() {
        const legendInfoBoxes = this.legendInfo;
        const legendRectsChart: JSX.Element[] = [];
        const xScale = this.getXScale;
        legendInfoBoxes.forEach((item: DrawRectInfo, index: number) => {
            legendRectsChart.push(
                <rect
                    x={this.calculateXPositionRectangle(item, index, xScale)}
                    y={15}
                    fill={item.color}
                    width={
                        xScale(item.end)! - xScale(item.start)! > 0
                            ? xScale(item.end)! - xScale(item.start)! + 10
                            : 20
                    }
                    height="20"
                />
            );
        });
        return legendRectsChart;
    }

    @computed get uniqueLabelsForRectangles() {
        return this.labelObjects.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    t =>
                        t.group === value.group &&
                        t.subcategory === value.subcategory
                )
        );
    }

    @computed get getSubLabelsForRectangles() {
        const centerOfBoxes = this.colorRectangles;
        const subLabelsForBoxes = formatLegendObjectsForRectangles(
            [this.uniqueLabelsForRectangles.length],
            this.uniqueLabelsForRectangles,
            this.uniqueLabelsForRectangles.map(item => item.subcategory!),
            this.props.version,
            'subcategory'
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

    @computed get getLegendObjects() {
        return getLegendEntriesBarChart(this.labelObjects);
    }

    @computed get xAxisLabelsInDel() {
        const lengthLegendObjects = getCenterPositionLabelEntries(
            this.getLegendObjects
        );
        const legendOjbectsToAdd = createLegendLabelObjects(
            lengthLegendObjects,
            this.getLegendObjects,
            this.getMutationalSignaturesGroupLabels
        );
        const centerOfBoxes = this.colorRectangles;

        const replaceLabels = [
            'Homopolymer length',
            'Homopolymer length',
            'Number of repeat units',
            'Number of repeat units',
            'Microhomology',
        ];
        return legendOjbectsToAdd.map((item, i) => {
            return (
                <VictoryLabel
                    x={this.getXScale(item.value)! + 25}
                    y={310}
                    width={this.props.width}
                    text={replaceLabels[i]}
                    style={{ fontSize: '15px', padding: 5, fontWeight: 'bold' }}
                    textAnchor={'middle'}
                />
            );
        });
    }

    @computed get formatLabelsCosmicStyle(): string[] {
        const labels = this.getLabels(this.props.data);
        const cosmicLabel: string[] = [];
        if (this.props.version == 'SBS') {
            labels.map(label => {
                const labelSplit = label
                    .split('_')
                    .map((x, i) => {
                        return i == 1 ? x.split('-')[0] : x;
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
        const referenceSorted = this.sortReferenceSignatures(referenceData);
        return addColorsForReferenceData(referenceSorted);
    }

    @computed get colorBoxXAxis() {
        const legendLabels = getColorsForSignatures(
            this.props.data,
            this.props.selectedScale
        ).map(entry => ({
            group: entry.group,
            label: entry.mutationalSignatureLabel,
            color: entry.colorValue,
            subcategory: entry.subcategory,
        }));
        const xScale = getxScalePoint(
            this.labelObjects,
            55,
            this.graphWidth - xMaxOffset[this.props.version].offset
        );
        const legendEntries = getLegendEntriesBarChart(legendLabels);
        const lengthLegendObjects = getLengthLabelEntries(legendEntries);
        const legendInfoBoxes = formatLegendObjectsForRectangles(
            lengthLegendObjects,
            legendEntries,
            this.getMutationalSignaturesGroupLabels,
            this.props.version,
            'subcategory'
        );
        const legendRectsChart: JSX.Element[] = [];
        legendInfoBoxes.forEach((item: DrawRectInfo, index: number) => {
            legendRectsChart.push(
                <rect
                    x={this.calculateXPositionRectangle(item, index, xScale)}
                    y={280}
                    fill={item.color}
                    width={
                        xScale(item.end)! - xScale(item.start)! > 0
                            ? xScale(item.end)! - xScale(item.start)! + 12
                            : 15
                    }
                    height="20"
                />
            );
        });
        return legendRectsChart;
    }

    @action getLabels(data: IMutationalCounts[]): string[] {
        return getColorsForSignatures(data, this.props.selectedScale).map(
            item => item.mutationalSignatureLabel
        );
    }

    @action sortReferenceSignatures(referenceData: DataToPlot[]) {
        const labelsOrder = getColorsForSignatures(
            this.props.data,
            this.props.selectedScale
        ).map(item => item.mutationalSignatureLabel, this.props.selectedScale);
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

    @action getTranslateDistance(defaultValue: number): number {
        return this.props.version == 'SBS'
            ? defaultValue - 10
            : this.props.version == 'DBS'
            ? defaultValue - 15
            : defaultValue - 25;
    }

    public render() {
        return (
            <div style={{ paddingTop: 10, paddingLeft: 0, width: 1500 }}>
                <svg
                    height={600}
                    width={this.graphWidth}
                    style={{ paddingLeft: '30', paddingTop: 20 }}
                    xmlns="http://www.w3.org/2000/svg"
                    ref={this.props.svgRef}
                >
                    {this.formatLegendTopAxisPoints}
                    {this.colorRectangles}
                    {this.props.version == 'ID' &&
                        this.getSubLabelsForRectangles}
                    <g transform={'translate(10,0)'}>
                        <VictoryAxis
                            dependentAxis
                            label={this.props.label}
                            domain={this.yAxisDomain}
                            tickFormat={(t: number) =>
                                Number.isInteger(t) ? t.toFixed(0) : ''
                            }
                            height={300}
                            width={this.graphWidth + 45}
                            offsetX={offSetYAxis}
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
                                    strokeDasharray: 10.5,
                                },
                            }}
                            standalone={false}
                        />
                    </g>
                    {this.props.updateReference && (
                        <g
                            transform={
                                'translate(10,' +
                                this.getTranslateDistance(
                                    this.props.version == 'ID' ? 300 : 250
                                ) +
                                ')'
                            }
                        >
                            <VictoryAxis
                                dependentAxis
                                orientation="left"
                                invertAxis
                                label={this.referenceAxisLabel}
                                domain={[100, 0]}
                                offsetX={offSetYAxis}
                                height={heightYAxis}
                                width={this.graphWidth}
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
                            width={this.graphWidth}
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
                            barWidth={7}
                            width={this.graphWidth}
                            domain={{ y: this.yAxisDomain }}
                            height={heightYAxis}
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
                            data={getColorsForSignatures(
                                this.props.data,
                                this.props.selectedScale
                            )}
                            x="mutationalSignatureLabel"
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
                                    (this.graphWidth - 200) / 2
                                ) +
                                ',' +
                                this.getTranslateDistance(400) +
                                ')'
                            }
                        >
                            <text style={{ border: '2px solid #ccc' }}>
                                Select a signature from the table to show the
                                reference signature plot
                            </text>
                        </g>
                    )}
                    {this.props.version == 'ID' && this.colorBoxXAxis}
                    {this.props.version == 'ID' && this.xAxisLabelsInDel}
                    {this.props.updateReference && (
                        <g
                            transform={
                                'translate(10,' +
                                this.getTranslateDistance(
                                    this.props.version == 'ID' ? 300 : 250
                                ) +
                                ')'
                            }
                        >
                            <VictoryBar
                                barRatio={1}
                                barWidth={7}
                                width={this.graphWidth}
                                height={300}
                                domain={{ y: [-100, 0] }}
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
