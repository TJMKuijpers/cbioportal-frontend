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
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        {...({ bsRole: 'menu' } as DropdownMenuProps)}
                        style={{
                            paddingLeft: 10,
                            overflow: 'auto',
                            maxHeight: 300,
                            whiteSpace: 'nowrap',
                            paddingRight: 10,
                            width: 'auto',
                        }}
                    >
                        {props.dataFilterActive!.map(type => {
                            return (
                                <label style={{ paddingTop: 5 }}>
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
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
    //}
};

export function createDataTypeUpdate(allFilters: IFilterDef[]): string[] {
    const toAdd: string[] = [];
    allFilters.map((subDataFilter: IFilterDef) =>
        subDataFilter.checked ? toAdd.push(subDataFilter.id) : ''
    );
    return toAdd;
}
