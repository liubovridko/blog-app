import Comment from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const addComment = async (req, res) => {
	const postId = req.params.id;
	const { text } = req.body;
	const userId = req.user._id;

	try {
		const post = await PostModel.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
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
		const comments = await Comment.find({ post: postId }).populate("user");

		res.json(comments);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to get comments" });
	}
};
