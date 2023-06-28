const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // опишем требования к имени в схеме:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { // опишем требования к имени в схеме:
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator(link) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+#?$/i.test(link);
      },
    },
  },
  owner: { // опишем требования к имени в схеме:
    type: mongoose.SchemaTypes.ObjectId, //
    required: true, // обязательное поле
  },
  likes: [{ // опишем требования к имени в схеме:
    type: mongoose.SchemaTypes.ObjectId, //
    default: [],
  }],
  createdAt: { // опишем требования к имени в схеме:
    type: Date, // это строка
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
