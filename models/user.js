const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // требования к имени в схеме:
    type: String,
    required: true, // должно быть у каждого пользователя, обязательное поле
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
