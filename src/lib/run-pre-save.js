import arrayify from './arrayify';

export default async ({preSave, item}) => {
    const fns = arrayify(preSave);

    if (fns.length === 0) {
        return;
    }
    const isValid = !item.validateSync();
    if (!isValid) {
        return;
    }

    for (const fn of fns) {
        await fn(item);
    }
}
