/**
 * Script para corregir headers de autenticación en todos los servicios
 * Cambia de "Authorization: Bearer" a "x-access-token"
 */

const fs = require('fs');
const path = require('path');

const servicesDir = './frontend/src/services';
const files = fs.readdirSync(servicesDir);

console.log('🔧 Corrigiendo headers de autenticación en servicios...\n');

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazos necesarios
    const replacements = [
      {
        from: /Authorization: `Bearer \${localStorage\.getItem\("token"\)}`/g,
        to: '"x-access-token": localStorage.getItem("token")'
      },
      {
        from: /headers: \{ Authorization: `Bearer \${localStorage\.getItem\("token"\)}` \}/g,
        to: 'headers: { "x-access-token": localStorage.getItem("token") }'
      },
      {
        from: /Authorization: `Bearer \${token}`/g,
        to: '"x-access-token": token'
      },
      {
        from: /\.\.\.token && \{ Authorization: `Bearer \${token}` \}/g,
        to: '...(token && { "x-access-token": token })'
      }
    ];
    
    let changed = false;
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corregido: ${file}`);
    } else {
      console.log(`ℹ️  Sin cambios: ${file}`);
    }
  }
});

console.log('\n🎉 ¡Corrección de headers completada!');
console.log('Los servicios ahora usan "x-access-token" en lugar de "Authorization: Bearer"');
