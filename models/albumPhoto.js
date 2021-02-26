const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const albumPhotoSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
  },
});

const AlbumPhoto = mongoose.model("AlbumPhoto", albumPhotoSchema);

// function validateAlbum(albumPhoto) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(255).required(),
//   });

//   return schema.validate(albumPhoto);
// }

module.exports.AlbumPhoto = AlbumPhoto;
// module.exports.validate = validateAlbum;
