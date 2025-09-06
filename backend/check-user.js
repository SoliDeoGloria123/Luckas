const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seminario';

const checkUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const User = require('./models/User');
    const user = await User.findById('68ba54fd44a8b8bac6a2be8c');
    console.log('Usuario:', user.nombre, user.correo);
    console.log('Tiene contraseña:', !!user.password);
    console.log('Longitud contraseña:', user.password ? user.password.length : 'N/A');
    console.log('Campo password:', user.password ? 'Presente' : 'Ausente');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUser();
