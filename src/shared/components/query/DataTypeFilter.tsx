import * as React from 'react';
import { FunctionComponent, useCallback } from 'react';
import { SearchClause } from 'shared/components/query/filteredSearch/SearchClause';
import { QueryParser } from 'shared/lib/query/QueryParser';
import _ from 'lodash';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Checkbox, Dropdown } from 'react-bootstrap';
import { DropdownToggleProps } from 'react-bootstrap/lib/DropdownToggle';

import { DropdownMenuProps } from 'react-bootstrap/lib/DropdownMenu';

export interface IFilterDef {
    id: string;
    name: string;
    checked: boolean;
    togglable?: boolean;
}

export type DataTypeFilterProps = {
    isChecked: boolean;
    checkedOptions: string[];
    buttonText: string | JSX.Element;
    dataFilterActive?: IFilterDef[];
    onColumnToggled?: (
        columnId: string,
        dataFilterActive?: IFilterDef[]
    ) => void;
    resetColumnVisibility?: () => void;
    showResetColumnsButton?: boolean;
};

export class DataTypeFilter extends React.Component<DataTypeFilterProps, {}> {
    constructor(props: DataTypeFilterProps) {
        super(props);
        this.handleDataTypeSelect = this.handleDataTypeSelect.bind(this);
    }

    public render() {
        return this.dataTypeFilterMenu;
    }

    private get dataTypeFilterMenu() {
        return (
            <div data-test="data-type-filter" style={{ paddingRight: 10 }}>
                <div className="input-group input-group-sm input-group-toggle">
                    <Dropdown id="dropdown-custom-222">
                        <Dropdown.Toggle
                            {...({
                                rootCloseEvent: 'click',
                            } as DropdownToggleProps)}
                            className="btn-sm"
                            style={{
                                backgroundColor: 'white',
                            }}
                        >
                            {this.props.buttonText}
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                            {...({ bsRole: 'menu' } as DropdownMenuProps)}
                            style={{
                                paddingLeft: 10,
                                overflow: 'auto',
                                maxHeight: 300,
                                whiteSpace: 'nowrap',
                                paddingRight: 10,
                                background: 'white',
                                width: 'auto',
                            }}
                        >
                            <ul
                                className="list-unstyled"
                                style={{ padding: '5', marginLeft: '10' }}
                            >
                                <h5>Data type filters</h5>
                                {this.props.dataFilterActive &&
                                    _.map(
                                        this.props.dataFilterActive,
                                        (visibility: IFilterDef) => {
                                            return visibility.togglable ? (
                                                <li>
                                                    <Checkbox
                                                        data-id={visibility.id}
                                                        onChange={
                                                            this
                                                                .handleDataTypeSelect as React.FormEventHandler<
                                                                any
                                                            >
                                                        }
                                                        checked={
                                                            visibility.checked
                                                        }
                                                        inline
                                                    >
                                                        {visibility.name}
                                                    </Checkbox>
                                                </li>
                                            ) : null;
                                        }
                                    )}
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        );
    }

    private handleDataTypeSelect(evt: React.FormEvent<HTMLInputElement>) {
        const id = evt.currentTarget.getAttribute('data-id');
        // should update the search clausule (to make it compatible with the search field changes)
        if (this.props.onColumnToggled && id) {
            this.props.onColumnToggled(id, this.props.dataFilterActive);
        }
    }
}
