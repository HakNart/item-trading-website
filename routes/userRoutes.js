const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedin} = require('../middlewares/auth');

const router = express.Router();

//GET /users/new: send html form for creating a new user account

router.get('/new', isGuest, controller.new);

//POST /users: create a new user account

router.post('/', controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedin, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedin, controller.logout);

module.exports = router;