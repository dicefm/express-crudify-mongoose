import crudify from './index';

describe('crudify', () => {
    let rest;
    before(() => {
        rest = crudify({
        });
    });

    describe('should expose', () => {
        it('an object', () => {
            expect(rest).to.be.an('object');
        });
    });
});
