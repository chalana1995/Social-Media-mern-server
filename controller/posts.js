import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessage = await PostMessage.find()

        res.status(200).json(postMessage)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    let post = req.body;
    console.log("===post", post);
    console.log("userId create",req);
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()})

    try {
        await newPost.save();

        res.status(200).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}


export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })

    res.json(updatePost)

}


export const deletePost = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(_id)

    res.json({ message: "Post deleted successfully" })
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    console.log("userId",req.userId);
    if(!req.userId) return res.json({message: "Unauthenticated"})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);
 
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1)
    {
       post.likes.push(req.userId)
    }
    else {
      post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatePost);
}