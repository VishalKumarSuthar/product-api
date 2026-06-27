const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');

const router = express.Router();

const productValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim(),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string')
    .trim(),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim(),
  body('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be a boolean value'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

router.post('/', productValidationRules, validate, async (req, res, next) => {
  try {
    const { name, price, description, category, inStock } = req.body;
    const newProduct = new Product({ name, price, description, category, inStock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', productValidationRules, validate, async (req, res, next) => {
  try {
    const { name, price, description, category, inStock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, inStock },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;