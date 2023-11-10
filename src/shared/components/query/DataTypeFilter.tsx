import * as React from 'react';
import { FunctionComponent } from 'react';
import { Dropdown } from 'react-bootstrap';
import { DropdownToggleProps } from 'react-bootstrap/lib/DropdownToggle';

import { DropdownMenuProps } from 'react-bootstrap/lib/DropdownMenu';
import { QueryStore } from 'shared/components/query/QueryStore';

export interface IFilterDef {
    id: string;
    name: string;
    checked: boolean;
}

export type IDataTypeFilterProps = {
    dataFilter: string[];
    isChecked: boolean;
    buttonText: string | JSX.Element;
    dataFilterActive?: IFilterDef[];
    store: QueryStore;
    samplePerStudy: any[];
};

export const DataTypeFilter: FunctionComponent<IDataTypeFilterProps> = props => {
    return (
        <div data-test="dropdown-data-type-filter" style={{ paddingRight: 10 }}>
            <div className="input-group input-group-sm input-group-toggle">
                <Dropdown id="dropdown-study-data-filter">
                    <Dropdown.Toggle
                        {...({
                            rootCloseEvent: 'click',
                        } as DropdownToggleProps)}
                        className="btn-sm"
                    >
                        {props.buttonText}
                        {props.store.dataTypeFilters!.length > 0 && (
                            <span
                                className="oncoprintDropdownCount"
                                style={{ marginLeft: 5 }}
                            >
                                {props.store.dataTypeFilters!.length} /{' '}
                                {props.dataFilterActive!.length}
                            </span>
                        )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        {...({ bsRole: 'menu' } as DropdownMenuProps)}
                        style={{
                            paddingLeft: 10,
                            overflow: 'auto',
                            maxHeight: 300,
                            whiteSpace: 'nowrap',
                            paddingRight: 10,
                            width: 300,
                        }}
                    >
                        {props.dataFilterActive!.map((type, i) => {
                            return (
                                <div style={{ display: 'inline' }}>
                                    <label
                                        style={{
                                            paddingTop: 5,
                                            float: 'left',
                                            width: '75%',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{ marginRight: 2 }}
                                            onClick={() => {
                                                type.checked = !type.checked;
                                                props.store.dataTypeFilters = createDataTypeUpdate(
                                                    props.dataFilterActive!
                                                );
                                            }}
                                        />
                                        {}
                                        <span style={{ paddingLeft: 5 }}>
                                            {type.name}
                                        </span>
                                    </label>
                                    <label
                                        style={{
                                            paddingTop: 5,
                                            float: 'right',
                                            color: 'lightgrey',
                                            marginRight: 2,
                                        }}
                                    >
                                        {props.samplePerStudy![i]}
                                    </label>
                                </div>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export function createDataTypeUpdate(allFilters: IFilterDef[]): string[] {
    const toAdd: string[] = [];
    allFilters.map((subDataFilter: IFilterDef) =>
        subDataFilter.checked ? toAdd.push(subDataFilter.id) : ''
    );
    return toAdd;
}
