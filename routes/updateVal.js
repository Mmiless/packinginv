const express = require('express');
const router = express.Router();
const updateServices = require('../services/updateVal');

/* Listens to updateVal route */
router.post('/', function(req, res, next) {
  try {
    res.json(updateServices.updateVal(req.body));
  } catch(err) {
    console.error(`Error while running function `, err.message);
    next(err);
  }
});


module.exports = router;