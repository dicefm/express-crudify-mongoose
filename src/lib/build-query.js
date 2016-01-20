import _ from 'lodash';

function checkValue(value, validator, fieldName) {
    if (!validator(value)) {
        const err = new Error(`Invalid value for param '${fieldName}'`);
        err.statusCode = 400;
        throw err;
    }
}

export default ({query, req}) => {
    const {
        $skip,
        $limit,
        $select,
        ...where,
    } = req.query;

    const fields = $select;

    if (Object.keys(where).length > 0) {
        query.where(where);
    }

    if (!_.isUndefined($limit)) {
        let limit = parseInt($limit, 10);

        checkValue(limit, _.isFinite, '$limit');

        query.limit(limit);
    }

    if (!_.isUndefined($skip)) {
        let skip = parseInt($skip, 10);

        checkValue(skip, _.isFinite, '$skip');

        query.skip(skip);
    }

    if (!_.isUndefined($select)) {
        let select = $select;

        if (_.isString(select)) {
            const paths = $select.split(',');
            select = {};
            for (const path of paths) {
                select[path] = true;
            }
        }

        checkValue(select, _.isPlainObject, '$select');

        query.select(select);
    }

    return query;
}
