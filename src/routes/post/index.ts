import { Router } from 'express';
import prismaClient from '../../databank';

const router = Router();

router.get('/', async (req, res) => {
	const posts = await prismaClient.post.findMany({});
	
	res.status(200).send({ posts });
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	const post = await prismaClient.post.findFirst({
		where: {
			id
		}
	});

	if(!post)
		return res.status(404).send({ post: null });

	res.status(200).send({ post });
});

router.post('/create', async (req, res) => {
	const {
		title,
		content
	} = req.body;

	const newPost = await prismaClient.post.create({
		data: {
			title,
			content
		}
	});

	res.status(200).send({ post: newPost });
});

router.put('/update', async (req, res) => {
	const {
		id,
		title,
		content
	} = req.body;

	if(!title && !content) 
		return res.status(400).send({ updated: false });

	const updatedPost = await prismaClient.post.updateMany({
		where: {
			id
		}, 
		data: {
			title,
			content,
			updated: true
		}
	});

	if(!updatedPost.count)
		return res.status(404).send({ updated: false });
	res.status(200).send({ updated: true });
});

router.delete('/delete', async (req, res) => {
	const {
		id
	} = req.body;

	const deletedPost = await prismaClient.post.deleteMany({
		where: {
			id
		}
	});

	if(!deletedPost.count)
		return res.status(404).send({ deleted: false });

	res.status(200).send({ deleted: true });
});

export default router;
