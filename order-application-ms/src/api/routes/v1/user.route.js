const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const {authorize, ADMIN} = require('../../middlewares/auth');
const {listUsers, createUser} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  .get(authorize(ADMIN), validate(listUsers), controller.list)
  .post(authorize(ADMIN), validate(createUser), controller.create);


// v1/users/profile

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

module.exports = router;
