import cleanBody from './clean-body';
const input = 'events';

describe('cleanBody', () => {
    it('should work and call next', () => {
        const sendSpy = sinon.spy();
        const nextSpy = sinon.spy();
        const body = {
            foo: 'bar',
            poo: ':(',
        };

        cleanBody({readonly: ['poo']})({body}, null, nextSpy);

        expect(nextSpy).to.have.been.callCount(1);

        expect(body).to.not.have.property('poo');
        expect(body).to.deep.eq({foo: 'bar'});
    });

    it('should default to empty array', () => {
        const sendSpy = sinon.spy();
        const nextSpy = sinon.spy();
        const body = {
            foo: 'bar',
        };

        cleanBody({})({body}, null, nextSpy);

        expect(nextSpy).to.have.been.callCount(1);

        expect(body).to.deep.eq({foo: 'bar'});
    });
});
