const Router = require("express");
const { userController } = require("../controllers/users")
const { authenticateToken } = require("../middlewares/authMiddleware")
const userRouter = Router()

userRouter.get("/users/:id", userController.getUserData)
userRouter.get('/users/', authenticateToken, userController.getUser)

module.exports = { userRouter }