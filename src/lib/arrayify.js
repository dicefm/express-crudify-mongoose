import _ from 'lodash';

export default (arr) => {
    if (!_.isArray(arr)) {
        arr = [arr];
    }

    return arr;
}
