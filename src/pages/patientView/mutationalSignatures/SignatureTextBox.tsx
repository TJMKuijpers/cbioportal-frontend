import React, { CSSProperties } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boolean, number, string } from 'yargs';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import { adjustVisibility } from 'shared/components/alterationsTableUtils';

export interface ISignatureTextBoXProps {
    visible: boolean;
    height: number;
    width: number;
    url: string;
    description: string;
    signature: string;
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
    @action.bound closeModal() {
        this.sendData();
        console.log('function called');
    }

    public render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: '60%',
                    left: '25%',
                    transform: 'translate(-50%,-50%)',
                }}
            >
                {this.props.visible && (
                    <div
                        style={{
                            color: 'black',
                            border: '2px solid #bacdd8',
                            borderRadius: '5px',
                            width: '400px',
                            backgroundColor: 'white',
                            padding: '5px',
                        }}
                    >
                        <div
                            style={{
                                float: 'right',
                                border: '0px #bacdd8',
                                color: '#bacdd8',
                            }}
                        >
                            <button onClick={this.closeModal.bind(this)}>
                                X
                            </button>
                        </div>
                        <div>
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
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
