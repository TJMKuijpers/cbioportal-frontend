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
var sigData = [
    { id: 'a>c', count: 0, reference: 10, label: 'Mutation a>c' },
    { id: 'a>t', count: 0, reference: 25, label: 'Mutation a>t' },
    { id: 'a>g', count: 0, reference: 50, label: 'Mutation a>g' },
    { id: 't>g', count: 0, reference: 20, label: 'Mutation t>g' },
    { id: 't>c', count: 10, reference: 10, label: 'Mutation t>c' },
    { id: 't>a', count: 25, reference: 25, label: 'Mutation t>a' },
    { id: 'c>t', count: 40, reference: 80, label: 'Mutation c>t' },
    { id: 'c>a', count: 10, reference: 50, label: 'Mutation c>a' },
    { id: 'c>g', count: 30, reference: 30, label: 'Mutation c>g' },
    { id: 'g>c', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'g>t', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'g>a', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID1', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID2', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID3', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID4', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID5', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID6', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID7', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID8', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID9', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID10', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID11', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID12', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID13', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID14', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID15', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID16', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID17', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID18', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID19', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID20', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID21', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID22', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID23', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID24', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID25', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID26', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID27', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID28', count: 10, reference: 0, label: 'Mutation a>c' },
    { id: 'ID29', count: 30, reference: 0, label: 'Mutation a>c' },
    { id: 'ID30', count: 70, reference: 0, label: 'Mutation a>c' },
    { id: 'ID31', count: 5, reference: 0, label: 'Mutation a>c' },
    { id: 'ID32', count: 15, reference: 0, label: 'Mutation a>c' },
];
var sigData2 = [
    { id: 'a>c', count: 10, reference: 10, label: 'Mutation a>c' },
    { id: 'a>t', count: 20, reference: 25, label: 'Mutation a>t' },
    { id: 'a>g', count: 30, reference: 50, label: 'Mutation a>g' },
    { id: 't>g', count: 40, reference: 20, label: 'Mutation t>g' },
    { id: 't>c', count: 10, reference: 10, label: 'Mutation t>c' },
    { id: 't>a', count: 25, reference: 25, label: 'Mutation t>a' },
    { id: 'c>t', count: 40, reference: 80, label: 'Mutation c>t' },
    { id: 'c>a', count: 10, reference: 50, label: 'Mutation c>a' },
    { id: 'c>g', count: 30, reference: 30, label: 'Mutation c>g' },
    { id: 'g>c', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'g>t', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'g>a', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID1', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID2', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID3', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID4', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID5', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID6', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID7', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID8', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID9', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID10', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID11', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID12', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID13', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID14', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID15', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID16', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID17', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID18', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID19', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID20', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID21', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID22', count: 10, reference: 50, label: 'Mutation a>c' },
    { id: 'ID23', count: 30, reference: 30, label: 'Mutation a>c' },
    { id: 'ID24', count: 70, reference: 70, label: 'Mutation a>c' },
    { id: 'ID25', count: 5, reference: 25, label: 'Mutation a>c' },
    { id: 'ID26', count: 15, reference: 50, label: 'Mutation a>c' },
    { id: 'ID27', count: 40, reference: 80, label: 'Mutation a>c' },
    { id: 'ID28', count: 10, reference: 0, label: 'Mutation a>c' },
    { id: 'ID29', count: 30, reference: 0, label: 'Mutation a>c' },
    { id: 'ID30', count: 70, reference: 0, label: 'Mutation a>c' },
    { id: 'ID31', count: 5, reference: 0, label: 'Mutation a>c' },
    { id: 'ID32', count: 15, reference: 0, label: 'Mutation a>c' },
];

@observer
export default class MutationalSignaturesContainer extends React.Component<
    IMutationalSignaturesContainerProps,
    {}
> {
    state = {
        signatureProfile: this.props.data[this.props.version][0].meta.name,
        signatureData: sigData,
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
    @observable _selectedData: DataMutSig[] = sigData;
    @computed get availableVersions() {
        // mutational signatures version is stored in the profile id
        // split the id by "_", the last part is the version info
        // we know split will always have results
        // use uniq function to get all unique versions
        // not all patients have the newest mutational signatures --> check if data is present before giving the options
        let possibleOptions = this.props.profiles.map(
            profile => _.last(profile.molecularProfileId.split('_'))!
        );
        possibleOptions = possibleOptions.filter(item =>
            Object.keys(this.props.data).includes(item)
        );
        return _.chain(possibleOptions)
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
                                width: '250',
                                height: '200',
                            }}
                        >
                            <MutationalBarChart
                                signature={this.state.signatureProfile}
                                height={450}
                                width={500}
                                refstatus={true}
                                data={this.state.signatureData}
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
