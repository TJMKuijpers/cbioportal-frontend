import _ from 'lodash';
import {
    IMutationalCounts,
    IMutationalSignature,
} from 'shared/model/MutationalSignature';
import { scalePoint, scaleBand } from 'd3-scale';
import { IMutationalSignatureRow } from 'pages/patientView/clinicalInformation/ClinicalInformationMutationalSignatureTable';
import { computed } from 'mobx';
export interface IColorLegend extends IColorDataBar {
    group: string;
    axisLabel: string;
    subcategory?: string;
}

export interface IColorDataBar extends IMutationalCounts {
    colorValue: string;
    label: string;
    subcategory?: string;
}

export interface ColorMapProps {
    name: string;
    alternativeName: string;
    category: string;
    color: string;
    subcategory?: string;
}

export interface LegendLabelsType {
    group: string;
    label: string;
    color: string;
    subcategory?: string;
}
export interface DrawRectInfo {
    color: string;
    start: string;
    end: string;
}
export interface LabelInfo {
    color: string;
    start: string;
    end: string;
    category: string;
    group: string;
}
export interface LegendEntriesType {
    group: string;
    color: string;
    label: string;
    value: string;
}

export type DataToPlot = { mutationalSignatureLabel: string; value: number };

export const colorMap: ColorMapProps[] = [
    {
        name: 'C>A',
        alternativeName: '_C-A_',
        category: 'C>A',
        color: 'lightblue',
    },
    {
        name: 'C>G',
        alternativeName: '_C-G_',
        category: 'C>G',
        color: 'darkblue',
    },
    { name: 'C>T', alternativeName: '_C-T_', category: 'C>T', color: 'red' },
    { name: 'T>A', alternativeName: '_T-A_', category: 'T>A', color: 'grey' },
    { name: 'T>C', alternativeName: '_T-C_', category: 'T>C', color: 'green' },
    { name: 'T>G', alternativeName: '_T-G_', category: 'T>G', color: 'pink' },
    {
        name: 'reference',
        alternativeName: 'reference',
        category: 'reference',
        color: '#1e97f3',
    },
    {
        name: 'AC>',
        alternativeName: 'AC-',
        category: 'AC>NN',
        color: 'skyblue',
    },
    {
        name: 'AT>',
        alternativeName: 'AT-',
        category: 'AT>NN',
        color: 'blue',
    },
    {
        name: 'CC>',
        alternativeName: 'CC-',
        category: 'CC>NN',
        color: 'lightgreen',
    },
    {
        name: 'CG>',
        alternativeName: 'CG-',
        category: 'CG>NN',
        color: 'darkgreen',
    },
    {
        name: 'CT>',
        alternativeName: 'CT-',
        category: 'CT>NN',
        color: 'pink',
    },
    {
        name: 'CG>',
        alternativeName: 'CG-',
        category: 'CG>NN',
        color: 'darkred',
    },
    {
        name: 'TA>',
        alternativeName: 'TA-',
        category: 'TA>NN',
        color: '#FF7F50',
    },
    {
        name: 'TC>',
        alternativeName: 'TC-',
        category: 'TC>NN',
        color: 'orange',
    },
    {
        name: 'TG>',
        alternativeName: 'TG-',
        category: 'TG>NN',
        color: '#ba55D3',
    },
    {
        name: 'TT>',
        alternativeName: 'TT-',
        category: 'TT>NN',
        color: 'purple',
    },
    {
        name: 'GC>',
        alternativeName: 'GC-',
        category: 'GC>NN',
        color: 'gold',
    },
    {
        name: '1:Del:C',
        alternativeName: '1_Del_C_',
        category: '1bp deletion',
        subcategory: 'C',
        color: '#f39c12',
    },
    {
        name: '1:Del:T',
        alternativeName: '1_Del_T_',
        category: '1bp deletion',
        subcategory: 'T',
        color: '#d68910',
    },
    {
        name: '2:Del:R',
        alternativeName: '2_Del_R_',
        category: '>1bp deletion',
        subcategory: '2',
        color: '#f1948a',
    },
    {
        name: '2:Del:M',
        alternativeName: '2_Del_M',
        category: 'Microhomology',
        subcategory: '2',
        color: '#D2B7F2',
    },
    {
        name: '3:Del:R',
        alternativeName: '3_Del_R',
        category: '>1bp deletion',
        subcategory: '3',
        color: '#ec7063',
    },
    {
        name: '3:Del:M',
        alternativeName: '3_Del_M',
        category: 'Microhomology',
        subcategory: '3',
        color: '#E194EB',
    },
    {
        name: '4:Del:R',
        alternativeName: '4_Del_R',
        category: '>1bp deletion',
        subcategory: '4',
        color: '#e74c3c',
    },
    {
        name: '4:Del:M',
        alternativeName: '4_Del_M',
        category: 'Microhomology',
        subcategory: '4',
        color: '#DD75EA',
    },
    {
        name: '5:Del:R',
        alternativeName: '5_Del_R',
        category: '>1bp deletion',
        subcategory: '5',
        color: '#F7406C',
    },
    {
        name: '5:Del:M',
        alternativeName: '5_Del_M',
        category: 'Microhomology',
        subcategory: '5',
        color: '#DB3AEE',
    },
    {
        name: '1:Ins:T',
        alternativeName: '1_Ins_T',
        category: '1bp insertion',
        subcategory: 'T',
        color: '#28b463',
    },
    {
        name: '1:Ins:C',
        alternativeName: '1_Ins_C',
        category: '1bp insertion',
        subcategory: 'C',
        color: '#82e0aa',
    },
    {
        name: '2:Ins:M',
        alternativeName: '2_Ins_M',
        category: 'Microhomology',
        subcategory: '2',
        color: '#aed6f1',
    },
    {
        name: '2:Ins:R',
        alternativeName: '2_Ins_R',
        category: '>1bp insertion',
        subcategory: '2',
        color: '#33ffff',
    },
    {
        name: '3:Ins:M',
        alternativeName: '3_Ins_M',
        category: 'Microhomology',
        subcategory: '3',
        color: '#85c1e9',
    },
    {
        name: '3:Ins:R',
        alternativeName: '3_Ins_R',
        category: '>1bp insertion',
        subcategory: '3',
        color: '#aed6F1',
    },
    {
        name: '4:Ins:M',
        alternativeName: '4_Ins_M',
        category: 'Microhomology',
        subcategory: '4',
        color: '#85c1e9',
    },
    {
        name: '4:Ins:R',
        alternativeName: '4_Ins_R',
        category: '>1bp insertion',
        subcategory: '4',
        color: '#5dade2',
    },
    {
        name: '5:Ins:M',
        alternativeName: '5_Ins_M',
        category: 'Microhomology',
        subcategory: '5',
        color: '#3498db',
    },
    {
        name: '5:Ins:R',
        alternativeName: '5_Ins_R',
        category: '>1bp insertion',
        subcategory: '5',
        color: '#368BFD',
    },
];
export function getColorsForSignatures(
    dataset: IMutationalCounts[]
): IColorLegend[] {
    const colorTableData = dataset.map((obj: IMutationalCounts) => {
        if (obj.mutationalSignatureLabel !== '') {
            const colorIdentity = colorMap.filter(cmap => {
                if (
                    obj.mutationalSignatureLabel.indexOf('_') == -1 &&
                    obj.mutationalSignatureLabel.indexOf('-') == -1
                ) {
                    if (obj.mutationalSignatureLabel.match(cmap.name) != null) {
                        return cmap.color;
                    }
                } else {
                    if (
                        obj.mutationalSignatureLabel.match(
                            cmap.alternativeName
                        ) != null
                    ) {
                        return cmap.color;
                    }
                }
            });
            const label = formatTooltipLabelCosmicStyle(
                obj.version,
                obj.mutationalSignatureLabel,
                colorIdentity
            );
            const axisLabel = obj.mutationalSignatureLabel;
            const group: string =
                colorIdentity.length > 0
                    ? colorIdentity[colorIdentity.length - 1].category
                    : 'unknown';
            const colorValue: string =
                colorIdentity.length > 0
                    ? colorIdentity[colorIdentity.length - 1].color
                    : '#EE4B2B';
            const subcategory: string =
                'subcategory' in colorIdentity[colorIdentity.length - 1]
                    ? colorIdentity[colorIdentity.length - 1].subcategory!
                    : ' ';
            return { ...obj, colorValue, label, axisLabel, subcategory, group };
        } else {
            const label = obj.mutationalSignatureLabel;
            const axisLabel = obj.mutationalSignatureLabel;
            const colorValue = '#EE4B2B';
            const group = ' ';
            const subcategory: string = ' ';
            return { ...obj, colorValue, label, axisLabel, subcategory, group };
        }
    });
    if (colorTableData[0].group !== ' ') {
        const colorTableDataSorted = _.sortBy(colorTableData, 'group');
        return colorTableDataSorted;
    } else {
        return colorTableData;
    }
}

