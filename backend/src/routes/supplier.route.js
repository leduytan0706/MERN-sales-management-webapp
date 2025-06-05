import express from 'express';

import * as supplierController from '../controllers/supplier.controller.js';
import protectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/', protectRoute, supplierController.getSuppliers);

router.post('/new', protectRoute, supplierController.addSupplier);

router.patch('/update/:id', protectRoute, supplierController.updateSupplier);

router.delete('/delete/:id', protectRoute, supplierController.deleteSupplier);

export default router;