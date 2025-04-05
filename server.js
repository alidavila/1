const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Determinar si estamos en desarrollo o producción
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '4000', 10);

// Inicializar Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Preparar el servidor
app.prepare().then(() => {
  createServer(async (req, res) => {
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
      res.statusCode = 500;
      res.end('Error interno del servidor');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Servidor listo en http://${hostname}:${port}`);
    console.log('> Presiona Ctrl+C para detener el servidor');
  });
}); 