import _ from 'lodash';

export default function normaliseMongo(data) {
    if (_.isArray(data)) {
        return data.map((item) => item.toObject());
    }

    return data.toObject();
}
