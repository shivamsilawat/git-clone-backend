const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get("/AllUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/profile/:id", userController.getUserProfile);
userRouter.put("/profile/:id", userController.updateUserProfile);
userRouter.delete("/profile/:id", userController.deleteUserProfile);
module.exports = userRouter;
