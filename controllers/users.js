const User = require('../models/user');
const { ERROR_DEFAULT, ERROR_CODE, ERROR_NOT_FOUND } = require('../utils/constants/errorStatus');

// GET Получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

// GET Получить пользователя по ID
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан некорректный _id пользователя.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// POST Создать пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// Изменить информацию о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// Изменить аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
