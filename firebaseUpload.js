const { rejects } = require("assert");
const firebase = require("firebase/app");
const fs = require('fs');
const { resolve } = require("path");
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-TAacbLdNlKw6uhXdQwEHKRIkHiC6i98",
  authDomain: "encrypted-photo-gallery.firebaseapp.com",
  projectId: "encrypted-photo-gallery",
  storageBucket: "encrypted-photo-gallery.appspot.com",
  messagingSenderId: "119774240975",
  appId: "1:119774240975:web:8be61f51e71cc4dc6917ba",
  measurementId: "G-YD1MJW7F6S",
};

firebase.initializeApp(firebaseConfig);

const storageRef = firebase.storage().ref();

// ** Downloading files
// storageRef
//   .child("epg/2020-bmw-7-series-62.jpg.enc")
//   .getDownloadURL()
//   .then((url) => {
//     // `url` is the download URL for 'images/stars.jpg'

//     // This can be downloaded directly:
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = "blob";
//     xhr.onload = (event) => {
//       var blob = xhr.response;
//     };
//     xhr.open("GET", url);
//     xhr.send();

//     console.log(url);
//     process.exit(0);
//   })
//   .catch((error) => {
//     // A full list of error codes is available at
//     // https://firebase.google.com/docs/storage/web/handle-errors
//     switch (error.code) {
//       case "storage/object-not-found":
//         // File doesn't exist
//         console.log("File doesn't exist");
//         break;
//       case "storage/unauthorized":
//         // User doesn't have permission to access the object
//         console.log("User doesn't have permission to access the object");
//         break;
//       case "storage/canceled":
//         // User canceled the upload
//         console.log("User canceled the upload");
//         break;

//       // ...

//       case "storage/unknown":
//         // Unknown error occurred, inspect the server response
//         console.log("Unknown error occurred, inspect the server response");
//         break;
//     }

//     process.exit(1);
//   });

//----------------------------------------------------------------------------------

// Uploading Files
// const imagesRef = storageRef.child("epg/2020-bmw-7-series-62.jpg.enc"); // child("file name to be created")
// var metadata = {
//   contentType: "application/octet-stream",
// };

// fs.readFile("./2020-bmw-7-series-62.jpg.enc", (err, data) => {
//   if (err) throw err;
//   console.log(data);
//   imagesRef.put(data, metadata).then((snapshot) => {
//     console.log("Uploaded a file");
//     console.log(snapshot);
//   });
// });

async function uploadToFirebase(userId, filename) {
  fileLocationInFirebase = userId + "/" + filename;
  fileLocationInServer = __dirname + "/uploads/" + userId + filename;

  console.log(fileLocationInServer);

  // first upload to firebase
  const imagesRef = storageRef.child(fileLocationInFirebase); // child("file name to be created")
  var metadata = {
    contentType: "application/octet-stream",
  };
  

  const fsPromise = await fs.promises.readFile(fileLocationInServer);
  const snapshot = await imagesRef.put(fsPromise.buffer, metadata);
  // console.log("Snapshot", snapshot);
  // console.log("File uploaded");

  const url = await storageRef.child(fileLocationInFirebase).getDownloadURL();
  // console.log(url);
  return new Promise((resolve, reject) => {
    resolve(url);
  });

  // fs.readFile(fileLocationInServer, (err, data) => {
  //   if (err) throw err;
  //   console.log(data);

  //   imagesRef
  //     .put(data, metadata)
  //     .then((snapshot) => { console.log("Uploaded a file"); });

  //   // now, get the download url
  //   storageRef
  //     .child(fileLocationInFirebase)
  //     .getDownloadURL()
  //     .then((url) => {
  //       // `url` is the download URL for 'images/stars.jpg'

  //       // This can be downloaded directly:
  //       var xhr = new XMLHttpRequest();
  //       xhr.responseType = "blob";
  //       xhr.onload = (event) => {
  //         var blob = xhr.response;
  //       };
  //       xhr.open("GET", url);
  //       xhr.send();

  //       console.log(url);
  //       return url;
  //       // process.exit(0);
  //     })
  //     .catch((error) => {
  //       // A full list of error codes is available at
  //       // https://firebase.google.com/docs/storage/web/handle-errors
  //       switch (error.code) {
  //         case "storage/object-not-found":
  //           // File doesn't exist
  //           console.log("File doesn't exist");
  //           break;
  //         case "storage/unauthorized":
  //           // User doesn't have permission to access the object
  //           console.log("User doesn't have permission to access the object");
  //           break;
  //         case "storage/canceled":
  //           // User canceled the upload
  //           console.log("User canceled the upload");
  //           break;

  //         // ...

  //         case "storage/unknown":
  //           // Unknown error occurred, inspect the server response
  //           console.log("Unknown error occurred, inspect the server response");
  //           break;
  //       }

  //       // process.exit(1);
  //     });
  // });
}

module.exports = uploadToFirebase;
