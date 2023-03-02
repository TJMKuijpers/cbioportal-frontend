import React, { CSSProperties } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boolean, number, string } from 'yargs';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import { adjustVisibility } from 'shared/components/alterationsTableUtils';
import { Modal } from 'react-bootstrap';
import { ISelectedTrialFeedbackFormData } from 'pages/patientView/trialMatch/TrialMatchTable';

export interface ISignatureTextBoXProps {
    height: number;
    width: number;
    url: string;
    description: string;
    signature: string;
    show: boolean;
    onHide: () => void;
    parentCallback: (childData: string, visibility: boolean) => void;
}

export default class SignatureTextBox extends React.Component<
    ISignatureTextBoXProps,
    {}
> {
    @observable selectedSignature: string = '';

    sendData = () => {
        this.props.parentCallback(this.props.signature, false);
    };

    public render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{'COSMIC signature'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        <b>Signature:</b>
                        {this.props.signature}
                    </h4>
                    <p>
                        <b>Description: </b>
                        {this.props.description}
                    </p>
                    <p>
                        <a href={this.props.url} target="_blank">
                            Go to signature on Cosmic website
                        </a>
                    </p>
                </Modal.Body>
            </Modal>
        );
    }
}
