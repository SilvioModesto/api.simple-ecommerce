const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const database = require('../database');

router.post('/signup', (req, res, next) => {
  const { email, name, password } = req.body || {};

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Email inválido.'});
  }

  if (!name) {
    return res
      .status(400)
      .json({ message: 'Nome inválido.'});
  }

  if (!password) {
    return res
      .status(400)
      .json({ message: 'Senha inválida.'});
  }

  const newUserData = { name, email, password };
  database.users
    .create(newUserData)
    .then(() => res.status(201).json())
    .catch(() => res.status(500).json({
      message: 'Error o try to create user.'
    }));
});

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body || {};

  const user = await database.users.findOne({ email, password });
  if (!user) {
    return res
      .status(400)
      .json({ message: 'Credenciais inválidas.' });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  res.json({
    token,
    userName: user.name,
    
  });
});

module.exports = router;
