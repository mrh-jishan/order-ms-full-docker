const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const {login, register, refresh} = require('../../validations/auth.validation');

const router = express.Router();
// v1/auth/register
router.route('/register')
  .post(validate(register), controller.register);

router.route('/login')
  .post(validate(login), controller.login);

router.route('/refresh-token')
  .post(validate(refresh), controller.refresh);


/**
 * TODO: POST /v1/auth/reset-password
 */

module.exports = router;
