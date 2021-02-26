const auth = require("../middleware/auth");
const express = require("express");
const { Photo, validate } = require("../models/photo");
const { AlbumPhoto } = require("../models/albumPhoto");
const router = express.Router();
const upload = require("../multerFileHandler");
const uploadToFirebase = require("../firebaseUpload");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     req.uploadedFile = file;
//     cb(null, req.user._id + file.originalname);
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// -> /api/v1/photos
router.get("/", auth, async (req, res) => {
  // res.send("List of photos");
  // user id is available at "req.user._id"

  const photos = await Photo.find({ ownerId: req.user._id, isTrashed: false })
    .sort("-_id")
    .select("-__v -isTrashed -ownerId");
  res.send(photos);
});

router.get("/:id", auth, async (req, res) => {
  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    // Photo.find

    if (!photo)
      return res.status(400).send("The photo with the given ID was not found");

    res.send({
      _id: photo._id,
      name: photo.name,
      uploadTime: photo.uploadTime,
      location: photo.location,
    });
  } catch (ex) {
    return res.status(500).send("Something went wrong!");
  }
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  // res.send("POST request to photos");

  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  if(!req.uploadedFile) {
    return res.status(400).send("Invalid input file");
  }

  let photo = await Photo.findOne({
    name: req.uploadedFile.originalname,
    ownerId: req.user._id,
  });
  if (photo) {
    return res
      .status(400)
      .send(
        `Photo with name "${req.uploadedFile.originalname}" already exists`
      );
  }

  const photoLocation = await uploadToFirebase(
    req.user._id,
    req.uploadedFile.originalname
  );
  // uploadToFirebase(req.user._id, req.file.originalname);

  photo = new Photo({
    name: req.uploadedFile.originalname,
    ownerId: req.user._id,
    location: photoLocation,
  });
  photo = await photo.save();

  res.send({
    _id: photo._id,
    name: photo.name,
  });
});

router.delete("/:id", auth, async (req, res) => {
  // res.send(`Image with ID ${req.params.id} to be deleted`);

  const isValidId = req.params.id.length == 24;
  // console.log(isValidId);
  if (!isValidId) return res.status(400).send("Invalid ID");

  let photo = await Photo.findOne({
    _id: req.params.id,
    ownerId: req.user._id,
  });
  if (!photo)
    return res.status(400).send("The photo with the given ID was not found");

  // in this point there is photo with given req.params.id
  // so, delete all the entries in "AlbumPhoto" with { photo: req.params.id }
  // and delete the entry in "Photo" with { _id: req.params.id }

  await AlbumPhoto.deleteMany({ photo: req.params.id });
  photo = await Photo.findOneAndRemove({ _id: req.params.id });

  res.send(photo);
});

module.exports = router;
