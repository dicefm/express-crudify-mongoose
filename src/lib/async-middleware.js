const debug = require('debug')('crudify:async-middleware');

export default (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            debug('asyncMiddleware failed', err, err.stack);
            next(err);
        }
    };
}
