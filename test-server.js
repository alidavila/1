const http = require('http');

// Crear un servidor HTTP simple
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>Servidor de prueba funcionando</h1><p>Si puedes ver esto, el servidor HTTP básico está funcionando correctamente.</p></body></html>');
});

// Configurar el puerto - prueba con el 3333
const PORT = 3333;

// Iniciar el servidor en todas las interfaces
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de prueba iniciado en http://localhost:${PORT}`);
  console.log(`También puedes intentar acceder usando http://127.0.0.1:${PORT}`);
}); 