export function getPercentageOfMutationalCount(
    inputData: IMutationalCounts[]
): IMutationalCounts[] {
    const sumValue = _.sum(inputData.map(item => item.value));
    return inputData.map(item => {
        const count = Math.round((item.value / sumValue!) * 100);
        return {
            uniqueSampleKey: item.uniqueSampleKey,
            patientId: item.patientId,
            uniquePatientKey: item.uniquePatientKey,
            studyId: item.studyId,
            sampleId: item.sampleId,
            mutationalSignatureLabel: item.mutationalSignatureLabel,
            mutationalSignatureClass: item.mutationalSignatureClass,
            version: item.version,
            value: sumValue == 0 ? 0 : count,
        };
    });
}

export function getxScalePoint(
    labels: LegendLabelsType[],
    xmin: number,
    xmax: number
) {
    return scaleBand()
        .domain(labels.map((x: LegendLabelsType) => x.label))
        .range([xmin, xmax]);
}
export function getLegendEntriesBarChart(
    labels: LegendLabelsType[]
): LegendEntriesType[] {
    return labels.map(item => ({
        group: item.group,
        color: item.color,
        label: item.label,
        value: item.label,
        subcategory: item.subcategory,
    }));
}

export function addColorsForReferenceData(dataset: DataToPlot[]) {
    const colors = dataset.map((entry: DataToPlot) => {
        const colorIdentity = colorMap.filter(cmap => {
            if (
                entry.mutationalSignatureLabel.indexOf('_') == -1 &&
                entry.mutationalSignatureLabel.indexOf('-') == -1
            ) {
                if (entry.mutationalSignatureLabel.match(cmap.name) != null) {
                    return cmap.color;
                }
            } else {
                if (
                    entry.mutationalSignatureLabel.match(
                        cmap.alternativeName
                    ) != null
                ) {
                    return cmap.color;
                }
            }
        });
        const colorValue =
            colorIdentity.length > 0
                ? colorIdentity[colorIdentity.length - 1].color
                : '#EE4B2B';
        return { ...entry, colorValue };
    });
    return colors;
}

