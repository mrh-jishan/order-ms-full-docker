const httpStatus = require('http-status');
const {omit} = require('lodash');
const Product = require('../models/product.model');

/**
 * Load product and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const product = await Product.get(id);
    req.locals = {product};
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get product
 * @public
 */
exports.get = (req, res) => res.json(req.locals.product.transform());


/**
 * Create new product
 * @public
 */
exports.create = async (req, res, next) => {
  console.log(req.body)
  try {
    const product = new Product(req.body);
    const savedOrder = await product.save();
    res.status(httpStatus.CREATED);
    res.json(savedOrder.transform());
  } catch (error) {
    next();
  }
};

/**
 * Replace existing product
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const {product} = req.locals;
    const newOrder = new Product(req.body);
    const ommitRole = product.role !== 'admin' ? 'role' : '';
    const newOrderObject = omit(newOrder.toObject(), '_id', ommitRole);

    await product.update(newOrderObject, {override: true, upsert: true});
    const savedOrder = await Product.findById(product._id);

    res.json(savedOrder.transform());
  } catch (error) {
    next();
  }
};

/**
 * Update existing product
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.product.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const product = Object.assign(req.locals.product, updatedUser);

  product.save()
    .then(savedProduct => res.json(savedProduct.transform()))
    .catch(e => next(e));
};

/**
 * Get product list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const products = await Product.list(req.query);
    const transformedProducts = products.map(product => product.transform());
    res.json(transformedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * @public
 */
exports.remove = (req, res, next) => {
  const {product} = req.locals;

  product.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
