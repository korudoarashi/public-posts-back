import { Router } from 'express';
import prismaClient from '../../databank';
import loggedMiddleware from '../../middleware/user/loggedMiddleware';
import { RequireModelDataTarget, requiresModel } from '../../middleware/model/requiresModel';
import { PostModel } from '../../validators/models/post';

const router = Router();

router.use(loggedMiddleware());

router.get('/', async (req, res) => {
	const {
		user
	} = res.locals;

	const posts = await prismaClient.post.findMany({
		where: {
			OR: [
				{
					personal: false
				},
				{
					userId: user.id
				}
			]
		}
	});

	res.status(200).send({ success: true, posts });
});

router.get('/:id', requiresModel<PostModel>(PostModel, 'post', { id: '' }, { dataTarget: RequireModelDataTarget.Params }), async (req, res) => {
	const {
		user,
		post
	} = res.locals;

	const searchedPost = await prismaClient.post.findFirst({
		where: {
			OR: [
				{
					id: post.id,
					personal: false
				},
				{
					id: post.id,
					userId: user.id
				}
			],
		}
	});

	if(!searchedPost)
		return res.status(404).send({ success: false, post: null });

	res.status(200).send({ success: true, post: searchedPost });
});

router.post('/create', requiresModel<PostModel>(PostModel, 'post', { title: '', content: '', personal: false }), async (req, res) => {
	const {
		user,
		post
	} = res.locals;

	const newPost = await prismaClient.post.create({
		data: {
			...post,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	res.status(200).send({ success: true, post: newPost });
});

router.put('/update', requiresModel<PostModel>(PostModel, 'post', { id: '', title: undefined, content: undefined, personal: undefined }), async (req, res) => {
	const {
		post,
		user
	} = res.locals;

	if(!post.id)
		return res.status(400).send({ success: false });

	const updatedPost = await prismaClient.post.updateMany({
		where: {
			id: post.id,
			userId: user.id
		},
		data: {
			...post,
			private: undefined
		}
	});

	if(!updatedPost.count)
		return res.status(404).send({ success: false });
	res.status(200).send({ success: true });
});

router.delete('/delete', requiresModel<PostModel>(PostModel, 'post', { id: '' }), async (req, res) => {
	const {
		post,
		user
	} = res.locals;

	const deletedPost = await prismaClient.post.deleteMany({
		where: {
			id: post.id,
			userId: user.id
		}
	});

	if(!deletedPost.count)
		return res.status(404).send({ success: false });

	res.status(200).send({ success: true });
});

export default router;
