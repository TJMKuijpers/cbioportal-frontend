import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import { computed, action, makeObservable, observable } from 'mobx';
import autobind from 'autobind-decorator';
import FeatureTitle from 'shared/components/featureTitle/FeatureTitle';
import {
    IMutationalSignature,
    IMutationalCounts,
} from 'shared/model/MutationalSignature';
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
    dataCount: { [version: string]: IMutationalCounts[] };
}
// use a state for the signature to update the signature based on

@observer
export default class MutationalSignaturesContainer extends React.Component<
    IMutationalSignaturesContainerProps,
    {}
> {
    state = {
        signatureProfile: this.props.data[this.props.version][0].meta.name,
    };
    callbackFunction = (childData: string) => {
        this.setState({
            signatureProfile: childData,
        });
    };
    constructor(props: IMutationalSignaturesContainerProps) {
        super(props);
        makeObservable(this);
    }

    @observable _selectedSignature: string = this.state.signatureProfile;
    @observable _selectedData: IMutationalCounts[] = this.props.dataCount[
        this.props.version
    ];
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
                                refStatus={false}
                                data={this.props.dataCount[this.props.version]}
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
