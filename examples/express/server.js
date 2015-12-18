'use strict';

import express from 'express';
import morgan from 'morgan';
import url from 'url';
import mongoose, {Schema} from 'mongoose';

import crudify from '../../src/index';

const debug = require('debug')('crudify:examples:express');

const {
    PORT = 2016,
    MONGO_URL = 'mongodb://localhost:27017/express-crudify-mongoose'
} = process.env;

const db = mongoose.createConnection(MONGO_URL);
const server = express();
server.use(morgan('combined'));


const UserSchema = new Schema({
    name : {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean, default: false, required: true},
});

const Users = db.model('user', UserSchema);
const readonly = ['admin'];

const crud = crudify({
    readonly,
    Model: Users,
})

server.use('/users', crud);


server.listen(PORT);
debug(`Listening on port ${PORT}. Try doing POST/PATCH/GET/DELETE under '/users'`);

export default server;
