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
import MutationalBarChart from 'pages/patientView/mutationalSignatures/MutationalSignatureBarChart';
import SignatureTextBox from 'pages/patientView/mutationalSignatures/SignatureTextBox';

export interface IMutationalSignaturesContainerProps {
    data: { [version: string]: IMutationalSignature[] };
    profiles: MolecularProfile[];
    onVersionChange: (version: string) => void;
    version: string;
    dataCount: { [version: string]: IMutationalCounts[] };
}
const gridContainerElement = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '20px',
    width: '100%',
};
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
        // not all patients have the newest mutational signatures --> check if data is present before giving the options
        let possibleOptions = this.props.profiles
            .map(profile => _.last(profile.molecularProfileId.split('_'))!)
            .filter(item => item in this.props.data);
        return _.uniq(possibleOptions);
    }
    @observable urlSignature = '';
    @observable descriptionSignature = '';

    @computed get selectURLSignature(): string {
        let urlLink = this.props.data[this.props.version][0].meta.url;
        return urlLink;
    }
    @computed get selectDescriptionSignature(): string {
        let description = this.props.data[this.props.version][0].meta
            .description;
        return description;
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
        this.selectDescriptionSignature;
        this.selectURLSignature;
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
                        {!_.isEmpty(this.props.dataCount) && (
                            <div style={gridContainerElement}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <MutationalBarChart
                                        signature={this.state.signatureProfile}
                                        height={600}
                                        width={700}
                                        refStatus={false}
                                        data={
                                            this.props.dataCount[
                                                this.props.version
                                            ]
                                        }
                                        version={this.props.version}
                                    ></MutationalBarChart>
                                </div>
                            </div>
                        )}

                        <div>
                            <ClinicalInformationMutationalSignatureTable
                                data={this.props.data[this.props.version]}
                                parentCallback={this.callbackFunction}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
