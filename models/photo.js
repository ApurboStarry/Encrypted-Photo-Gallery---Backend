const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now(),
  },
  isTrashed: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Photo = mongoose.model("Photo", photoSchema);

function validatePhoto(photo) {
  const schema = Joi.object({
    name: Joi.string().required(),
    // ownerId: Joi.objectId().required(), // user doesn't need to pass his ownerId as "middleware/auth.js" has set req.user by verifying JWT token
    // location: Joi.string().required(), // location should not be validated here as this function validates user input. and location is set by ourselves
  });

  return schema.validate(photo);
}

module.exports.Photo = Photo;
module.exports.validate = validatePhoto;
