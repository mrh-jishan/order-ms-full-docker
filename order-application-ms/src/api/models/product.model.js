const mongoose = require('mongoose');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

/**
 * User Schema
 * @private
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    index: true,
    trim: true
  },
  picture: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    minlength: 6
  }
}, {
  timestamps: true
});


/**
 * Methods
 */
productSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'price', 'category', 'picture', 'description', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
productSchema.statics = {


  async get(id) {
    try {
      let product;

      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await this.findById(id).exec();
      }
      if (product) {
        return product;
      }

      throw new APIError({
        message: 'Product does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List products in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({page = 1, perPage = 30}) {
    const options = omitBy({}, isNil);
    return this.find(options)
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }

}
/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);
