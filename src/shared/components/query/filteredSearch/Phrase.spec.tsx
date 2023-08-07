import { ListPhrase } from 'shared/components/query/filteredSearch/Phrase';
import { FullTextSearchNode } from 'shared/lib/query/textQueryUtils';

describe('Phrase', () => {
    describe('ListPhrase', () => {
        it('should match when single element in phraseList', () => {
            const phrase = new ListPhrase('a', 'test:a', ['studyId']);
            const study = { studyId: 'a' } as FullTextSearchNode;
            expect(phrase.match(study)).toBe(true);
        });

        it('should not match when single element in phraseList does not match', () => {
            const phrase = new ListPhrase('a', 'test:a', ['studyId']);
            const study = { studyId: 'b' } as FullTextSearchNode;
            expect(phrase.match(study)).toBe(false);
        });

        it('should do a full (instead of partial) match', () => {
            const phrase = new ListPhrase('a', 'test:a', ['studyId']);
            const study = { studyId: 'ab' } as FullTextSearchNode;
            expect(phrase.match(study)).toBe(false);
        });

        it('should match when multiple elements in phraseList', () => {
            const phrase = new ListPhrase('a,b', 'test:a,b', ['studyId']);
            const study = { studyId: 'a' } as FullTextSearchNode;
            expect(phrase.match(study)).toBe(true);
        });

        it('Should return a match when field has measured samples', () => {
            const phrase = new ListPhrase('a', 'test:a', ['cnaSampleCount']);
            const study = { cnaSampleCount: 80 } as FullTextSearchNode;
            expect(phrase.dataCountPerDataType(study, ['cnaSampleCount'])).toBe(
                true
            );
        });
        it('Should return no match when field has measured samples and match in phraselist', () => {
            const phrase = new ListPhrase('a', 'test:a', ['cnaSampleCount']);
            const study = { cnaSampleCount: 0 } as FullTextSearchNode;
            expect(phrase.dataCountPerDataType(study, ['cnaSampleCount'])).toBe(
                false
            );
        });
        it('Should return match when two field have measured samples', () => {
            const phrase = new ListPhrase('a', 'test:a', ['cnaSampleCount']);
            const study = {
                methylationHm27SampleCount: 3,
                cnaSampleCount: 4,
            } as FullTextSearchNode;
            expect(
                phrase.dataCountPerDataType(study, [
                    'cnaSampleCount',
                    'methylationHm27SampleCount',
                ])
            ).toBe(true);
        });
        it('Should return no match when field has measured samples and one field having no samples', () => {
            const phrase = new ListPhrase('a', 'test:a', ['cnaSampleCount']);
            const study = {
                methylationHm27SampleCount: 3,
                cnaSampleCount: 0,
            } as FullTextSearchNode;
            expect(
                phrase.dataCountPerDataType(study, [
                    'cnaSampleCount',
                    'methylationHm27SampleCount',
                ])
            ).toBe(false);
        });
    });
});
