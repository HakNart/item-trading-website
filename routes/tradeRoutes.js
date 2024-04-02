const express = require('express');
const tradeController = require('../controllers/tradeController')
const {isLoggedin, isOwner} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator')

const router = express.Router();

// GET /trades: get all trade items
router.get('/', tradeController.readAllTrades);

// GET /trades/new: redirect to page to create new trade
router.get('/new', isLoggedin, tradeController.readNewTrade);

// POST /trades: create new trade
router.post("/", isLoggedin, tradeController.createNewTrade);

// GET /trades/id: get a trade item with id
router.get("/:id", validateId, tradeController.showTradeItem)

// GET /trades/id/update: redirect to edit page for trade item
router.get('/:id/update', validateId, isLoggedin, isOwner, tradeController.readUpdateTradeItem)

// PUT /trades/id: update the trade item
router.put('/:id', validateId, isLoggedin, isOwner, tradeController.updateTradeItem);

// DELETE /trades/:id: delete trade item of id
router.delete('/:id', validateId, isLoggedin, isOwner, tradeController.deleteTradeItem);

module.exports = router;