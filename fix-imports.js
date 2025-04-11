const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

const typesImportRegex = /from\s+['"](\.\.\/)+types['"];/g;
const typesImportReplacement = 'from \'@/types\';';

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    if (typesImportRegex.test(content)) {
      console.log(`Procesando: ${filePath}`);
      
      // Reemplazar importaciones relativas con la importación absoluta
      const updatedContent = content.replace(typesImportRegex, typesImportReplacement);
      
      // Guardar el archivo actualizado
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
    return false;
  }
}

async function walkDir(dir) {
  let results = [];
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
    
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subResults = await walkDir(fullPath);
      results = results.concat(subResults);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

async function main() {
  try {
    console.log('🔍 Buscando archivos con importaciones de tipos relativas...');
    const files = await walkDir('.');
    
    console.log(`📁 Encontrados ${files.length} archivos TypeScript/React`);
    
    let modifiedCount = 0;
    for (const file of files) {
      const modified = await processFile(file);
      if (modified) modifiedCount++;
    }
    
    console.log(`\n✨ Proceso completado. Se actualizaron ${modifiedCount} archivos.`);
  } catch (error) {
    console.error('❌ Error ejecutando el script:', error);
  }
}

main(); 