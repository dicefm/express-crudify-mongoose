import asyncMiddleware from './async-middleware';
const input = 'events';

describe('asyncMiddleware', () => {
    it('should work', () => {
        const sendSpy = sinon.spy();
        const nextSpy = sinon.spy();

        asyncMiddleware((req, res, next) => {
            res.send('hello');
        })(null, {send: sendSpy}, nextSpy);

        expect(sendSpy).to.have.been.callCount(1);
        expect(nextSpy).to.have.been.callCount(0);

        expect(sendSpy).to.have.been.calledWith('hello');
    });

    it('should call next on thrown errors', () => {
        const sendSpy = sinon.spy();
        const nextSpy = sinon.spy();

        asyncMiddleware((req, res, next) => {
            throw new Error('Something went wrong');
        })(null, {send: sendSpy}, nextSpy);

        expect(sendSpy).to.have.been.callCount(0);
        expect(nextSpy).to.have.been.callCount(1);

        const err = nextSpy.firstCall.args[0];
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eq('Something went wrong');
    });
});
