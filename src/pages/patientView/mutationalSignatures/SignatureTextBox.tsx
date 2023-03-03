import React, { CSSProperties } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boolean, number, string } from 'yargs';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import { adjustVisibility } from 'shared/components/alterationsTableUtils';
import { Modal } from 'react-bootstrap';
import { ISelectedTrialFeedbackFormData } from 'pages/patientView/trialMatch/TrialMatchTable';
import Tooltip from 'rc-tooltip';

export interface ISignatureTextBoXProps {
    height: number;
    width: number;
    url: string;
    description: string;
    signature: string;
    show: boolean;
    onHide: () => void;
    selectMutationalSignature: (childData: string, visibility: boolean) => void;
}

export default class SignatureTextBox extends React.Component<
    ISignatureTextBoXProps,
    {}
> {
    sendData = () => {
        this.props.selectMutationalSignature(this.props.signature, false);
    };

    @computed get tooltipInfo() {
        return (
            <div
                style={{
                    maxWidth: 250,
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.428571429',
                    color: '#333333',
                }}
                data-test="SignificantMutationalSignaturesTooltip"
            >
                <div
                    style={{
                        maxWidth: 250,
                        fontFamily:
                            'Helvetica Neue, Helvetica, Arial, sans-serif',
                        fontSize: '12px',
                        lineHeight: '1.428571429',
                        color: '#333333',
                    }}
                >
                    <h5>
                        <b>Signature:</b>
                        {this.props.signature}
                    </h5>
                    <p>
                        <b>Description: </b>
                        {this.props.description}
                    </p>
                    <p>
                        <a href={this.props.url} target="_blank">
                            External link to signature (opens new tab)
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    public render() {
        return (
            <Tooltip
                overlayClassName="oncokb-tooltip"
                overlay={this.tooltipInfo}
            >
                <a href="#"></a>
            </Tooltip>
        );
    }
}
