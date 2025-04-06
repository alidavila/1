const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Determinar si estamos en desarrollo o producción
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '4000', 10);

// Inicializar Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Verificar y crear directorios necesarios para evitar errores ENOENT
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`> Directorio creado: ${dirPath}`);
  }
};

// Asegurar que existan directorios críticos
const prepareDirectories = () => {
  const dirs = [
    path.join(__dirname, '.next', 'static', 'chunks'),
    path.join(__dirname, '.next', 'server', 'app'),
    path.join(__dirname, '.next', 'server', 'chunks'),
  ];
  
  dirs.forEach(ensureDirectoryExists);
};

// Función para verificar si el puerto está en uso y buscar uno alternativo
const findAvailablePort = (startPort, callback) => {
  const net = require('net');
  const server = net.createServer();
  
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`> Puerto ${startPort} ocupado, intentando con ${startPort + 1}`);
      findAvailablePort(startPort + 1, callback);
    } else {
      callback(err);
    }
  });
  
  server.once('listening', () => {
    server.close(() => {
      callback(null, startPort);
    });
  });
  
  server.listen(startPort);
};

// Verificar directorios antes de iniciar
prepareDirectories();

// Buscar puerto disponible y preparar el servidor
findAvailablePort(port, (err, availablePort) => {
  if (err) {
    console.error('Error al buscar puerto disponible:', err);
    process.exit(1);
  }
  
  const serverPort = availablePort;
  console.log(`> Iniciando servidor en puerto: ${serverPort}`);
  
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
          // Para todas las demás rutas, deja que Next.js se encargue
          await handle(req, res, parsedUrl);
        }
      } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        
        // Manejo mejorado de errores
        if (err.code === 'ENOENT') {
          // El archivo solicitado no existe
          console.log(`> Archivo no encontrado: ${err.path}`);
          
          // Intentar redirigir a una página existente
          try {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
          } catch (redirectErr) {
            res.statusCode = 404;
            res.end('Recurso no encontrado');
          }
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
      
      // No terminamos el proceso para mantener el servidor funcionando
      if (err.code !== 'EADDRINUSE' && server.listening) {
        console.log('> El servidor continúa ejecutándose después del error');
      }
    });
    
    // Iniciar el servidor con manejo de errores
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`> Error: El puerto ${serverPort} ya está en uso`);
        console.log('> Intente detener otros servidores o use un puerto diferente');
        process.exit(1);
      } else {
        console.error('> Error al iniciar el servidor:', err);
        process.exit(1);
      }
    });
    
    server.listen(serverPort, (err) => {
      if (err) throw err;
      console.log(`> Servidor listo en http://${hostname}:${serverPort}`);
      console.log('> Presiona Ctrl+C para detener el servidor');
    });
  }).catch(err => {
    console.error('Error al inicializar Next.js:', err);
    process.exit(1);
  });
}); 