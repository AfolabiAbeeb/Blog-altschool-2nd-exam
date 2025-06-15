import express from 'express';
import {
  createBlog,
  getPublishedBlogs,
  getSinglePublishedBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBlog);
router.get('/', getPublishedBlogs);
router.get('/:id', getSinglePublishedBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

export default router;
