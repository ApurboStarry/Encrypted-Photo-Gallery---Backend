const auth = require("../middleware/auth");
const { AlbumPhoto } = require("../models/albumPhoto");
const { Album } = require("../models/album");
const { Photo } = require("../models/photo");
const express = require("express");

const router = express.Router();

// -> /api/v1/albumPhotos/albumId
router.get("/:albumId", auth, async (req, res) => {
  // res.send(`Album with ID ${req.params.id} to be displayed here`);

  const isValidId = req.params.albumId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const album = await Album.findOne({
    _id: req.params.albumId,
    ownerId: req.user._id,
  });
  if (!album) return res.status(400).send("Invalid album ID");

  const albumPhotos = await AlbumPhoto
    .find({ album: req.params.albumId, })
    .populate("photo", "name location uploadTime")
    .select("-__v");
  
  res.send(albumPhotos);
});

router.post("/:albumId/:photoId", auth, async (req, res) => {
  // res.status(201).send("new album to be created here");
  const isValidId =
    req.params.albumId.length == 24 && req.params.photoId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const album = await Album.findOne({
    _id: req.params.albumId,
    ownerId: req.user._id,
  });
  if (!album) return res.status(400).send("Invalid album ID");

  const photo = await Photo.findOne({
    _id: req.params.photoId,
    ownerId: req.user._id,
  });
  if (!photo) return res.status(400).send("Invalid photo ID");

  let albumPhoto = await AlbumPhoto.findOne({
    album: req.params.albumId,
    photo: req.params.photoId,
  });
  if (albumPhoto) {
    return res.status(400).send("Photo already exists in album");
  }

  albumPhoto = new AlbumPhoto({
    album: req.params.albumId,
    photo: req.params.photoId,
  });
  albumPhoto = await albumPhoto.save();

  res.send(albumPhoto);
});

router.delete("/:albumId/:photoId", auth, async (req, res) => {
  const isValidId =
    req.params.albumId.length == 24 && req.params.photoId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const album = await Album.findOne({
    _id: req.params.albumId,
    ownerId: req.user._id,
  });
  if (!album) return res.status(400).send("Invalid album ID");

  const photo = await Photo.findOne({
    _id: req.params.photoId,
    ownerId: req.user._id,
  });
  if (!photo) return res.status(400).send("Invalid photo ID");

  const albumPhoto = await AlbumPhoto.findOneAndRemove({
    album: req.params.albumId,
    photo: req.params.photoId,
  });
  if (!albumPhoto) {
    res.status(400).send("The album with the given ID was not found!");
  }

  res.send(albumPhoto);
});

module.exports = router;
