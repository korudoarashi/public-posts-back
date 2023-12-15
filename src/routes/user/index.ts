import { Router } from 'express';
import prismaClient from '../../databank';
import { compare, hash } from '../../utils/bcrypt';
import { sign } from '../../utils/jwt';
import { User } from '../../validators/models/user';
import { requiresModel } from '../../middleware/model/requiresModel';

const router = Router();

router.use(requiresModel<User>(User, 'user', { username: '', password: '' }));

router.post('/register', async (req, res) => {
	const {
		user
	} = res.locals;

	const searchedUser = await prismaClient.user.findFirst({
		where: {
			username: user.username
		}
	});

	if(searchedUser)
		return res.status(400).send({ success: false, message: 'user_already_exists' });

	const newUser = await prismaClient.user.create({
		data: {
			...user,
			password: hash(user.password)
		},
		select: {
			id: true
		}
	});

	res.status(200).send({ success: true, token: sign(newUser, { expiresIn: '1d' }) });
});

router.post('/login', async (req, res) => {
	const {
		user
	} = res.locals;

	const searchedUser = await prismaClient.user.findFirst({
		where: {
			username: user.username
		}
	});

	if(!searchedUser)
		return res.status(404).send({ success: false, message: 'user_not_exists' });

	if(!compare(user.password, searchedUser.password))
		return res.status(404).send({ success: false, message: 'password_not_match' });


	res.status(200).send({ success: true, token: sign({
		id: searchedUser.id
	}, { expiresIn: '1d' }) });
});

export default router;
