import express from 'express';

import asyncMiddleware from './lib/async-middleware';
import buildQuery from './lib/build-query';
import pipeData from './lib/pipe-data';
import normaliseMongo from './lib/normalise-mongo';
import cleanBody from './lib/clean-body';
import runPreSave from './lib/run-pre-save';

const debug = require('debug')('crudify:crudify');

export default function({
    Model,
    preOutput = [],
    preSave = [],
    preBuildQuery = [],
    readonly = [],
}) {
    const router = express.Router();

    for (const path of readonly) {
        if (path.includes('.')) {
            throw new Error('You can only define readonly properties on the root level');
        }
    }

    const {schema} = Model;

    router.get('/', asyncMiddleware(async (req, res, next) => {
        const params = await pipeData({pipes: preBuildQuery, data: req.query, req});
        const query = buildQuery({params, query: Model.find()});

        const data = await query.lean().exec();

        const output = await pipeData({pipes: preOutput, data, req});

        res.send(output);
    }));

    router.get('/:_id', asyncMiddleware(async (req, res, next) => {
        const {_id} = req.params;

        const params = req.query;
        const query = buildQuery({params, query: Model.findById(_id)});
        const data = await query.lean().exec();

        if (!data) {
            next();
            return;
        }

        const output = await pipeData({pipes: preOutput, data, req});

        res.send(output);
    }));

    router.patch('/:_id', cleanBody({readonly}), asyncMiddleware(async (req, res, next) => {
        const {body} = req;
        const {_id} = req.params;

        const params = req.query;
        const query = buildQuery({params, query: Model.findById(_id)});
        const item = await query.exec();

        for (const path in body) {
            item[path] = body[path];
        }

        await runPreSave({preSave, item});
        await item.save();

        const data = normaliseMongo(item);

        const output = await pipeData({pipes: preOutput, data, req});

        res.send(output);
    }));

    router.delete('/:_id', asyncMiddleware(async (req, res, next) => {
        const {_id} = req.params;

        const query = Model.findById(_id);
        const item = await query.select('_id').exec();

        if (!item) {
            next();
            return;
        }

        await item.remove();

        res.sendStatus(204);
    }));

    router.post('/', cleanBody({readonly}), asyncMiddleware(async (req, res, next) => {
        const {body} = req;

        const item = new Model(body);

        await runPreSave({preSave, item});
        await item.save();

        const data = normaliseMongo(item);
        const output = await pipeData({pipes: preOutput, data, req});

        res.status(201).send(output);
    }));

    return router;
};
