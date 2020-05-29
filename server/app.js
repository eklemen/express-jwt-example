import express, { response } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
dotenv.config();
const app = express();

// database setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/mydb';
const mongooseConfigs = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongoUri, mongooseConfigs);

const myMiddleware = (configs) => (req, res, next) => {
    if (configs.whitelist.includes(req.url)) {
        next();
    } else {
        const {token} = req.cookies;
        if (!token) return res.sendStatus(401);
        jwt.verify(token, 'shhh', (err, data) => {
            if (err) return res.sendStatus(403);
            req.user = data;
        })
        next()
    }
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(myMiddleware({whitelist: ['/api/login', '/api/registration'] }))
app.use(helmet());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(compression());

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
