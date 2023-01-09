import * as React from 'react';
import { observer } from 'mobx-react';
import { computed, action, makeObservable } from 'mobx';
import autobind from 'autobind-decorator';
import FeatureTitle from 'shared/components/featureTitle/FeatureTitle';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import ClinicalInformationMutationalSignatureTable from '../clinicalInformation/ClinicalInformationMutationalSignatureTable';
import Select from 'react-select';
import { MolecularProfile } from 'cbioportal-ts-api-client';
import {
    getVersionOption,
    getVersionOptions,
} from 'shared/lib/GenericAssayUtils/MutationalSignaturesUtils';
import _ from 'lodash';
import MutationalBarChart from 'pages/patientView/mutationalSignatures/MutationalSignatureBarChart';
export interface IMutationalSignaturesContainerProps {
    data: { [version: string]: IMutationalSignature[] };
    profiles: MolecularProfile[];
    onVersionChange: (version: string) => void;
    version: string;
}

@observer
export default class MutationalSignaturesContainer extends React.Component<
    IMutationalSignaturesContainerProps,
    {}
> {
    constructor(props: IMutationalSignaturesContainerProps) {
        super(props);
        makeObservable(this);
    }
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
        console.log({ ClinicalInformationMutationalSignatureTable });
        console.log(this.props);
        this.props.onVersionChange(option.value);
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

                <div
                    style={{
                        display: 'inline-block',
                        width: '250',
                        height: '200',
                    }}
                >
                    <MutationalBarChart
                        signature={'SBS11 (Aging)'}
                        height={450}
                        width={500}
                        refstatus={true}
                    ></MutationalBarChart>
                </div>
                {this.props.data && (
                    <div>
                        <FeatureTitle
                            title="Mutational Signatures"
                            isLoading={false}
                            className="pull-left"
                        />
                        <ClinicalInformationMutationalSignatureTable
                            data={this.props.data[this.props.version]}
                        />
                    </div>
                )}
            </div>
        );
    }
}
