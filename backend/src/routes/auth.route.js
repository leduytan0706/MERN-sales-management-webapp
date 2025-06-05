import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.middleware.js';
import checkPermission from '../middleware/checkPermission.js';

const router = express.Router();

router.get('/check', protectRoute, authController.checkAuth);

router.get('/user', protectRoute, authController.getUsers);

router.post('/login', authController.logIn);

router.post('/new-user', protectRoute, checkPermission("manager"), authController.addUser);

router.post('/update-profile', protectRoute, authController.updateProfile);

router.post('/logout', authController.logOut); 

router.delete('/delete-user/:id', protectRoute, checkPermission("manager"), authController.deleteUser);

export default router;
