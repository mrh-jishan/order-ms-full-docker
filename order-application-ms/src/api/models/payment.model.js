const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil, sample} = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Random Payment Status
 */
const paymentStatus = ['declined', 'canceled', 'confirmed'];

/**
 * Payment Schema
 * @private
 */
const paymentSchema = new mongoose.Schema({
  cardHolderName: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: String,
    match: /^(0[1-9]|1[0-2]|[1-9])\/(1[4-9]|[2-9][0-9]|20[1-9][1-9])$/,
    trim: true,
    required: true
  },
  cvc: {
    type: String,
    match: /^[0-9]{3,4}$/,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: paymentStatus,
    required: true,
    default: sample(paymentStatus)
  }
}, {
  timestamps: true
});


/**
 * Methods
 */
paymentSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'cardHolderName', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvc', 'createdBy', 'product', 'order', 'status', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
paymentSchema.statics = {
  paymentStatus,
  /**
   * Get payment
   *
   * @param {ObjectId} userId - The objectId of user id.
   * @returns {Promise<Payment, APIError>}
   */
  async get(userId) {
    try {
      let payment;

      if (mongoose.Types.ObjectId.isValid(userId)) {
        payment = await this.find({createdBy: userId}).exec();
      }
      if (payment) {
        return payment;
      }

      throw new APIError({
        message: 'Payment does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List payments in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of payments to be skipped.
   * @param {number} limit - Limit number of payments to be returned.
   * @returns {Promise<Payment[]>}
   */
  list({page = 1, perPage = 30}) {
    const options = omitBy({}, isNil);
    return this.find(options)
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Payment
 */
module.exports = mongoose.model('Payment', paymentSchema);
