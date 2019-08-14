const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/payment.controller');
const {authorize} = require('../../middlewares/auth');
const {createPayment} = require('../../validations/payment.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(), validate(createPayment), controller.create);


module.exports = router;
