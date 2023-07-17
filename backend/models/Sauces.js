const mongoose = require('mongoose');

// console.log("model init");

const saucesSchema = mongoose.Schema({
  userId :{ type: String, required: true },
  name :{ type: String, required: true },
  manufacturer :{ type: String, required: true },
  description :{ type: String, required: true },
  imageUrl : { type: String, required: true },
  heat : { type: Number, required: true },
  likes : { default: 0, type: Number, required: true },
  dislikes :{ default: 0,type: Number, required: true },
  usersLiked :{ type: Array, required: true },
  usersDisliked :{ type: Array, required: true },
});

module.exports = mongoose.model('Sauces', saucesSchema);