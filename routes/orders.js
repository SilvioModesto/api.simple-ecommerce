const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const database = require('../database');


router.get('/', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;

  const orders =  await database.orders.find({
    userId: user._id.toString(),
    status: { $not: 'CANCELLED' },
  });

  res.json(orders);
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  const order =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id,
  });

  res.json(order);
});

router.put('/:id/complete', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  let order =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id
  });

  if (!order) {
    return res.status(400).json({ message: 'Produto inválido.' });
  }

  order.status = 'DONE';
  await order.save();

  res.json(order);
});

router.put('/:id/cancel', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  let order =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id
  });

  if (!order) {
    return res.status(400).json({ message: 'Produto inválido.' });
  }

  order.status = 'CANCELLED';
  await order.save();

  res.end();
});

module.exports = router;
