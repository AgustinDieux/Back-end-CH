const multer = require("multer");

// Función para definir la carpeta de destino en función del tipo de archivo
function getDestination(req, file, cb) {
  let destination = "uploads/";

  if (file.fieldname === "profileImage") {
    destination += "profiles/";
  } else if (file.fieldname === "productImage") {
    destination += "products/";
  } else if (file.fieldname === "documentFile") {
    destination += "documents/";
  }

  console.log("Destination:", destination); // Agregado para imprimir la carpeta de destino
  cb(null, destination);
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    const fileName = file.fieldname + "-" + uniqueSuffix + "." + fileExtension;
    console.log("File Name:", fileName); // Agregado para imprimir el nombre del archivo
    cb(null, fileName);
  },
});

// Middleware de Multer
const upload = multer({ storage });

module.exports = upload;
