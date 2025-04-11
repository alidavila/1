const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Determinar si estamos en desarrollo o producción
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 4000; // Usar variable de entorno PORT para Vercel

// Manejar solicitudes concurrentes y problemas de permisos de archivos
const MAX_RETRIES = 3;
const retryDelay = 500; // ms

// Función de utilidad para esperar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Detectar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';

// Si estamos en Vercel, no necesitamos ejecutar el servidor personalizado
if (isVercel) {
  console.log('> Ejecutando en Vercel, omitiendo servidor personalizado');
  // Exportamos un objeto vacío para evitar errores
  module.exports = {};
  return;
}

// Inicializar Next.js con opciones optimizadas
const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    reactStrictMode: true,
    swcMinify: true, // Usar SWC para minificación
    optimizeCss: true // Optimizar CSS
  }
});

const handle = app.getRequestHandler();

// Verificar y crear directorios necesarios para evitar errores ENOENT
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`> Directorio creado: ${dirPath}`);
    }
  } catch (err) {
    console.warn(`> Advertencia: No se pudo crear el directorio ${dirPath}`, err);
  }
};

// Asegurar que existan directorios críticos
const prepareDirectories = () => {
  const dirs = [
    path.join(__dirname, '.next', 'static', 'chunks'),
    path.join(__dirname, '.next', 'server', 'app'),
    path.join(__dirname, '.next', 'server', 'chunks'),
    path.join(__dirname, '.next', 'cache')
  ];
  
  dirs.forEach(ensureDirectoryExists);
};

// Verificar directorios antes de iniciar
prepareDirectories();

// Limpieza de seguridad: eliminar .babelrc si existe
const babelrcPath = path.join(__dirname, '.babelrc');
if (fs.existsSync(babelrcPath)) {
  try {
    fs.unlinkSync(babelrcPath);
    console.log('> Archivo .babelrc eliminado para prevenir conflictos con SWC');
  } catch (err) {
    console.warn('> No se pudo eliminar .babelrc:', err.message);
  }
}

console.log(`> Iniciando servidor en puerto: ${port}`);

// Función para manejar solicitudes con reintentos
const handleRequestWithRetry = async (req, res, parsedUrl) => {
  let attempts = 0;
  
  while (attempts < MAX_RETRIES) {
    try {
      await handle(req, res, parsedUrl);
      return;
    } catch (err) {
      attempts++;
      
      // Si es un error de acceso a archivos, intentar de nuevo
      if (['ENOENT', 'UNKNOWN', 'EACCES'].includes(err.code) && attempts < MAX_RETRIES) {
        console.warn(`> Reintentando acceso a archivo (${attempts}/${MAX_RETRIES}): ${err.path || 'desconocido'}`);
        await wait(retryDelay);
      } else {
        throw err; // No más reintentos o error diferente
      }
    }
  }
};

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Parsear la URL de la petición
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Agregar encabezados CORS para desarrollo local
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      
      // Para solicitudes OPTIONS (preflight), responder inmediatamente
      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      // Manejar diferentes rutas
      if (pathname === '/api/health') {
        // Ruta de verificación de estado
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      } else if (pathname === '/test') {
        // Página de prueba simple
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>DANTE Finance - Test Server</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #050505;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                }
                .container {
                  text-align: center;
                  padding: 30px;
                  background-color: #111;
                  border-radius: 10px;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  max-width: 500px;
                }
                h1 {
                  color: #eab308;
                }
                .timestamp {
                  color: #999;
                  margin-top: 20px;
                  font-size: 14px;
                }
                .button {
                  background-color: #eab308;
                  border: none;
                  color: #000;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>DANTE Finance</h1>
                <p>Servidor de prueba funcionando correctamente.</p>
                <p>Si puedes ver esta página, significa que tu red local permite conexiones a servicios web.</p>
                <p class="timestamp">Timestamp: ${new Date().toISOString()}</p>
                <p><a href="/" style="color:#eab308; text-decoration:none;">Ir a la aplicación principal</a></p>
                <button class="button" onclick="alert('¡Funcionando correctamente!')">Test</button>
              </div>
            </body>
          </html>
        `);
      } else {
        // Para todas las demás rutas, deja que Next.js se encargue con manejo de reintentos
        await handleRequestWithRetry(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error al procesar la solicitud:', err);
      
      // Manejo mejorado de errores
      if (err.code === 'ENOENT') {
        console.log(`> Archivo no encontrado: ${err.path || 'desconocido'}`);
        
        res.statusCode = 404;
        res.end('Recurso no encontrado');
      } else {
        // Otros errores del servidor
        res.statusCode = 500;
        res.end('Error interno del servidor');
      }
    }
  });
  
  // Manejo mejorado de excepciones no capturadas
  process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    
    // Si es un error crítico, terminar el proceso
    if (err.code === 'EADDRINUSE') {
      console.error(`> Error: El puerto ${port} ya está en uso. Por favor, cierra la aplicación que está usando este puerto.`);
      process.exit(1);
    }
  });
  
  // Iniciar el servidor con manejo de errores
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`> Error: El puerto ${port} ya está en uso`);
      console.log('> Por favor, cierra la aplicación que está usando este puerto o reinicia tu computadora');
      process.exit(1);
    } else {
      console.error('> Error al iniciar el servidor:', err);
      process.exit(1);
    }
  });
  
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Servidor listo en http://${hostname}:${port}`);
    console.log('> Presiona Ctrl+C para detener el servidor');
  });
}).catch(err => {
  console.error('Error al inicializar Next.js:', err);
  process.exit(1);
}); 