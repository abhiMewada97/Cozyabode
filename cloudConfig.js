const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({         // cloudinary.config ke ander we pass configration detail   // kisi chij ko configur karne ka means hai jodna // backend join with cloudinary accound
        // process ke ander environmet ke ander 
    cloud_name: process.env.CLOUD_NAME,     //cloud_name, api_key & api_secret by default key ko eshi name pass karna hota but we can change name inside .env
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// defining storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

module.exports = {
    cloudinary,
    storage,
}