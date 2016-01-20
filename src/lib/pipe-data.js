import _ from 'lodash';

import arrayify from './arrayify';

export default async (opts) => {
    let {
        pipes,
        data,
        ...extraArgs,
    } = opts;

    const arr = arrayify(pipes);

    for (const fn of arr) {
        data = await fn({...extraArgs, data});
    }

    return data;
};
