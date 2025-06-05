import express from 'express';

import * as categoryController from '../controllers/category.controller.js';
import protectRoute from '../middleware/protectRoute.middleware.js';


const router = express.Router();

router.get('/', protectRoute, categoryController.getCategories);

router.post('/new', protectRoute, categoryController.addCategory);

router.patch('/update/:id', protectRoute, categoryController.updateCategory);

router.delete('/delete/:id', protectRoute, categoryController.deleteCategory);

export default router;

