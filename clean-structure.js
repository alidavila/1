// Script para estandarizar la estructura de archivos
const fs = require('fs');
const path = require('path');

// Directorios principales
const srcDir = path.join(__dirname, 'src');
const srcComponentsDir = path.join(srcDir, 'components');
const srcLibDir = path.join(srcDir, 'lib');
const srcStylesDir = path.join(srcDir, 'styles');
const srcAssetsDir = path.join(srcDir, 'assets');

const rootComponentsDir = path.join(__dirname, 'components');
const rootLibDir = path.join(__dirname, 'lib');
const rootPublicDir = path.join(__dirname, 'public');
const rootStylesDir = path.join(__dirname, 'styles');

// Función para verificar si un directorio existe
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Función para crear un directorio si no existe
function ensureDir(dirPath) {
  if (!directoryExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directorio creado: ${dirPath}`);
  }
}

// Función para copiar archivos recursivamente
function copyFiles(source, target) {
  if (!directoryExists(source)) return;
  
  ensureDir(target);
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyFiles(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Archivo copiado: ${sourcePath} -> ${targetPath}`);
    }
  });
}

// Función para eliminar un directorio recursivamente
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Si es un directorio, eliminarlo recursivamente
        deleteFolderRecursive(curPath);
      } else {
        // Si es un archivo, eliminar el archivo
        fs.unlinkSync(curPath);
      }
    });
    // Eliminar el directorio vacío
    fs.rmdirSync(dirPath);
    console.log(`Directorio eliminado: ${dirPath}`);
  }
}

// Mover archivos de src a la raíz, si es necesario
if (directoryExists(srcDir)) {
  console.log('Moviendo archivos desde src/ a la raíz...');
  
  // Mover components
  if (directoryExists(srcComponentsDir)) {
    copyFiles(srcComponentsDir, rootComponentsDir);
  }
  
  // Mover lib
  if (directoryExists(srcLibDir)) {
    copyFiles(srcLibDir, rootLibDir);
  }
  
  // Mover assets a public
  if (directoryExists(srcAssetsDir)) {
    copyFiles(srcAssetsDir, rootPublicDir);
  }
  
  // Mover styles
  if (directoryExists(srcStylesDir)) {
    copyFiles(srcStylesDir, rootStylesDir);
  }
  
  // Verificar si srcDir está vacío o solo tiene directorios que ya hemos procesado
  const remainingFiles = fs.readdirSync(srcDir).filter(file => {
    const filePath = path.join(srcDir, file);
    const isDir = fs.statSync(filePath).isDirectory();
    
    return !isDir || (
      file !== 'components' && 
      file !== 'lib' && 
      file !== 'assets' && 
      file !== 'styles' &&
      file !== 'app' // No mover app de forma automática
    );
  });
  
  if (remainingFiles.length === 0) {
    console.log('No hay archivos adicionales en src/, eliminando directorio...');
  } else {
    console.log('Archivos adicionales en src/ que no se moverán automáticamente:');
    console.log(remainingFiles);
    console.log('Por favor, mueva estos archivos manualmente si es necesario.');
  }
}

// Eliminar directorios vacíos
[rootComponentsDir, rootLibDir, rootStylesDir].forEach(dir => {
  if (directoryExists(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log(`Eliminado directorio vacío: ${dir}`);
  }
});

console.log('Estructura de archivos estandarizada correctamente.'); 