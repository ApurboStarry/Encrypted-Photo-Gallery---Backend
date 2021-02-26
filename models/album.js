const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Album = mongoose.model("Album", albumSchema);

function validateAlbum(album) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(album);
}

module.exports.Album = Album;
module.exports.validate = validateAlbum;
