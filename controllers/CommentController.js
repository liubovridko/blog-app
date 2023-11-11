import Comment from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const addComment = async (req, res) => {
	const postId = req.params.id;
	const { text } = req.body;
	const userId = req.userId;

	try {
		const post = await PostModel.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (!text) {
			return res
				.status(400)
				.json({ message: "Text is required for a comment" });
		}
		const newComment = new Comment({
			user: userId,
			text,
			post: postId,
		});

		await newComment.save();
		post.comments.push(newComment._id);
		await post.save();

		res.json({
			message: "Comment added successfully",
			comment: newComment,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to add comment" });
	}
};

export const getCommentsByPostId = async (req, res) => {
	const postId = req.params.id;

	try {
		const comments = await Comment.find({ post: postId }).populate(
			"user",
			"loginName",
		);

		res.json(comments);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to get comments" });
	}
};

export const getLastComments = async (req, res) => {
	try {
		const comments = await Comment.find()
			.limit(5)
			.populate("user", "loginName")
			.sort({ viewsCount: -1 })
			.exec(); // Sort by views in descending order (highest views first)
		res.json(comments);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get last comments",
		});
	}
};
