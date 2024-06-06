const express = require('express');

const apiController = require('../controllers/api')

const router = express.Router();

router.get('/scrape', apiController.scrape);

module.exports = router;