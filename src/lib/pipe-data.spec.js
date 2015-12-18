import pipeData from './pipe-data';
const input = 'events';

describe('pipeData', () => {
    let called;
    beforeEach(() => {
        called = [];
    });

    function mockPipe(id) {
        const fn = sinon.spy(async (opts) => {
            called.push(id);

            return opts.data;
        });
        return fn;
    }

    it('should work with single funciton', async () => {
        const mw1 = mockPipe(1);

        const pipes = mw1;
        const data = {foo: 'bar'};

        await pipeData({pipes, data});

        expect(called).to.deep.eq([1]);
    });

    it('should run functions in order', async () => {
        const mw1 = mockPipe(1);
        const mw2 = mockPipe(2);
        const mw3 = mockPipe(3);

        const pipes = [mw1, mw2, mw3];
        const data = {foo: 'bar'};

        await pipeData({pipes, data});

        expect(called).to.deep.eq([1,2,3]);
    });

    it('should run functions in order, without blocking main thread', async () => {
        const mw1 = mockPipe(1);
        const mw2 = mockPipe(2);
        const mw3 = mockPipe(3);
        const mw4 = mockPipe(4);
        const mw5 = mockPipe(5);

        const pipes = [mw1, mw2, mw3, mw4, mw5];
        const data = {foo: 'bar'};

        pipeData({pipes, data});

        expect(called).to.deep.eq([1]);

        // 😷 Ugly test
        // "it should eventually resolve"
        const indexes = {};
        while (true) {
            indexes[called.length + ''] = true;
            if (called.length === 5) {
                break;
            }

            await Promise.resolve();
        }

        // it should have had ticks when we've had all lengths of the array
        expect(indexes['1']).to.be.truthy;
        expect(indexes['2']).to.be.truthy;
        expect(indexes['3']).to.be.truthy;
        expect(indexes['4']).to.be.truthy;
        expect(indexes['5']).to.be.truthy;

        expect(called).to.deep.eq([1, 2, 3, 4, 5]);
    });

    it('should forward options to pipes', async () => {
        const mw1 = mockPipe(1);

        const pipes = [mw1];
        const data = {foo: 'bar'};

        const extraData = {connection: '...'};

        await pipeData({pipes, data, extraData});

        expect(called).to.deep.eq([1]);

        expect(mw1.firstCall.args[0].extraData).to.deep.eq(extraData);
    });
});
