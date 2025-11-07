// Script para verificar los valores exactos del enum
const User = require('./models/User');

console.log('Valores del enum en el modelo:');
const schema = User.schema.paths.tipoDocumento;
console.log('enum values:', schema.enumValues);

for (let index = 0; index < schema.enumValues.length; index++) {
  const value = schema.enumValues[index];
  console.log(`${index}: "${value}" (length: ${value.length})`);
  console.log('Bytes:', [...value].map(char => char.codePointAt(0)));
  console.log('---');
}

// Probar normalización
const { normalizeTipoDocumento } = require('./utils/userValidation');

const testValues = [
  'Cédula de ciudanía',
  'Cédula de ciudadanía', 
  'Cédula de cíudania'
];

console.log('\nPruebas de normalización:');
for (const value of testValues) {
  const normalized = normalizeTipoDocumento(value);
  console.log(`"${value}" -> "${normalized}"`);
  console.log('Original bytes:', [...value].map(char => char.codePointAt(0)));
  console.log('Normalized bytes:', [...normalized].map(char => char.codePointAt(0)));
  console.log('Match:', schema.enumValues.includes(normalized));
  console.log('---');
}
