const http = require('http');

// Crear servidor HTTP básico
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
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
          <button class="button" onclick="alert('¡Funcionando correctamente!')">Test</button>
        </div>
      </body>
    </html>
  `);
});

// Configuración del servidor
const PORT = 3999;
const HOST = '0.0.0.0';

// Iniciar servidor
server.listen(PORT, HOST, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor');
}); 