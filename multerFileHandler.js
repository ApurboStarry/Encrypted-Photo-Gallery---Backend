const multer = require("multer");

function removeSpacesInFilename(filename) {
  const modifiedFilename = filename.replace(/ /g, "_");
  return modifiedFilename;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    file.originalname = removeSpacesInFilename(file.originalname);
    console.log(file);
    req.uploadedFile = file;
    cb(null, req.user._id + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "application/octet-stream") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