export function getCenterPositionLabelEntries(
    legendObjects: LegendEntriesType[]
): number[] {
    return Object.keys(_.groupBy(legendObjects, 'group')).map(x =>
        Math.round(_.groupBy(legendObjects, 'group')[x].length / 2)
    );
}
export function getLengthLabelEntries(
    legendObjects: LegendEntriesType[]
): number[] {
    return Object.keys(_.groupBy(legendObjects, 'group')).map(
        x => _.groupBy(legendObjects, 'group')[x].length
    );
}

export function createLegendLabelObjects(
    lengthObjects: number[],
    objects: LegendEntriesType[],
    labels: string[]
) {
    return labels.map(
        (identifier: string, i: number) =>
            _.groupBy(objects, 'group')[identifier][lengthObjects[i] - 1]
    );
}

export function formatLegendObjectsForRectangles(
    lengthLegendObjects: number[],
    legendEntries: LegendEntriesType[],
    labels: string[],
    version: string
) {
    if (version != 'ID') {
        const formatLegendRect = lengthLegendObjects.map((value, i) => ({
            color: _.groupBy(legendEntries, 'group')[labels[i]][0].color,
            start: _.groupBy(legendEntries, 'group')[labels[i]][0].value,
            end: _.groupBy(legendEntries, 'group')[labels[i]][value - 1].value,
        }));
        return formatLegendRect;
    } else {
        // Create a new object grouped by 'group' and 'subcategory
        const dataGroupByCategory = _.groupBy(legendEntries, 'subcategory');
        const dataGroupByGroup = Object.keys(dataGroupByCategory).map(item =>
            _.groupBy(dataGroupByCategory[item], 'group')
        );
        const result: any[] = [];
        dataGroupByGroup.map(item =>
            Object.keys(item).map(x => result.push(item[x]))
        );
        const formatLegendRect = result.map(itemLegend => ({
            color: itemLegend[0].color,
            start: itemLegend[0].label,
            end:
                itemLegend.length > 1
                    ? itemLegend[itemLegend.length - 1].label
                    : itemLegend[0].label,
            category: itemLegend[0].subcategory,
            group: itemLegend[0].group,
        }));
        return formatLegendRect;
    }
}

