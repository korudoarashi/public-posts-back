import { RequestHandler } from 'express';
import { verify } from '../../utils/jwt';
import prismaClient from '../../databank';
import { validate } from 'class-validator';
import { Auth } from '../../validators/models/auth';

const loggedMiddleware = (optional: boolean = false) => {
	return (async (req, res, next) => {
		const onReject = optional ? () => next() : (callback: () => void) => callback();

		const auth = new Auth(req.headers.authorization);

		const errors = await validate(auth);

		if(errors.length)
			return onReject(() => res.status(401).send(errors));

		const payload = verify(auth.getToken());

		if(!payload || !payload?.id)
			return onReject(() => res.status(401).send({ error: 'invalid_token' }));

		const user = await prismaClient.user.findFirst({
			where: {
				id: payload.id
			},
			select: {
				id: true,
				username: true,
				posts: true
			}
		});

		if(!user)
			return onReject(() => res.status(401).send({ error: 'user_not_exists' }));

		res.locals.user = user;

		next();
	}) as RequestHandler;
}

export default loggedMiddleware;
