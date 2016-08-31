import _ from 'lodash';

import arrayify from './arrayify';

export default async (pipes, data, extras) => {
    const arr = arrayify(pipes);

    for (const fn of arr) {
        data = await fn(data, extras);
    }

    return data;
};
