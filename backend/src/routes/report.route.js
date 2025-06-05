import express from 'express';

import * as analyticController from "../controllers/analytic.controller.js";
import protectRoute from '../middleware/protectRoute.middleware.js';
import checkPermission from '../middleware/checkPermission.js';

const router = express.Router();

router.get("/overview", protectRoute, analyticController.getOverviewData);

router.post("/", protectRoute, checkPermission(["manager","accountant"]), analyticController.getReportsData);

export default router;