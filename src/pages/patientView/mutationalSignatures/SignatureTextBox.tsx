import * as React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boolean, number, string } from 'yargs';
import { IMutationalSignature } from 'shared/model/MutationalSignature';

export interface ISignatureTextBoXProps {
    visible: boolean;
    height: number;
    width: number;
    url: string;
    description: string;
    version: string;
    signature: string;
}

const divStyle = {
    color: 'black',
    border: '2px solid #bacdd8',
    borderRadius: '5px',
    display: 'inline-block',
    width: '200px',
};
export default class SignatureTextBox extends React.Component<
    ISignatureTextBoXProps,
    {}
> {
    public render() {
        return (
            <div>
                <div style={divStyle}>
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
        );
    }
}
