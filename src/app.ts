import 'dotenv/config';
import express, { json } from 'express';
import morgan from 'morgan';

const app = express();

/* Middlewares */

app.use(morgan('dev'));
app.use(json());

/* Routes */

app.listen(process.env.PORT, () => {
	console.log(`Connected to port: ${process.env.PORT}`);
});
