const database = require('../database');
const jwt = require('jsonwebtoken');

module.exports = async function authMiddleware(req, res, next) {
  // valida se o token está no cabeçalho.
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  // tenta decodificar o token para obter o payload.
  let payload = null;
  try {
    payload = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
  } catch(e) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
  
  // o payload deve conter o id do usuário.
  if (!payload || !payload.id) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  // busca o usuário no banco de dados
  const user = await database.users.findOne({ _id: payload.id });
  if (!user) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  // passa a informação para o próximo middleware (intermediário).
  res.locals.user = user;

  next();
}