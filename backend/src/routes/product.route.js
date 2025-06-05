import express from 'express';

import protectRoute from '../middleware/protectRoute.middleware.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', protectRoute, productController.getProducts);

router.get('/search', protectRoute, productController.getProductsBySearch);

router.get('/:id', protectRoute, productController.getProductById);

router.post('/filter', protectRoute, productController.getProductsByFilter);

router.post('/new', protectRoute, productController.addProduct);

router.post('/new-upload', protectRoute, productController.addProductsFromFile);

router.post('/update/:id', protectRoute, productController.updateProduct);

router.delete('/delete/:id', protectRoute, productController.deleteProduct);

export default router;