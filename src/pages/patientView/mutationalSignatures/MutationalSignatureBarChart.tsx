import * as React from 'react';
import {
    VictoryBar,
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryStack,
    VictoryTooltip,
    VictoryLegend,
    VictoryScatter,
    VictoryLine,
} from 'victory';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { IMutationalCounts } from 'shared/model/MutationalSignature';
import {
    getColorsForSignatures,
    ColorMapProps,
    colorMap,
    IColorDataBar,
    IColorLegend,
    getLegendEntriesBarChart,
    getxScalePoint,
    LegendLabelsType,
    DrawRectInfo,
    LabelInfo,
    getLengthLabelEntries,
    createLegendLabelObjects,
    formatLegendObjectsForRectangles,
    getCenterPositionLabelEntries,
} from './MutationalSignatureBarChartUtils';
import { CBIOPORTAL_VICTORY_THEME } from 'cbioportal-frontend-commons';
import { AxisScale } from 'react-mutation-mapper';
import { scalePoint } from 'd3-scale';

export interface IMutationalBarChartProps {
    signature: string;
    width: number;
    height: number;
    refStatus: boolean;
    data: IMutationalCounts[];
    version: string;
    sample: string;
    label: string;
}

const theme = _.cloneDeep(CBIOPORTAL_VICTORY_THEME);
theme.legend.style.data = {
    type: 'square',
    size: 5,
    strokeWidth: 0,
    stroke: 'black',
};

export function formatLegendTopAxisPoints(data: IMutationalCounts[]) {
    const constant_value = _.max(data.map(item => item.value)) || 0;
    const groupedData = _.groupBy(getColorsForSignatures(data), 'group');
    return getColorsForSignatures(data).map(entry => ({
        x: entry.mutationalSignatureLabel,
        y: constant_value + constant_value * 0.1,
        color: entry.colorValue,
    }));
}

export function transformMutationalSignatureData(dataset: IMutationalCounts[]) {
    const transformedDataSet = dataset.map((obj: IMutationalCounts) => {
        const transformedDataSet = dataset.map((obj: IMutationalCounts) => {
            let referenceTransformed = -Math.abs(obj.value);
            return { ...obj, referenceTransformed };
        });
        return transformedDataSet;
    });
}

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
        return [minValue.value, maxValue.value + 0.1 * maxValue.value];
    }

    @computed get formatLegendTopAxisPoints() {
        const groupedData = _.groupBy(
            getColorsForSignatures(this.props.data),
            'group'
        );
        const labels = Object.keys(groupedData);
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
            labels
        );
        const centerOfBoxes = this.formatColorBoxLegend;
        const xScale = getxScalePoint(labelObjects, 60, 1040);
        const legendLabelsChart: JSX.Element[] = [];
        legendOjbectsToAdd.forEach((item, i) => {
            legendLabelsChart.push(
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
                    style={{ fontSize: '13px', padding: 5 }}
                    textAnchor={'middle'}
                />
            );
        });
        return legendLabelsChart;
    }

    @computed get formatColorBoxLegend() {
        const groupedData = _.groupBy(
            getColorsForSignatures(this.props.data),
            'group'
        );
        const labels = Object.keys(groupedData);
        const legendLabels = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.label,
                color: entry.colorValue,
                subcategory: entry.subcategory,
            })
        );
        const xScale = getxScalePoint(legendLabels, 60, 1040);
        const legendEntries = getLegendEntriesBarChart(legendLabels);
        const lengthLegendObjects = getLengthLabelEntries(legendEntries);
        const legendInfoBoxes = formatLegendObjectsForRectangles(
            lengthLegendObjects,
            legendEntries,
            labels,
            this.props.version
        );
        const legendLabelBoxes: JSX.Element[] = [];
        legendInfoBoxes.forEach((item: DrawRectInfo) => {
            legendLabelBoxes.push(
                <rect
                    x={xScale(item.start)}
                    y={15}
                    fill={item.color}
                    width={
                        xScale(item.end)! - xScale(item.start)! > 0
                            ? xScale(item.end)! - xScale(item.start)!
                            : 6
                    }
                    height="15px"
                />
            );
        });
        return legendLabelBoxes;
    }

    @computed get getSubLabelsLegend() {
        const groupedData = _.groupBy(
            getColorsForSignatures(this.props.data),
            'group'
        );
        const labels = Object.keys(groupedData);
        const legendLabels = getColorsForSignatures(this.props.data).map(
            entry => ({
                group: entry.group,
                label: entry.label,
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
                    y={37}
                    width={this.props.width}
                    text={item.category}
                    style={{ fontSize: '10px' }}
                    textAnchor={'middle'}
                />
            );
        });
        return legendLabelsChart;
    }

    @action getLabelsForTooltip(data: IMutationalCounts[]): string[] {
        return getColorsForSignatures(data).map(item => item.label);
    }

    public render() {
        return (
            <div id={'mutationalBarChart'} style={{ paddingTop: '10px' }}>
                <svg
                    height={400}
                    width={1200}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {this.formatLegendTopAxisPoints}
                    {this.formatColorBoxLegend}
                    {this.props.version == 'ID' && this.getSubLabelsLegend}
                    <g width={1000}>
                        <VictoryChart
                            domainPadding={5}
                            standalone={false}
                            width={1100}
                            height={400}
                        >
                            <VictoryAxis
                                dependentAxis
                                label={this.props.label}
                                heigth={this.props.height}
                                domain={this.yAxisDomain}
                                style={{
                                    axis: { strokeWidth: 1 },
                                    axisLabel: {
                                        fontSize: '13px',
                                        padding:
                                            this.props.label ==
                                            'Mutational count (value)'
                                                ? 40
                                                : 35,
                                        letterSpacing: 'normal',
                                        fontFamily: 'Arial, Helvetica',
                                    },
                                    ticks: { size: 5, stroke: 'black' },
                                    tickLabels: {
                                        fontSize: '12px',
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
                            <VictoryBar
                                barRatio={1}
                                barWidth={2}
                                width={this.props.width}
                                labels={this.getLabelsForTooltip(
                                    this.props.data
                                )}
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
                                data={getColorsForSignatures(this.props.data)}
                                x="label"
                                y="value"
                                style={{
                                    data: {
                                        fill: (d: IColorDataBar) =>
                                            d.colorValue,
                                    },
                                }}
                                alignment="start"
                                standalone={false}
                            />
                            <VictoryAxis
                                tickValues={this.xTickLabels}
                                width={this.props.width}
                                style={{
                                    axisLabel: {
                                        fontSize: '10px',
                                        padding: 20,
                                    },
                                    tickLabels: {
                                        fontSize: '5px',
                                        padding: 25,
                                        angle: 270,
                                        textAnchor: 'start',
                                    },
                                    axis: { strokeWidth: 1 },
                                    grid: { stroke: 0 },
                                }}
                                standalone={false}
                            />
                        </VictoryChart>
                    </g>
                </svg>
            </div>
        );
    }
}
