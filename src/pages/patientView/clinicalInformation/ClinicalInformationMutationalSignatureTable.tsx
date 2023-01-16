import * as React from 'react';
import LazyMobXTable, {
    Column,
} from 'shared/components/lazyMobXTable/LazyMobXTable';
import styles from './style/mutationalSignatureTable.module.scss';
import { SHOW_ALL_PAGE_SIZE } from '../../../shared/components/paginationControls/PaginationControls';
import { IMutationalSignature } from '../../../shared/model/MutationalSignature';
import { getMutationalSignaturePercentage } from '../../../shared/lib/FormatUtils';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';
import { MUTATIONAL_SIGNATURES_SIGNIFICANT_PVALUE_THRESHOLD } from 'shared/lib/GenericAssayUtils/MutationalSignaturesUtils';
import MutationalBarChart, {
    DataMutSig,
} from 'pages/patientView/mutationalSignatures/MutationalSignatureBarChart';
import { patientViewTabs } from 'pages/patientView/PatientViewPageTabs';
import MutationalSignaturesContainer from 'pages/patientView/mutationalSignatures/MutationalSignaturesContainer';
export interface IClinicalInformationMutationalSignatureTableProps {
    data: IMutationalSignature[];
    parentCallback: (childData: string, childDataObject: DataMutSig[]) => void;
}

class MutationalSignatureTable extends LazyMobXTable<IMutationalSignatureRow> {}

interface IMutationalSignatureRow {
    name: string;
    sampleValues: {
        [sampleId: string]: {
            //each element in the row will contain data about contribution and confidence
            value: number;
            confidence: number;
        };
    };
}

export function prepareMutationalSignatureDataForTable(
    mutationalSignatureData: IMutationalSignature[]
): IMutationalSignatureRow[] {
    const tableData: IMutationalSignatureRow[] = [];

    //group data by mutational signature
    //[{id: mutationalsignatureid, samples: [{}, {}]}]
    let sampleInvertedDataByMutationalSignature: Array<any> = _(
        mutationalSignatureData
    )
        .groupBy(
            mutationalSignatureSample => mutationalSignatureSample.meta.name
        )
        .map((mutationalSignatureSampleData, name) => ({
            name,
            samples: mutationalSignatureSampleData,
        }))
        .value();

    for (const mutationalSignature of sampleInvertedDataByMutationalSignature) {
        let mutationalSignatureRowForTable: IMutationalSignatureRow = {
            name: '',
            sampleValues: {},
        };
        mutationalSignatureRowForTable.name = mutationalSignature.name;
        for (const sample of mutationalSignature.samples) {
            mutationalSignatureRowForTable.sampleValues[sample.sampleId] = {
                value: sample.value,
                confidence: sample.confidence,
            };
        }
        tableData.push(mutationalSignatureRowForTable);
    }
    return tableData;
}

@observer
export default class ClinicalInformationMutationalSignatureTable extends React.Component<
    IClinicalInformationMutationalSignatureTableProps,
    {}
> {
    @observable selectedSignature = '';
    @observable selectedData = sigData2;
    sendData = () => {
        this.props.parentCallback(this.selectedSignature, this.selectedData);
    };

    constructor(props: IClinicalInformationMutationalSignatureTableProps) {
        super(props);
        makeObservable(this);
    }

    @action.bound getMutationalSignatureProfileData(
        e: React.MouseEvent<Element, MouseEvent>
    ): void {
        this.selectedSignature = e.currentTarget.innerHTML;
        this.sendData();
    }

    @computed get uniqueSamples() {
        return _.map(_.uniqBy(this.props.data, 'sampleId'), uniqSample => ({
            id: uniqSample.sampleId,
        }));
    }

    @computed get tableData() {
        return prepareMutationalSignatureDataForTable(this.props.data);
    }

    readonly firstCol = 'name';
    @computed get columns(): Column<IMutationalSignatureRow>[] {
        return [
            {
                name: 'Mutational Signature',
                render: (data: IMutationalSignatureRow) => (
                    <span
                        onClick={this.getMutationalSignatureProfileData.bind(
                            data
                        )}
                        id={'spanSignatureName'}
                    >
                        {data[this.firstCol]}
                    </span>
                ),
                download: (data: IMutationalSignatureRow) =>
                    `${data[this.firstCol]}`,
                filter: (
                    data: IMutationalSignatureRow,
                    filterString: string,
                    filterStringUpper: string
                ) =>
                    data[this.firstCol]
                        .toString()
                        .toUpperCase()
                        .indexOf(filterStringUpper) > -1,
                sortBy: (data: IMutationalSignatureRow) => data[this.firstCol],
            },
            ...this.uniqueSamples.map(col => ({
                name: col.id,
                render: (data: IMutationalSignatureRow) =>
                    data.sampleValues[col.id].confidence <
                    MUTATIONAL_SIGNATURES_SIGNIFICANT_PVALUE_THRESHOLD ? ( //if it's a significant signature, bold the contribution
                        // Based on significant pvalue the span is created with style.mutationalSignatureValue for bold (sign)
                        // or normal styling (not signficant)
                        <span className={styles.mutationalSignatureValue}>
                            {getMutationalSignaturePercentage(
                                data.sampleValues[col.id].value
                            )}
                        </span>
                    ) : (
                        <span>
                            {getMutationalSignaturePercentage(
                                data.sampleValues[col.id].value
                            )}
                        </span>
                    ),
                download: (data: IMutationalSignatureRow) =>
                    `${getMutationalSignaturePercentage(
                        data.sampleValues[col.id].value
                    )}`,
                filter: (
                    data: IMutationalSignatureRow,
                    filterString: string,
                    filterStringUpper: string
                ) =>
                    getMutationalSignaturePercentage(
                        data.sampleValues[col.id].value
                    )
                        .toUpperCase()
                        .indexOf(filterStringUpper) > -1,
                sortBy: (data: IMutationalSignatureRow) =>
                    data.sampleValues[col.id].value,
            })),
        ];
    }

    public render() {
        return (
            <MutationalSignatureTable
                columns={this.columns}
                data={this.tableData}
                showPagination={false}
                initialItemsPerPage={SHOW_ALL_PAGE_SIZE}
                showColumnVisibility={false}
                initialSortColumn={this.uniqueSamples[0].id}
                initialSortDirection="desc"
            />
        );
    }
}

