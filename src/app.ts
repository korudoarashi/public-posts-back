import 'dotenv/config';
import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import postRouter from './routes/post';
import userRouter from './routes/user';

const app = express();

/* Middlewares */

app.use(cors());

app.use(morgan('dev'));
app.use(json());

/* Routes */

app.use('/posts', postRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT, () => {
	console.log(`Connected to port: ${process.env.PORT}`);
});
