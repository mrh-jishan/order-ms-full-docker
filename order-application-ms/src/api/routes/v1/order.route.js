const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/order.controller');
const {authorize} = require('../../middlewares/auth');
const {createOrder, cancelOrder} = require('../../validations/order.validation');

const router = express.Router();

/**
 * Load order when API with userId route parameter is hit
 */
router.param('orderId', controller.load);


router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(), validate(createOrder), controller.create);

router
  .route('/:orderId/cancel')
  .put(authorize(), validate(cancelOrder), controller.cancelOrder);

// router
//   .route('/:orderId')
//   .get(authorize(), controller.get)
//   // .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
//   .patch(authorize(ADMIN), validate(updateOrder), controller.update)
//   .delete(authorize(ADMIN), controller.remove);


module.exports = router;
