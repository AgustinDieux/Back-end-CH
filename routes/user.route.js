const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Función para verificar y crear la carpeta de destino si no existe
const createDestinationFolder = (req, file, cb) => {
  let folder;
  if (file.fieldname === "profileImage") {
    folder = "profiles";
  } else if (file.fieldname === "productImage") {
    folder = "products";
  } else {
    folder = "documents";
  }

  const destination = path.join("uploads", folder);
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  cb(null, destination);
};

const storage = multer.diskStorage({
  destination: createDestinationFolder,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.patch("/premium/:uid", userController.changeUserRole);
router.post(
  "/:uid/documents",
  upload.array("documentFiles"),
  userController.uploadDocuments
);

module.exports = router;
