const express = require('express');
const router = express.Router();
const partsServices = require('../services/itemServices');

/* Listens to pcb_inv route */
router.get('/', function(req, res, next) {
  try {
    const searchType = req.query.searchType;
    const searchTerm = req.query.searchTerm;
    const toteId = req.query.tote_id;
    res.json(partsServices.getMultiple(searchType, searchTerm, toteId));
  } catch(err) {
    console.error(`Error while getting data:`, err.message);
    next(err);
  }
});

/* Specific route for getting tote name-id mapping */
router.get('/get-tote-names', async function(req, res, next) {
  try{
    const result = await partsServices.getTotes();
    res.json(result);
  } catch(err){
    console.log(`Error making tote map:`, err.message);
  }
});

router.post('/', function(req, res, next) {
  try {
    res.json(partsServices.addItem(req.body));
  } catch(err) {
    console.error(`Error while adding parts:`, err.message);
    next(err);
  }
});

module.exports = router;