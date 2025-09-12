const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seminario';

const fixUserPassword = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const User = require('./models/User');
    
    // Hashear la contraseña por defecto "123456"
    const defaultPassword = "123456";
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    
    const user = await User.findByIdAndUpdate(
      '68ba54fd44a8b8bac6a2be8c',
      { password: hashedPassword },
      { new: true }
    );
    
    console.log('✅ Contraseña actualizada para el usuario:', user.nombre);
    console.log('🔑 Contraseña temporal: 123456');
    console.log('💡 El usuario puede cambiarla desde su perfil');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

fixUserPassword();
