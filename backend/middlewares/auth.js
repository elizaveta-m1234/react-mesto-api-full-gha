/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // рекомендуем записывать JWT в httpOnly куку - вынимаем
  const token = req.headers.authorization.replace('Bearer ', '');

  if (!token) {
    next(new Unauthorized('Ошибка авторизации'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Ошибка авторизации'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
