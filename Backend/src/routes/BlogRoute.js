import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    
  } from '../controller/BlogController.js';
  import { upload } from '../middleware/multerMiddleware.js';
  import express from 'express';

  export const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]);
  
  const router = express.Router();
  
  router.post('/posts', uploadFields, createPost);
  router.get('/posts', getAllPosts);
  router.get('/posts/:id', getPostById);
  router.put('/posts/:id',uploadFields, updatePost);
  router.delete('/posts/:id', deletePost);
 
 
  
  export default router;
  