const auth = require("../middleware/auth");
const {Album, validate} = require("../models/album");
const {AlbumPhoto} = require("../models/albumPhoto");
const express = require("express");

const router = express.Router();

// -> /api/v1/albums
router.get("/", auth, async (req, res) => {
  // res.send("all albums of a particular user to be returned.");

  const albums = await Album.find({ ownerId: req.user._id }).sort("-_id").select("-ownerId -__v");
  res.send(albums);
});

router.get("/:id", auth, async (req, res) => {
  // res.send(`Album with ID ${req.params.id} to be displayed here`);

  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const album = await Album.findOne({
    ownerId: req.user._id,
    _id: req.params.id,
  }).select("-ownerId -__v");
  if(!album) return res.status(400).send("The album with the given ID was not found!");

  res.send(album);
});

router.post("/", auth, async (req, res) => {
  // res.status(201).send("new album to be created here");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let album = new Album({ name: req.body.name, ownerId: req.user._id });
  album = await album.save();

  res.send({
    _id: album._id,
    name: album.name
  });
});

router.put("/:id", auth, async (req, res) => {
  // res.send(`Album with ID ${req.params.id} to be updated here`);
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const album = await Album.findOneAndUpdate({ _id: req.params.id, ownerId: req.user._id }, { name: req.body.name }, { new: true });
  if(!album) {
    return res.status(400).send("The album with the given ID was not found");
  }

  res.send({
    _id: album._id,
    name: album.name
  });
});

router.delete("/:id", auth, async (req, res) => {
  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  // find any album with given album ID and owner ID
  // if not found, return bad request

  // otherwise, 
    // delete all entries in albumPhotos with album=req.params.id 
    // delete the album with req.params.id

  let album = await Album.findOne({ _id: req.params.id, ownerId: req.user._id });
  if(!album) {
    return res.status(400).send("The album with the given ID was not found!");
  }

  await AlbumPhoto.deleteMany({ album: req.params.id });
  album = await Album.findOneAndRemove({
    _id: req.params.id,
    ownerId: req.user._id,
  });

  res.send({
    _id: album._id,
    name: album.name
  });
});

module.exports = router;