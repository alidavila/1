// Script para estandarizar la estructura de archivos
const fs = require('fs');
const path = require('path');

// Directorios principales
const srcAppDir = path.join(__dirname, 'src', 'app');
const appDir = path.join(__dirname, 'app');

// Función para verificar si un directorio existe
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
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
  }
}

// Solo ejecutar si el directorio src/app existe
if (directoryExists(srcAppDir)) {
  console.log('Eliminando la estructura duplicada en src/app...');
  deleteFolderRecursive(srcAppDir);
  console.log('Estructura duplicada eliminada.');
} else {
  console.log('No se encontró estructura duplicada en src/app.');
}

// Verificar si quedan archivos en src/ que deberían moverse a la raíz
const srcDir = path.join(__dirname, 'src');
if (directoryExists(srcDir)) {
  // Comprobar si hay pocos archivos y no hay directorios importantes
  const srcFiles = fs.readdirSync(srcDir);
  const importantDirs = srcFiles.filter(file => {
    const filePath = path.join(srcDir, file);
    return fs.statSync(filePath).isDirectory() && file !== 'app' && file !== 'components';
  });

  if (importantDirs.length === 0) {
    console.log('Eliminando directorio src/ ya que no contiene directorios importantes...');
    deleteFolderRecursive(srcDir);
    console.log('Directorio src/ eliminado.');
  } else {
    console.log('El directorio src/ contiene directorios importantes que no se eliminarán:');
    console.log(importantDirs);
  }
}

console.log('Estructura de archivos estandarizada correctamente.'); 