const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/product.controller');
const {authorize, ADMIN} = require('../../middlewares/auth');
const {createProduct, updateProduct} = require('../../validations/product.validation');

const router = express.Router();

/**
 * Load product when API with userId route parameter is hit
 */
router.param('productId', controller.load);


router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(ADMIN), validate(createProduct), controller.create);

router
  .route('/:productId')
  .get(authorize(), controller.get)
  .patch(authorize(ADMIN), validate(updateProduct), controller.update)
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
