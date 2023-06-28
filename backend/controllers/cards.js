/* eslint-disable linebreak-style */
const Card = require('../models/card');
const { created } = require('../utils/constants');
const InternalError = require('../errors/internal-server-error');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbiden');

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    // При обработке ошибок в блоке catch они не выбрасываются через throw , а передаются в
    // централизованный обработчик ошибок с помощью next
    .catch(() => next(new InternalError('Ошибка по умолчанию')));
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  const id = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (id !== card.owner.toString()) {
        throw new Forbidden('Отсутствует доступ');
      }
      card.deleteOne()
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка с указанным _id не найдена'));
        return;
      }
      next(err);
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Передан несуществующий _id карточки'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Передан несуществующий _id карточки'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};
