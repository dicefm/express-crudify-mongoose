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

    describe('simple usage', () => {
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


            it('should be accessible through `/users`', async () => {
                const {statusCode, body} = await req.get('/users');

                expect(statusCode).to.eq(200);
                expect(body).to.be.an('array');

                expect(body.length).to.eq(1);
                expect(body[0]._id).to.eq(_id);
            });

            it('should be accessible through `/users/:_id`', async () => {
                const {statusCode, body} = await req.get(`/users/${_id}`);

                expect(statusCode).to.eq(200);
                expect(body).to.be.an('object');

                expect(body._id).to.eq(_id);
                expect(body.name).to.eq(name);
                expect(body.email).to.eq(email);
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

                it('shouldnt be deletable twice', async () => {
                    const {body, statusCode} = await req.delete(`/users/${_id}`);

                    expect(statusCode).to.eq(404);
                });

                it('should have been deleted', async () => {
                    const {body, statusCode} = await req.get(`/users/${_id}`);

                    expect(statusCode).to.eq(404);
                });
            });
        });

        describe('pagination', () => {
            const NUM_ENTRIES = 9;

            before(async () => {
                for (let i=0; i<NUM_ENTRIES; i++) {
                    const name = 'Name index #' + i;
                    const email = `user+${i}@example.com`;
                    const reqBody = {
                        name,
                        email,
                    };
                    const {body, statusCode} = await req.post('/users').send(reqBody);
                    expect(statusCode).to.eq(201);
                }
            });

            it('should display everything', async () => {
                const {body, statusCode} = await req.get('/users');

                expect(body.length).to.eq(NUM_ENTRIES);
            });

            it('?$skip=2 should skip 2', async () => {
                const {body, statusCode} = await req.get('/users?$skip=2');

                expect(body.length).to.eq(NUM_ENTRIES - 2);
            });

            it('?$limit=2 should limit to 2', async () => {
                const {body, statusCode} = await req.get('/users?$limit=2');

                expect(body.length).to.eq(2);
            });

            it('?$skip=${NUM_ENTRIES-1}&$limit=2 should show 1', async () => {
                const {body, statusCode} = await req.get(`/users?$skip=${NUM_ENTRIES-1}&$limit=2`);

                expect(body.length).to.eq(1);
            });
        });
    });

    describe('faulty usage', () => {
        before(async () => {
            db = mongoose.createConnection('mongodb://localhost:27017/express-crudify-mongoose--integration_tests');

            const UserSchema = new Schema({
                name : {type: String, required: true},
                email: {type: String, required: true},
                admin: {type: Boolean, default: false, required: true},
            });

            Model = db.model('user', UserSchema);
        });

        it('should blow up when trying to protect deep properties', async () => {
            let err;
            try {
                const crud = crudify({
                    Model,
                    readonly: ['deep.nested'],
                });
            } catch (_err) {
                err = _err;
            }

            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.eq('You can only define readonly properties on the root level');
        });
    });
});
