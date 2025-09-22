const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('OK MongoDB conectado');
    }catch(err){
        console.error('X error de conexion a MongoDB' ), err.message;
        process.exit(1);
    }
};

module.exports = connectDB;