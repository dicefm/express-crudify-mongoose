import runPreSave from './run-pre-save';
const input = 'events';

describe('runPreSave', () => {
    let called;
    let calledArgs;
    beforeEach(() => {
        called = [];
        calledArgs = [];
    });


    it('shouldnt validate if empty array', async () => {
        const preSave = [];
        const item = {
            validateSync: sinon.spy(() => {})
        };

        await runPreSave({preSave, item});

        expect(item.validateSync).to.have.been.callCount(0);
    });

    it('should work with single funciton', async () => {
        const preSave = sinon.spy(() => {});
        const item = {
            validateSync: sinon.spy(() => {})
        };

        await runPreSave({preSave, item});

        expect(item.validateSync).to.have.been.callCount(1);
        expect(preSave).to.have.been.callCount(1);
    });

    it('shouldnt call functions if item isnt valid', async () => {
        const preSave = [
            sinon.spy(() => {}),
            sinon.spy(() => {}),
        ]
        const item = {
            validateSync: sinon.spy(() => new Error('...'))
        };

        await runPreSave({preSave, item});

        expect(item.validateSync).to.have.been.callCount(1);
        expect(preSave[0]).to.have.been.callCount(0);
        expect(preSave[1]).to.have.been.callCount(0);
    });
});