export function prepareMutationalSignatureDataForTable(
    mutationalSignatureData: IMutationalSignature[],
    samplesInData: string[]
): IMutationalSignatureRow[] {
    const tableData: IMutationalSignatureRow[] = [];
    const sampleInvertedDataByMutationalSignature: Array<any> = _(
        mutationalSignatureData
    )
        .groupBy(
            mutationalSignatureSample => mutationalSignatureSample.meta.name
        )
        .map((mutationalSignatureSampleData, name) => ({
            name,
            samples: mutationalSignatureSampleData,
            url: mutationalSignatureSampleData[0].meta.url,
        }))
        .value();
    for (const mutationalSignature of sampleInvertedDataByMutationalSignature) {
        let mutationalSignatureRowForTable: IMutationalSignatureRow = {
            name: '',
            sampleValues: {},
            url: '',
        };

        mutationalSignatureRowForTable.name = mutationalSignature.name;
        mutationalSignatureRowForTable.url = mutationalSignature.url;
        if (
            Object.keys(mutationalSignature.samples).length ===
            samplesInData.length
        ) {
            for (const sample of mutationalSignature.samples) {
                mutationalSignatureRowForTable.sampleValues[sample.sampleId] = {
                    value: sample.value,
                    confidence: sample.confidence,
                };
            }
            tableData.push(mutationalSignatureRowForTable);
        } else {
            for (const sampleId of samplesInData) {
                if (
                    mutationalSignature.samples.some(
                        (obj: IMutationalSignature) => obj.sampleId === sampleId
                    )
                ) {
                    // Sample exists and we can use the values
                    for (const sample of mutationalSignature.samples) {
                        mutationalSignatureRowForTable.sampleValues[
                            sample.sampleId
                        ] = {
                            value: sample.value,
                            confidence: sample.confidence,
                        };
                    }
                } else {
                    mutationalSignatureRowForTable.sampleValues[sampleId] = {
                        value: 0,
                        confidence: 1,
                    };
                }
            }
            tableData.push(mutationalSignatureRowForTable);
        }
    }
    return tableData;
}

export function formatTooltipLabelCosmicStyle(
    version: string,
    label: string,
    category: ColorMapProps[]
): string {
    if (version == 'SBS') {
        const labelSplit = label.split('_').map((x, i) => {
            return i == 1 ? '[' + x.replace('-', '->') + ']' : x;
        });
        return labelSplit.length > 1
            ? 'Single nucleotide substitution of ' +
                  labelSplit[1] +
                  ' around ' +
                  labelSplit.join('')
            : label;
    } else if (version == 'DBS') {
        const labelSplit = label.split('-');
        return labelSplit.length > 1
            ? 'Double nucleotide substitution of ' +
                  labelSplit[0] +
                  ' to ' +
                  labelSplit[1]
            : label;
    } else if (version == 'ID') {
        const formatedLabel = formatIDlabelsCosmicStyle(label, category);
        return formatedLabel !== '' ? formatedLabel : label;
    } else {
        return label;
    }
}

function formatIDlabelsCosmicStyle(
    label: string,
    information: ColorMapProps[]
): string {
    if (information[0].category == 'Microhomology') {
        return 'Microhomology length ' + information[0].subcategory;
    } else if (information[0].category == '>1bp insertion') {
        return 'Number of repeat units ' + information[0].subcategory;
    } else if (information[0].category == '>1bp deletion') {
        return 'Number of repeat units ' + information[0].subcategory;
    } else if (information[0].category == '1bp deletion') {
        return (
            'Homopolymer length of ' + information[0].subcategory + ' deletion'
        );
    } else if (information[0].category == '1bp insertion') {
        return (
            'Homopolymer length of ' + information[0].subcategory + ' insertion'
        );
    } else {
        return '';
    }
}
