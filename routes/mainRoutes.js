const express = require('express');
const mainController = require('../controllers/mainController')

const router = express.Router();

router.get('/', mainController.showWelcomePage);
// GET /trades: get all trade items
router.get('/about', mainController.showAboutPage);

// GET /trades/new: redirect to page to create new trade
router.get('/contact', mainController.showContactPage);

module.exports = router