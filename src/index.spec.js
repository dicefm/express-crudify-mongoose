import Promise from 'bluebird';
import _ from 'lodash';
import mongoose from 'mongoose';
import superTestAsPromised from 'supertest-as-promised';
import express from 'express';
import bodyParser from 'body-parser';

import crudify from './index';

const Schema = mongoose.Schema;

describe('crudify integration test', () => {
    let db;
    let Model;

    let req;
    let server;
    let audienceItem;

    before(async () => {
        server = express();
        server.use(bodyParser.json());

        db = mongoose.createConnection('mongodb://localhost:27017/express-crudify-mongoose--integration_tests');

        const UserSchema = new Schema({
            name : {type: String, required: true},
            email: {type: String, required: true},
            admin: {type: Boolean, default: false, required: true},
        });

        Model = db.model('user', UserSchema);
        const readonly = ['admin'];

        const crud = crudify({
            Model,
            readonly,
        })

        server.use('/users', crud);

        req = superTestAsPromised(server);

        await Model.remove({});

        server.use((req, res, next) => {
            res.sendStatus(404);
        });
    });

    after(async () => {
        await db.close();
    });

    it('GET `/users` should work', async () => {
        const res = await req.get('/users');

        expect(res.statusCode).to.eq(200);
        expect(res.body).to.be.an('array');

        expect(res.body.length).to.eq(0);
    });

    describe('creating', () => {
        let name;
        let email;
        let scheduleId;
        let _id;

        before(() => {
            name = 'Name test ' + Math.random();
            email = `user+${Math.random}@example.com`;
        });

        it('should work', async () => {
            const reqBody = {
                name,
                email,
            };
            const {body, statusCode} = await req.post('/users').send(reqBody);
            expect(statusCode).to.eq(201);

            _id = body._id;

            expect(_id).to.be.truthy;
        });

        it('should be updateable', async () => {
            email = `user+${Math.random}@example.com`;

            const reqBody = {
                email,
            };
            const {body, statusCode} = await req.patch(`/users/${_id}`).send(reqBody);

            expect(statusCode).to.eq(200);

            expect(body._id).to.be.eq(_id);

            expect(body.email).to.eq(email);
        });

        it('readonly fields shouldnt change', async () => {
            const reqBody = {
                admin: true,
            };
            const {body, statusCode} = await req.patch(`/users/${_id}`).send(reqBody);

            expect(statusCode).to.eq(200);

            expect(body._id).to.be.eq(_id);
            expect(body.admin).to.eq(false);
        });

        describe('when deleting', () => {
            it('should be deletable', async () => {
                const {body, statusCode} = await req.delete(`/users/${_id}`);

                expect(statusCode).to.eq(204);
            });

            it('should have been deleted', async () => {
                const {body, statusCode} = await req.get(`/users/${_id}`);

                expect(statusCode).to.eq(404);
            });
        });

    });
});
