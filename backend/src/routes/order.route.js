import express from 'express';

import * as orderController from "../controllers/order.controller.js";
import protectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get("/", protectRoute, orderController.getOrders);

router.get("/search?", protectRoute, orderController.searchOrders);

router.get("/:id", protectRoute, orderController.getOrderById);

router.post("/filter", protectRoute, orderController.getOrdersByFilter);

router.post("/new", protectRoute, orderController.addOrder);

router.patch("/update/:id", protectRoute, orderController.updateOrder);

router.delete("/delete/:id", protectRoute, orderController.deleteOrder);

export default router;

