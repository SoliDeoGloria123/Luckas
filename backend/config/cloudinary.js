const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dtjuc1ngh', // tu cloud_name
  api_key: '642587874493492', // tu api_key
  api_secret: 'KvUqNiMywNT6Qwh5qGM5i7jUaUw'
});
module.exports = cloudinary;