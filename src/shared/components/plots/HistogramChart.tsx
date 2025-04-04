import _ from 'lodash';
import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { computed, makeObservable, observable } from 'mobx';
import {
    VictoryChart,
    VictoryAxis,
    VictoryHistogram,
    VictoryLegend,
    VictoryLabel,
} from 'victory';
import { LegendDataWithId } from 'shared/components/plots/PlotUtils';
import { wrapText } from 'cbioportal-frontend-commons';

export interface IBaseHistogramPlotData {
    values: number[];
    labels: string[];
}

const DEFAULT_FONT_FAMILY = 'Verdana,Arial,sans-serif';

export interface IHistogramPlotProps<D extends IBaseHistogramPlotData> {
    svgId?: string;
    svgRef?: (elt: SVGElement | null) => void;
    title?: string;
    data: D[];
    chartWidth: number;
    chartHeight: number;
    highlight?: (d: D) => boolean;
    fill?: string | ((d: D) => string);
    stroke?: string | ((d: D) => string);
    fillOpacity?: number | ((d: D) => number);
    strokeOpacity?: number | ((d: D) => number);
    strokeWidth?: number | ((d: D) => number);
    tooltip?: (d: D) => JSX.Element;
    legendData?: LegendDataWithId<D>[];
    axisLabelX?: string;
    axisLabelY?: string;
    fontFamily?: string;
    legendTitle?: string | string[];
}

@observer
export default class HistogramPlot<
    D extends IBaseHistogramPlotData
> extends React.Component<IHistogramPlotProps<D>, {}> {
    @observable.ref private container: HTMLDivElement;

    constructor(props: any) {
        super(props);
        makeObservable(this);
    }

    @computed get fontFamily() {
        return this.props.fontFamily || DEFAULT_FONT_FAMILY;
    }

    private get title() {
        if (this.props.title) {
            const text = wrapText(
                this.props.title,
                this.props.chartWidth,
                this.fontFamily,
                '14px'
            );
            return (
                <VictoryLabel
                    style={{
                        fontWeight: 'bold',
                        fontFamily: this.fontFamily,
                        textAnchor: 'middle',
                    }}
                    x={this.props.chartWidth / 2}
                    y="1.2em"
                    text={text}
                />
            );
        } else {
            return null;
        }
    }
}
