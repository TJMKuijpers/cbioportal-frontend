import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import { computed, action, makeObservable, observable } from 'mobx';
import autobind from 'autobind-decorator';
import FeatureTitle from 'shared/components/featureTitle/FeatureTitle';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import ClinicalInformationMutationalSignatureTable from '../clinicalInformation/ClinicalInformationMutationalSignatureTable';
import Select from 'react-select';
import { MolecularProfile } from 'cbioportal-ts-api-client';
import {
    getVersionOption,
    getVersionOptions,
    MutationalSignaturesVersion,
} from 'shared/lib/GenericAssayUtils/MutationalSignaturesUtils';
import _ from 'lodash';
import MutationalBarChart, {
    DataMutSig,
} from 'pages/patientView/mutationalSignatures/MutationalSignatureBarChart';

export interface IMutationalSignaturesContainerProps {
    data: { [version: string]: IMutationalSignature[] };
    profiles: MolecularProfile[];
    onVersionChange: (version: string) => void;
    version: string;
}
// use a state for the signature to update the signature based on

var sigDataV3 = [
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

@observer
export default class MutationalSignaturesContainer extends React.Component<
    IMutationalSignaturesContainerProps,
    {}
> {
    state = {
        signatureProfile: this.props.data[this.props.version][0].meta.name,
        signatureData: sigDataV3,
    };
    callbackFunction = (childData: string, childDataObject: DataMutSig[]) => {
        this.setState({
            signatureProfile: childData,
            signatureData: childDataObject,
        });
    };
    constructor(props: IMutationalSignaturesContainerProps) {
        super(props);
        makeObservable(this);
    }

    @observable _selectedSignature: string = this.state.signatureProfile;
    @observable _selectedData: DataMutSig[] = sigDataV3;
    @computed get availableVersions() {
        // mutational signatures version is stored in the profile id
        // split the id by "_", the last part is the version info
        // we know split will always have results
        // use uniq function to get all unique versions
        return _.chain(this.props.profiles)
            .map(profile => _.last(profile.molecularProfileId.split('_'))!)
            .filter(item => item in this.props.data)
            .uniq()
            .value();
    }

    @computed get selectedVersion(): string {
        // all versions is defined in the MutationalSignaturesVersion
        return (
            _.find(
                this.availableVersions,
                version => version === this.props.version
            ) || this.availableVersions[0]
        );
    }

    @action.bound
    private onVersionChange(option: { label: string; value: string }): void {
        this.props.onVersionChange(option.value);
        this.state.signatureProfile = this.props.data[
            option.value
        ][0].meta.name;
    }
    @action.bound changeSignature(name: string): void {
        this._selectedSignature = name;
        // get the dataset with this signature
    }

    public render() {
        return (
            <div data-test="MutationalSignaturesContainer">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>Mutational Signatures Version:</strong>
                        <div
                            style={{
                                display: 'inline-block',
                                marginLeft: 5,
                                width: 400,
                            }}
                        >
                            <Select
                                className="basic-single"
                                name={'mutationalSignaturesVersionSelector'}
                                classNamePrefix={
                                    'mutationalSignaturesVersionSelector'
                                }
                                value={getVersionOption(this.selectedVersion)}
                                onChange={this.onVersionChange}
                                options={getVersionOptions(
                                    this.availableVersions
                                )}
                                searchable={false}
                                clearable={false}
                            />
                        </div>
                    </div>
                </div>

                {this.props.data && (
                    <div>
                        <FeatureTitle
                            title="Mutational Signatures"
                            isLoading={false}
                            className="pull-left"
                        />
                        <div
                            style={{
                                display: 'inline-block',
                                width: '500',
                                height: '600',
                            }}
                        >
                            <MutationalBarChart
                                signature={this.state.signatureProfile}
                                height={600}
                                width={900}
                                refstatus={true}
                                data={this.state.signatureData}
                                version={this.props.version}
                            ></MutationalBarChart>
                        </div>
                        <ClinicalInformationMutationalSignatureTable
                            data={this.props.data[this.props.version]}
                            parentCallback={this.callbackFunction}
                        />
                    </div>
                )}
            </div>
        );
    }
}
