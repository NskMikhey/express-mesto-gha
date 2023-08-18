const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorized-error');

// мидлвара авторизации - проверяет наличие токена и верифицирует его

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация.');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
