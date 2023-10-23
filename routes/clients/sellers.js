const express = require("express");
const router = express.Router();
const database = require("../../database");

router.get("/", async (req, res, next) => {
  const { name, email } = req.query;
  const query = {};

  if (name) {
    query.name = { $regex: new RegExp(`^${name}`, "i") };
  }

  if (email) {
    query.email = { $regex: new RegExp(`^${email}`, "i") };
  }

  const users = await database.users.find(query);

  res.json(users.map((u) => {

    return {
      name: u.name,
      _id: u.id,
    };

  }));
});

router.get("/:sellerId/products", async (req, res, next) => {
  const { sellerId } = req.params;
  const { label } = req.query;
  const query = { userId: sellerId };

  if (label) {
    query.label = { $regex: new RegExp(`^${label}`, "i") };
  }

  const products = await database.products.find(query);

  res.json(products);
});

router.get("/:sellerId/products/:id", async (req, res, next) => {
  const { sellerId, id } = req.params;

  const product = await database.products.findOne({
    _id: id,
    userId: sellerId,
  });

  if (!product) {
    return res.status(400).json({ message: "Registro inválido." });
  }

  res.json(product);
});

router.post("/:sellerId/order", async (req, res, next) => {
  const { sellerId } = req.params;
  const { products, deliveryData, billingData, paymentMethod } = req.body;

  if (!products) {
    return res.status(400).json({ message: 'Informe os produtos.' });
  }

  if (!deliveryData) {
    return res.status(400).json({ message: 'Informe o deliveryData' });
  }

  if (!billingData) {
    return res.status(400).json({ message: 'Informe o billingData' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Informe o paymentMethod' });
  }

  const order = await database.orders.create({
    userId: sellerId,
    products,
    deliveryData,
    billingData,
    paymentMethod,
    status: 'PENDING',
  });

  return res.json(order);
});

module.exports = router;
