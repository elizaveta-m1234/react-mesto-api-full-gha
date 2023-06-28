/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  // рекомендуем записывать JWT в httpOnly куку - вынимаем
  const token = req.cookies.jwt;

  if (!token) {
    next(new Unauthorized('Ошибка авторизации'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new Unauthorized('Ошибка авторизации'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
