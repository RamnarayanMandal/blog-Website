import {BlogPost} from '../models/Blog.js';
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new blog post
export const createPost = async (req, res) => {
  try {
    const { title, content, slug } = req.body;

    let imageCloudinaryUrl = null;
    let videoCloudinaryUrl = null;
    let audioCloudinaryUrl = null;
    let documentUrls = [];

    // Handle image upload to Cloudinary
    if (req.files?.image?.length > 0) {
      const imageLocalPath = req.files.image[0].path;
      const result = await uploadOnCloudinary(imageLocalPath);
      imageCloudinaryUrl = result.url;
    }

    // Handle video upload to Cloudinary
    if (req.files?.video?.length > 0) {
      const result = await uploadOnCloudinary(req.files.video[0].path, {
        folder: 'blog_videos',
        resource_type: 'video',
      });
      videoCloudinaryUrl = result.url;
    }

    // Handle audio upload to Cloudinary
    if (req.files?.audio?.length > 0) {
      const result = await uploadOnCloudinary(req.files.audio[0].path, {
        folder: 'blog_audio',
        resource_type: 'audio',
      });
      audioCloudinaryUrl = result.url;
    }

    // Handle documents upload to Cloudinary
    if (req.files?.documents?.length > 0) {
      for (const file of req.files.documents) {
        const result = await uploadOnCloudinary(file.path, {
          folder: 'blog_documents',
          resource_type: 'raw',
        });
        documentUrls.push({ title: file.originalname, url: result.url });
      }
    }

    // Create the blog post document
    const newPost = new BlogPost({
      title,
      content,
      slug,
      image: imageCloudinaryUrl,
      video: videoCloudinaryUrl,
      audio: audioCloudinaryUrl,
      documents: documentUrls,
    });

    // Save the post
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all blog posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('slug'); // Populate the category
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a blog post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('slug'); // Populate the category
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Update a blog post
export const updatePost = async (req, res) => {
  try {
    const { title, content, slug } = req.body;
    let updateFields = {};

    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (slug) updateFields.slug = slug;

    const uploadFiles = async (file, folder, resourceType) => {
      const result = await uploadOnCloudinary(file.path, { folder, resource_type: resourceType });
      return result.url;
    };

    if (req.files) {
      const { image, video, audio, documents } = req.files;

      if (image?.length > 0) {
        updateFields.image = await uploadFiles(image[0], 'blog_images', 'image');
      }
      if (video?.length > 0) {
        updateFields.video = await uploadFiles(video[0], 'blog_videos', 'video');
      }
      if (audio?.length > 0) {
        updateFields.audio = await uploadFiles(audio[0], 'blog_audio', 'audio');
      }
      if (documents?.length > 0) {
        let documentUrls = [];
        for (const file of documents) {
          const documentUrl = await uploadFiles(file, 'blog_documents', 'raw');
          documentUrls.push({ title: file.originalname, url: documentUrl });
        }
        updateFields.documents = documentUrls;
      }
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a blog post
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};
