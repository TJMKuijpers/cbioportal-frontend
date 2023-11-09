import { assert } from 'chai';
var assert = require('assert');
var goToUrlAndSetLocalStorage = require('../../../shared/specUtils')
    .goToUrlAndSetLocalStorage;
var useExternalFrontend = require('../../../shared/specUtils')
    .useExternalFrontend;
const CBIOPORTAL_URL = process.env.CBIOPORTAL_URL.replace(/\/$/, '');

describe('DataTypeFilter', () => {
    it('Studyview page has a dropdown menu for data filters', () => {
        var url = `${CBIOPORTAL_URL}`;
        goToUrlAndSetLocalStorage(url, true);
        const a = $('[data-tour="cancer-study-list-container"]');
        var url = `${CBIOPORTAL_URL}/results/oncoprint?Z_SCORE_THRESHOLD=2.0&cancer_study_id=coadread_tcga_pub&cancer_study_list=coadread_tcga_pub&case_set_id=coadread_tcga_pub_nonhypermut&gene_list=KRAS%20NRAS%20BRAF&gene_set_choice=user-defined-list&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=coadread_tcga_pub_gistic&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=coadread_tcga_pub_mutations`;
        goToUrlAndSetLocalStorage(url, true);
        var dropdownMenu = 'div[data-test=dropdown-data-type-filter]';
        $(dropdownMenu).waitForExist({ timeout: 10000 });
        assert.equal($(dropdownMenu).isExisting(), true);
    });
    it('Click on the dropdown menu to open the selection options', () => {
        $(
            `${data - type - filter - test} button#dropdown-study-data-filter`
        ).click();
    });
});
