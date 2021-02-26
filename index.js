const express = require("express");
const mongoose = require("mongoose");
const photos = require("./routes/photos");
const albums = require("./routes/albums");
const albumPhotos = require("./routes/albumPhotos");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");

const app = express();

if(!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb+srv://apurbo:984621kk@cluster0.potfq.mongodb.net/EncryptedPhotoGallery?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Could not connect to MongoDB!!!", error));

app.use(express.json());
require("./startup/prod")(app);
app.use("/api/v1/users", users); // register
app.use("/api/v1/auth", auth); // login
app.use("/api/v1/photos", photos);
app.use("/api/v1/albums", albums);
app.use("/api/v1/albumPhotos", albumPhotos);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
})