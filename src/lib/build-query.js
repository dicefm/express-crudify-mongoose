import _ from 'lodash';

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

    if ($select) {
        let select = $select;
        if (_.isString($select)) {
            const paths = $select.split(',');
            select = {};
            for (const path of paths) {
                select[path] = true;
            }
        }
        query.select(select);
    }

    return query;
}