var sigData2 = [
    { id: 'a>c', count: 10, reference: 10, label: 'C>A' },
    { id: 'a>t', count: 20, reference: 25, label: 'C>A' },
    { id: 'a>g', count: 30, reference: 50, label: 'C>A' },
    { id: 't>g', count: 40, reference: 20, label: 'C>A' },
    { id: 't>c', count: 10, reference: 10, label: 'C>A' },
    { id: 't>a', count: 25, reference: 25, label: 'C>G' },
    { id: 'c>t', count: 40, reference: 80, label: 'C>G' },
    { id: 'c>a', count: 10, reference: 50, label: 'C>G' },
    { id: 'c>g', count: 30, reference: 30, label: 'C>G' },
    { id: 'g>c', count: 70, reference: 70, label: 'C>G' },
    { id: 'g>t', count: 5, reference: 25, label: 'T>C' },
    { id: 'g>a', count: 15, reference: 50, label: 'T>C' },
    { id: 'ID1', count: 40, reference: 80, label: 'T>C' },
    { id: 'ID2', count: 10, reference: 50, label: 'T>C' },
    { id: 'ID3', count: 30, reference: 30, label: 'T>C' },
    { id: 'ID4', count: 70, reference: 70, label: 'T>C' },
    { id: 'ID5', count: 5, reference: 25, label: 'AC>NN' },
    { id: 'ID6', count: 15, reference: 50, label: 'AC>NN' },
    { id: 'ID7', count: 40, reference: 80, label: 'AC>NN' },
    { id: 'ID8', count: 10, reference: 50, label: 'AC>NN' },
    { id: 'ID9', count: 30, reference: 30, label: 'AT>NN' },
    { id: 'ID10', count: 70, reference: 70, label: 'AT>NN' },
    { id: 'ID11', count: 5, reference: 25, label: 'AT>NN' },
    { id: 'ID12', count: 15, reference: 50, label: 'CG>NN' },
    { id: 'ID13', count: 30, reference: 30, label: 'CG>NN' },
    { id: 'ID14', count: 70, reference: 70, label: 'CG>NN' },
    { id: 'ID15', count: 5, reference: 25, label: 'CG>NN' },
    { id: 'ID16', count: 15, reference: 50, label: 'CG>NN' },
    { id: 'ID17', count: 30, reference: 30, label: 'CG>NN' },
    { id: 'ID18', count: 70, reference: 70, label: 'TC>NN' },
    { id: 'ID19', count: 5, reference: 25, label: 'TC>NN' },
    { id: 'ID20', count: 15, reference: 50, label: 'TC>NN' },
    { id: 'ID21', count: 40, reference: 80, label: 'TC>NN' },
    { id: 'ID22', count: 10, reference: 50, label: 'TG>NN' },
    { id: 'ID23', count: 30, reference: 30, label: 'TG>NN' },
    { id: 'ID24', count: 70, reference: 70, label: 'TG>NN' },
    { id: 'ID25', count: 5, reference: 25, label: 'TG>NN' },
    { id: 'ID26', count: 15, reference: 50, label: 'TG>NN' },
    { id: 'ID27', count: 40, reference: 80, label: 'TT>NN' },
    { id: 'ID28', count: 10, reference: 0, label: 'TT>NN' },
    { id: 'ID29', count: 30, reference: 0, label: 'TT>NN' },
    { id: 'ID30', count: 70, reference: 0, label: 'TT>NN' },
    { id: 'ID31', count: 5, reference: 0, label: 'TT>NN' },
    { id: 'ID32', count: 15, reference: 0, label: 'TT>NN' },
];
