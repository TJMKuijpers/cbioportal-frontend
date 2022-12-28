import { assert } from 'chai';
import { GenericAssayData } from 'cbioportal-ts-api-client';
import { validateMutationalSignatureRawData,retrieveMutationalSignatureVersionFromData } from './MutationalSignaturesUtils';

describe('MutationalSignaturesUtils', () => {
    describe('validateMutationalSignatureRawData()', () => {
        it('single version: data come from single profile is not valid', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
            ];

            assert.isFalse(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });

        it('single version: data come from paired profiles is valid', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
                {
                    molecularProfileId: 'study1_pvalue_v2',
                },
            ];

            assert.isTrue(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });

        it('single version: data come from paired profiles is valid, have other profiles', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
                {
                    molecularProfileId: 'study1_pvalue_v2',
                },
                {
                    molecularProfileId: 'study1_category_v2',
                },
            ];

            assert.isTrue(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });

        it('multiple version: data come from single profile is not valid', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
                {
                    molecularProfileId: 'study1_contribution_v3',
                },
            ];

            assert.isFalse(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });

        it('multiple version: data come from paired profiles is valid', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
                {
                    molecularProfileId: 'study1_pvalue_v2',
                },
                {
                    molecularProfileId: 'study1_contribution_v3',
                },
                {
                    molecularProfileId: 'study1_pvalue_v3',
                },
            ];

            assert.isTrue(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });

        it('multiple version: data come from paired profiles is valid, have other profiles', () => {
            const genericAssayData = [
                {
                    molecularProfileId: 'study1_contribution_v2',
                },
                {
                    molecularProfileId: 'study1_pvalue_v2',
                },
                {
                    molecularProfileId: 'study1_category_v2',
                },
                {
                    molecularProfileId: 'study1_contribution_v3',
                },
                {
                    molecularProfileId: 'study1_pvalue_v3',
                },
                {
                    molecularProfileId: 'study1_category_v3',
                },
            ];

            assert.isTrue(
                validateMutationalSignatureRawData(
                    genericAssayData as GenericAssayData[]
                )
            );
        });
    });
    describe('setMutationalSignatureVersion', () => {
        it('Molecular profile Id _v2 sets MutationalSignature to .V2', () => {
            var profile_test = ['study_test_v2']
            assert.isTrue(retrieveMutationalSignatureVersionFromData(profile_test) == 'v2');
        });
        it('Molecular profile Id _v3 sets MutationalSignature to .V3', () => {
            var profile_test = ['test_study_v3'];
            assert.isTrue(retrieveMutationalSignatureVersionFromData(profile_test) == 'v3');
        });
        it('Studies with two version of mutational signatures is set to .V3', () => {
            var profile_test = ['test_study_v2', 'test_study_v3']
            assert.isTrue(retrieveMutationalSignatureVersionFromData(profile_test) == 'v3')
        })
    });
})
