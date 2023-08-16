const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const DefaultError = require('../errors/default-error');
const ConflictError = require('../errors/conflict-err');

// GET Получить всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      throw new DefaultError('На сервере произошла ошибка');
    })
    .catch(next);
};

// GET Получить пользователя по ID
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден.')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден.')))
    .then((user) => res.send(user))
    .catch(next);
};

// PATCH / Изменить информацию о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      throw new DefaultError('На сервере произошла ошибка');
    })
    .catch(next);
};

// PATCH / Изменить аватар пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      throw new DefaultError('На сервере произошла ошибка');
    })
    .catch(next);
};

// POST /signup —  Создать пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Поля email и password обязательны.'));
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Передан уже зарегистрированный email.'));
      } else {
        next(err);
      }
    });
};

// POST /signin аутентификация (вход)
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch(() => {
      // ошибка аутентификации
      throw new UnauthorizedError('Передан неверный логин или пароль.');
    })
    .catch(next);
};
