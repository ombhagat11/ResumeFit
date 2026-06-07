const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = Router();
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route POST /auth/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController); 

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */


 authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout a user by blacklisting the token
 * @access public
 */
authRouter.post('/logout', authController.logoutUserController);
 
/**
 * @route GET /api/auth/get-me
 * @description Get the authenticated user's information
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser,authController.getMeController);

module.exports = authRouter;