import buildQuery from './build-query';
const input = 'events';

describe('buildQuery', () => {
    let query;

    beforeEach(() => {
        query = {
            where : sinon.spy(),
            select: sinon.spy(),
            limit : sinon.spy(),
            skip  : sinon.spy(),
            sort  : sinon.spy(),
        }
    });

    it('should work with empty params', () => {
        const params = {
        };

        buildQuery({params, query});

        expect(query.select).to.have.been.notCalled;
        expect(query.where).to.have.been.notCalled;
    });

    describe('?$select=', () => {
        it('should work with comma-separated values', () => {
            const $select = 'name,email';
            const params = {
                $select,
            };

            buildQuery({params, query});

            expect(query.select).to.have.been.callCount(1);
            expect(query.where).to.have.been.notCalled;

            expect(query.select).to.have.been.calledWith({
                name : true,
                email: true,
            });
        });

        it('should work with object', () => {
            const $select = {name: true, email: true};
            const params = {
                $select,
            };

            buildQuery({params, query});

            expect(query.select).to.have.been.callCount(1);
            expect(query.where).to.have.been.notCalled;

            expect(query.select).to.have.been.calledWith({
                name : true,
                email: true,
            });
        });
    });

    describe('?someField=x', () => {
        it('should be added to query.where', () => {
            const params = {
                name: 'KATT',
            };

            buildQuery({params, query});

            expect(query.where).to.have.been.callCount(1);
            expect(query.select).to.have.been.notCalled;

            expect(query.where).to.have.been.calledWith({
                name: 'KATT',
            });
        });
    });

    describe('?$limit=x', () => {
        it('should limit query', () => {
            const params = {
                $limit: '2',
            };

            buildQuery({params, query});

            expect(query.limit).to.have.been.callCount(1);
            expect(query.limit).to.have.been.calledWith(2);
        });

        it('should blow up with invalid types', () => {
            const params = {
                $limit: {},
            };

            let err;
            try {
                buildQuery({params, query});
            } catch (e) {
                err = e;
            }

            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.eq(`Invalid value for param '$limit'`);
        });
    });

    describe('?$skip=x', () => {
        it('should skip query', () => {
            const params = {
                $skip: '3',
            };

            buildQuery({params, query});

            expect(query.skip).to.have.been.callCount(1);
            expect(query.skip).to.have.been.calledWith(3);
        });

        it('should blow up with invalid types', () => {
            const params = {
                $skip: {},
            };

            let err;
            try {
                buildQuery({params, query});
            } catch (e) {
                err = e;
            }

            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.eq(`Invalid value for param '$skip'`);
        });
    });

    describe('?$sort=x', () => {
        it('comma-separated should work', () => {
            const params = {
                $sort: 'name,email',
            };

            buildQuery({params, query});

            expect(query.sort).to.have.been.callCount(1);
            expect(query.sort).to.have.been.calledWith({
                name : 1,
                email: 1,
            });
        });

        it('desc sorting should work', () => {
            const params = {
                $sort: 'name,-email',
            };

            buildQuery({params, query});

            expect(query.sort).to.have.been.callCount(1);
            expect(query.sort).to.have.been.calledWith({
                name : 1,
                email: -1,
            });
        });
    });
});
