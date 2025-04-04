const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('¡Hola Mundo! El servidor funciona correctamente.\n');
});

const port = 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}/`);
}); 