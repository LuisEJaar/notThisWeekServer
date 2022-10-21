const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: "./config/.env" });

cloudinary.config({ 
  cloud_name: 'dodhdvl4n', 
  api_key: '666317677982884', 
  api_secret: 'mC9KrEUuKGdrJzFdHQno9QN_UKs' 
});

module.exports = cloudinary;
