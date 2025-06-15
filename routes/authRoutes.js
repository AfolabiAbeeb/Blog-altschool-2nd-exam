import express from 'express';
import authController from '../controllers/authController.js'; // Make sure this file also uses ES module syntax

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;

// import { blogRoutes } from "./routes/blogRoutes.js";
