const Card = require('../models/card');
const { ERROR_DEFAULT, ERROR_CODE, ERROR_NOT_FOUND } = require('../utils/constants/errorStatus');

// GET Получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards })) // статус 200, отправляем карточки
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' })); // ошибка сервера, статус 500
};

// POST Создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// DELETE Удалить карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при удалении карточки.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// PUT Поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

// DELETE Удалить лайк у карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
