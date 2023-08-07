import * as React from 'react';
import { FunctionComponent } from 'react';
import { SearchClause } from 'shared/components/query/filteredSearch/SearchClause';

import { FieldProps } from 'shared/components/query/filteredSearch/field/FilterFormField';
import { ListPhrase } from 'shared/components/query/filteredSearch/Phrase';
import { TableHeaderCellFilterIcon } from 'pages/studyView/table/TableHeaderCellFilterIcon';
import { getDataTypeStudyOverlay } from 'pages/studyView/TableUtils';
import { createQueryUpdate } from 'shared/components/query/filteredSearch/field/CheckboxFilterField';
import styles from 'pages/studyView/table/tables.module.scss';

export type dataTypeFilterField = {
    input: typeof filterDataSets;
    label: string;
    options: string[];
};
export const filterDataSets: FunctionComponent<FieldProps> = props => {
    const options: string[] = props.filter.form.options;
    if (options.length < 2) {
        return null;
    }
    const prefix: string = props.filter.phrasePrefix || '';
    const checkedOptions: string[] = [];
    const relevantClauses: SearchClause[] = [];
    const toRemove: ListPhrase[] = [];
    props.query.forEach(clause => {
        const phraseToRemove = clause
            .getPhrases()
            .find(p => (p as ListPhrase).prefix === prefix);
        if (phraseToRemove) {
            relevantClauses.push(clause);
            toRemove.push(phraseToRemove as ListPhrase);
        }
    });
    for (const option of options) {
        const isChecked = relevantClauses.find(c =>
            c.getPhrases().find(x => x.phrase.includes(option))
        );
        if (isChecked) {
            checkedOptions.push(option);
        }
    }
    return (
        <div>
            <h5>Data type filter</h5>
            <div>
                {options.map((option: string) => {
                    const id = `input-${option}`;
                    const isChecked = checkedOptions.includes(option);
                    return (
                        <TableHeaderCellFilterIcon
                            cellMargin={2}
                            dataTest="gene-column-header"
                            className={styles.displayFlex}
                            showFilter={true}
                            isFiltered={isChecked}
                            onClickCallback={() => {
                                updatePhrases(option, !isChecked);
                                const update = createQueryUpdate(
                                    toRemove,
                                    checkedOptions,
                                    props.filter
                                );
                                props.onChange(update);
                            }}
                            overlay={getDataTypeStudyOverlay(option)}
                        >
                            <span>{option}</span>
                        </TableHeaderCellFilterIcon>
                    );
                })}
            </div>
        </div>
    );

    function updatePhrases(option: string, checked?: boolean) {
        if (checked) {
            checkedOptions.push(option);
        } else {
            const index = checkedOptions.indexOf(option);
            checkedOptions.splice(index, 1);
        }
    }
};
