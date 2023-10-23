const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const database = require('../database');

router.post('/', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { label, price, quantity } = req.body;

  if (!label) {
    return res.status(400).json({ message: 'Informe o label.' });
  }

  if (!price) {
    return res.status(400).json({ message: 'Informe o preço.' });
  }

  if (!quantity) {
    return res.status(400).json({ message: 'Informe a quantidade.' });
  }

  let product = await database.products.findOne({
    label: { $regex: `^${label}$`, $options: 'i' },
  });

  if (!!product) {
    return res.status(400).json({
      message: 'Já existe um produto com este label.',
    });
  }

  const createData = {
    label,
    price: Number(price),
    quantity: Number(quantity),
    userId: user._id.toString(),
  };

  product = await database.products
    .create(createData);

  res.status(201).json(product);
});

router.put('/', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { _id, label, price, quantity } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'Informe o id.' });
  }

  if (!label) {
    return res.status(400).json({ message: 'Informe o label.' });
  }

  if (!price) {
    return res.status(400).json({ message: 'Informe o preço.' });
  }

  if (!quantity) {
    return res.status(400).json({ message: 'Informe a quantidade.' });
  }

  let product = await database.products.findOne({
    label: { $regex: `^${label}$`, $options: 'i' },
    _id: { $ne: _id },
  });

  if (!!product) {
    return res.status(400).json({
      message: 'Já existe um produto com este label.',
    });
  }

  const updateData = {
    label,
    price: Number(price),
    quantity: Number(quantity),
    userId: user._id.toString(),
  };

  product = await database.products.updateOne({ _id: _id }, updateData);

  res.status(200).json();
});

router.get('/', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;

  const products =  await database.products.find({
    userId: user._id.toString(),
  });

  res.json(products);
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  const product =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id,
  });

  if (!product) {
    return res.status(400).json({ message: 'Registro inválido.' });
  }

  res.json(product);
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  const product =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id,
  });

  if (!product) {
    return res.status(400).json({ message: 'Registro inválido.' });
  }

  await database.products.deleteOne({ _id: id });

  res.status(204).json();
});

module.exports = router;
