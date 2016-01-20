import arrayify from './arrayify';

describe('arrayify', () => {
    it('should typecast anything as an array', () => {
        expect(arrayify(null)).to.deep.eq([null]);
        expect(arrayify({})).to.deep.eq([{}]);
        expect(arrayify(1)).to.deep.eq([1]);
        expect(arrayify('str')).to.deep.eq(['str']);
        expect(arrayify(true)).to.deep.eq([true]);
    });

    it('should keep arrays as-is', () => {
        expect(arrayify([])).to.deep.eq([]);
        expect(arrayify([[]])).to.deep.eq([[]]);
        expect(arrayify([null])).to.deep.eq([null]);
    });
});
