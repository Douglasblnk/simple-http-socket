const { Server } = require('net');
const fs = require('fs');
const port = 8080;

const server = new Server();

server.listen(port, () => {
  console.log('Ouvindo na porta', port);
})

function readHTML() {
  return new Promise((resolve, reject) => {
    fs.readFile('./index.html', (err, html) => {
      if (err) return reject(err);
      return resolve(html.toString());
    });
  });
}

server.on('connection', socket => {
  socket.on('data', async data => {
    const html = await readHTML();
    
    console.log('html :>> ', html);
    
    socket.write([
      'HTTP/1.1 200 OK',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Encoding: UTF-8',
      'Accept-Ranges: bytes',
      'Connection: keep-alive',
      `Content-Length: ${html.length}`,
    ].join('\n') + '\n\n');
    
    socket.write(html);
    
    socket.end();
  })

  socket.on('close', () => {
    console.log('conexão fechada seu arrombado');
  })
});