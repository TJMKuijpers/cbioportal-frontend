import React from 'react';
import { assert } from 'chai';
import { IMutationalCounts } from 'shared/model/MutationalSignature';
import { IMutationalSignature } from 'shared/model/MutationalSignature';
import {
    IColorDataBar,
    IMutationalBarChartProps,
    getColorsForSignatures,
} from './MutationalSignatureBarChart';

const sampleMutationalSignatureData: IMutationalCounts[] = [
    {
        uniqueSampleKey: 's09e3B34',
        patientId: 'TestPatient001',
        uniquePatientKey: '34a8e91b3',
        studyId: 'TestStudy001',
        mutationalSignatureLabel: 'A[C>T]G',
        mutationalSignatureClass: 'C>T',
        version: 'v2',
        count: 15,
    },
    {
        uniqueSampleKey: 's09e3B34',
        patientId: 'TestPatient001',
        uniquePatientKey: '34a8e91b3',
        studyId: 'TestStudy001',
        mutationalSignatureLabel: 'AC>TG',
        mutationalSignatureClass: '',
        version: 'v2',
        count: 12,
    },
    {
        uniqueSampleKey: 's09e3B34',
        patientId: 'TestPatient001',
        uniquePatientKey: '34a8e91b3',
        studyId: 'TestStudy001',
        mutationalSignatureLabel: 'A[C>T]G',
        mutationalSignatureClass: 'C>T',
        version: 'v2',
        count: 20,
    },
];

describe('MutationalSignatureBarChart', () => {
    it('Takes unsorted IMutationalCounts[] and transforms it to sorted IColorDataChart', () => {
        let result = getColorsForSignatures(sampleMutationalSignatureData);
        assert.deepEqual(result, [
            {
                uniqueSampleKey: 's09e3B34',
                patientId: 'TestPatient001',
                uniquePatientKey: '34a8e91b3',
                studyId: 'TestStudy001',
                mutationalSignatureLabel: 'AC>TG',
                mutationalSignatureClass: '',
                version: 'v2',
                count: 12,
                colorValue: '#EE4B2B',
                label: 'AC>TG',
            },
            {
                uniqueSampleKey: 's09e3B34',
                patientId: 'TestPatient001',
                uniquePatientKey: '34a8e91b3',
                studyId: 'TestStudy001',
                mutationalSignatureLabel: 'A[C>T]G',
                mutationalSignatureClass: 'C>T',
                version: 'v2',
                count: 15,
                colorValue: 'red',
                label: 'A[C>T]G',
            },
            {
                uniqueSampleKey: 's09e3B34',
                patientId: 'TestPatient001',
                uniquePatientKey: '34a8e91b3',
                studyId: 'TestStudy001',
                mutationalSignatureLabel: 'A[C>T]G',
                mutationalSignatureClass: 'C>T',
                version: 'v2',
                count: 20,
                colorValue: 'red',
                label: 'A[C>T]G',
            },
        ]);
    });
});
