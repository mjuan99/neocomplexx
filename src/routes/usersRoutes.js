const router = require('express').Router();
const {getUsersController, postUsersController, getLoginController} = require('../controllers/userController');


// Endpoints

// POST /users  body: {"email": "<userEmail>", "password": "<userPassword>"} --> creates a user with <userEmail> and <userPassowrd> if it doesn't exists
router.post("/users", postUsersController);

// GET /login?email=<userEmail>&password=<userPassword> --> checks if <userEmail> and <userPassword> corresponds to a registered user
router.get("/login", getLoginController);

// GET /users?password=admin --> returns the emails and passwords of all the registered users
router.get("/users", getUsersController);


module.exports = router;
