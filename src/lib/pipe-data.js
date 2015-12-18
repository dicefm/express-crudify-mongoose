import _ from 'lodash';

function pipesArray(pipes) {
    let arr = [];
    if (_.isFunction(pipes)) {
        arr = [pipes];
    } else if (_.isArray(pipes)) {
        arr = pipes;
    }

    return arr;
}

export default async (opts) => {
    let {
        pipes,
        data,
        ...extraArgs,
    } = opts;

    const arr = pipesArray(pipes);

    for (const fn of arr) {
        data = await fn({...extraArgs, data});
    }

    return data;
};
