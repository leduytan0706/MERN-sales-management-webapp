import express from 'express';

import * as importController from "../controllers/import.controller.js";
import protectRoute from '../middleware/protectRoute.middleware.js';


const router = express.Router();

router.get('/', protectRoute, importController.getImports);

router.get('/search', protectRoute, importController.getImportsBySearch);

router.get('/:id', protectRoute, importController.getImportById);

router.post('/filter', protectRoute, importController.getImportsByFilter);

router.post('/new', protectRoute, importController.addImport);

router.patch('/update/:id', protectRoute, importController.updateImport);

router.delete('/delete/:id', protectRoute, importController.deleteImport);

export default router;

