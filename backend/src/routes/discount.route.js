import express from "express";

import * as discountController from "../controllers/discount.controller.js";
import protectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/", protectRoute, discountController.getDiscounts);

router.get("/:id", protectRoute, discountController.getDiscountById);

router.post("/order", protectRoute, discountController.getOrderDiscount);

router.post("/new", protectRoute, discountController.addDiscount);

router.post("/update/:id", protectRoute, discountController.updateDiscount);

router.delete("/delete/:id", protectRoute, discountController.deleteDiscount);


export default router;