import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import { computed, action, makeObservable, observable } from 'mobx';
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
    version: string;
    onVersionChange: (version: string) => void;
    dataCount: { [version: string]: IMutationalCounts[] };
}

@observer
export default class MutationalSignaturesContainer extends React.Component<
    IMutationalSignaturesContainerProps,
    {}
> {
    state = {
        signatureProfile: this.props.data[this.props.version][0].meta.name,
        signatureURL: this.props.data[this.props.version][0].meta.url,
        signatureDescription: this.props.data[this.props.version][0].meta
            .description,
        visible: false,
    };

    callbackFunction = (childData: string, visibility: boolean) => {
        this.setState({
            signatureProfile: childData,
            visible: visibility,
            signatureURL: this.props.data[this.props.version].filter(obj => {
                if (childData === obj.meta.name) {
                    return obj;
                }
            })[0].meta.url,
            signatureDescription: this.props.data[this.props.version].filter(
                obj => {
                    if (childData === obj.meta.name) {
                        return obj;
                    }
                }
            )[0].meta.description,
        });
        console.log(this.state.visible);
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
    @observable urlSignature: string;
    @observable descriptionSignature: string;
    @observable modalVisible: boolean = this.state.visible;
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

    // @action.bound
    // private onVersionChange(option: { label: string; value: string }): void {
    //     this.props.onVersionChange(option.value);
    //     this.state.signatureProfile = this.props.data[
    //         option.value
    //         ][0].meta.name;
    //     this.state.visible = false;
    // }
    @action.bound changeSignature(name: string): void {
        this._selectedSignature = name;
        // get the dataset with this signature
    }

    @action.bound
    private onVersionChange(option: { label: string; value: string }): void {
        this.props.onVersionChange(option.value);
        this.state.signatureProfile = this.props.data[
            option.value
        ][0].meta.name;
        this.state.visible = false;
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
                                value={getVersionOption(this.props.version)}
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
                <div></div>
                <SignatureTextBox
                    height={100}
                    width={100}
                    url={this.state.signatureURL}
                    description={this.state.signatureDescription}
                    signature={this.state.signatureProfile}
                    parentCallback={this.callbackFunction}
                    show={this.state.visible}
                    onHide={() => {
                        this.state.visible = false;
                    }}
                ></SignatureTextBox>
                {this.props.data && (
                    <div>
                        {!_.isEmpty(this.props.dataCount) && (
                            <MutationalBarChart
                                signature={this.state.signatureProfile}
                                height={220}
                                width={800}
                                refStatus={false}
                                data={this.props.dataCount[this.props.version]}
                                version={this.props.version}
                            ></MutationalBarChart>
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
