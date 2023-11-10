import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate("user")
			.sort({ createdAt: -1 })
			.exec(); // Sort by date in descending order (newest first)
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

export const getAllSortedByViews = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate("user")
			.sort({ viewsCount: -1 })
			.exec(); // Sort by views in descending order (highest views first)
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get posts sorted by popular",
		});
	}
};

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();
		const tags = posts
			.map((obj) => obj.tags)
			.flat()
			.slice(0, 5);
		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get tags",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: "after" },
			/*(err, doc) => {
				if (err) {
					return res.status(500).json({
						message: "Failed to return post",
					});
				}
			},*/
		).populate("user");
		if (!doc) {
			return res.status(404).json({
				message: "Failed to find post",
			});
		}
		res.json(doc);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get post",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			/*(err, doc) => {
				if (err) {
					return res.status(500).json({
						message: "Failed to delete post",
					});
				}
			},*/
		);
		if (!doc) {
			return res.status(404).json({
				message: "Failed to find post",
			});
		}
		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to delete posts",
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(","),
			imageUrl: req.body.imageUrl,
			user: req.userId,
		});
		const post = await doc.save();
		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to create post",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags.split(","),
				imageUrl: req.body.imageUrl,
				user: req.userId,
			},
		);
		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to update post",
		});
	}
};
