import mongoose from 'mongoose';

// Define the BlogPost schema
const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: 'default-image.jpg',
  },
  video: {
    type: String, // URL to the video
    default: null,
  },
  audio: {
    type: String, // URL to the audio file
    default: null,
  },
  documents: [
    {
      title: {
        type: String, // Title of the document
        required: true,
      },
      url: {
        type: String, // URL to the document
        required: true,
      },
    },
  ],
});

export const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
