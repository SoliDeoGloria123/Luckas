// Script para verificar los valores exactos del enum
const User = require('./models/User');

console.log('Valores del enum en el modelo:');
const schema = User.schema.paths.tipoDocumento;
console.log('enum values:', schema.enumValues);

schema.enumValues.forEach((value, index) => {
  console.log(`${index}: "${value}" (length: ${value.length})`);
  console.log('Bytes:', [...value].map(char => char.charCodeAt(0)));
  console.log('---');
});

// Probar normalización
const { normalizeTipoDocumento } = require('./utils/userValidation');

const testValues = [
  'Cédula de ciudanía',
  'Cédula de ciudadanía', 
  'Cédula de cíudania'
];

console.log('\nPruebas de normalización:');
testValues.forEach(value => {
  const normalized = normalizeTipoDocumento(value);
  console.log(`"${value}" -> "${normalized}"`);
  console.log('Original bytes:', [...value].map(char => char.charCodeAt(0)));
  console.log('Normalized bytes:', [...normalized].map(char => char.charCodeAt(0)));
  console.log('Match:', schema.enumValues.includes(normalized));
  console.log('---');
});
