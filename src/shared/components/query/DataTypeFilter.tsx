import * as React from 'react';
import { FunctionComponent, useCallback } from 'react';
import {
    AndSearchClause,
    FILTER_VALUE_SEPARATOR,
    NotSearchClause,
    QueryUpdate,
    SearchClause,
} from 'shared/components/query/filteredSearch/SearchClause';
import { QueryParser } from 'shared/lib/query/QueryParser';
import _ from 'lodash';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Checkbox, Dropdown } from 'react-bootstrap';
import { DropdownToggleProps } from 'react-bootstrap/lib/DropdownToggle';

import { DropdownMenuProps } from 'react-bootstrap/lib/DropdownMenu';
import {
    createListPhrase,
    FullTextSearchFields,
} from 'shared/lib/query/textQueryUtils';

export interface IFilterDef {
    id: string;
    name: string;
    checked: boolean;
}

export type IDataTypeFilterProps = {
    parser: QueryParser;
    query: SearchClause[];
    dataFilter: string[];
    isChecked: boolean;
    buttonText: string | JSX.Element;
    dataFilterActive?: IFilterDef[];
};

export class DataTypeFilter extends React.Component<IDataTypeFilterProps, {}> {
    constructor(props: IDataTypeFilterProps) {
        super(props);
    }
    public render() {
        return this.dataTypeFilterIcons;
    }
    private get dataTypeFilterIcons() {
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
                                width: 'auto',
                            }}
                        >
                            {this.props.dataFilterActive!.map(type => {
                                return (
                                    <label>
                                        <input
                                            type="checkbox"
                                            style={{ marginRight: 2 }}
                                            onClick={() => {
                                                type.checked = !type.checked;
                                                createDataTypeUpdate(
                                                    type.id,
                                                    type,
                                                    this.props.dataFilterActive!
                                                );
                                            }}
                                        />
                                        {}
                                        <span>{type.name}</span>
                                    </label>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        );
    }
}

export function createDataTypeUpdate(
    dataType: string,
    type: IFilterDef,
    allFilters: IFilterDef[]
): string[] {
    const toAdd: string[] = [];
    allFilters.map((subDataFilter: IFilterDef) =>
        subDataFilter.checked ? toAdd.push(subDataFilter.id) : ''
    );
    console.log('clicked');
    console.log(allFilters);
    console.log(toAdd);
    return toAdd;
    // toAdd contains the string[] argument for createListPhrase
    // phrase is always empy because we don't care about the search field

    // Add a AndSearchClause
    /*    const test = [new AndSearchClause([createListPhrase(toAdd[0], phrase[0], fields)])]
    console.log(test)*/

    /*else {
        const phrase = optionsToAdd.join(FILTER_VALUE_SEPARATOR);
        toAdd = [
            new AndSearchClause([createListPhrase(prefix, phrase, fields)]),
        ];
    }
    return { toAdd, toRemove };*/

    // create a filter that is just same as search box and reference genome
    /*let toAdd: SearchClause[];
    const toRemove = phrasesToRemove;
    const options = filter.form.options;
    const prefix = filter.phrasePrefix || '';
    const fields = filter.nodeFields;

    const onlyAnd = optionsToAdd.length === options.length;
    const onlyNot = !optionsToAdd.length;
    const moreAnd = optionsToAdd.length > options.length / 2;
    if (onlyAnd) {
        toAdd = [];
    } else if (onlyNot || moreAnd) {
        if (filter.phrasePrefix != 'data-type-study') {
            const phrase = options
                .filter(o => !optionsToAdd.includes(o))
                .join(FILTER_VALUE_SEPARATOR);

            toAdd = [
                new NotSearchClause(createListPhrase(prefix, phrase, fields)),
            ];
        } else {
            const phrase = optionsToAdd.join(FILTER_VALUE_SEPARATOR);
            if (phrase !== '') {
                toAdd = [
                    new AndSearchClause([
                        createListPhrase(prefix, phrase, fields),
                    ]),
                ];
            } else {
                toAdd = [];
            }
        }
    }*/
}
