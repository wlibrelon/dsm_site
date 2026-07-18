// Servidor estático simples para o plano Node.js/VPS da Hostinger.
// Não é necessário se o site for hospedado como "Website" estático (Apache) —
// nesse caso o .htaccess em public/.htaccess já resolve o roteamento.
// Uso: 1) npm run build   2) node server.js
// A Hostinger injeta a porta em process.env.PORT.

import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    let filePath = join(DIST_DIR, urlPath)

    const fileStat = await stat(filePath).catch(() => null)

    // Se não existe arquivo real (rota do React Router), serve index.html.
    if (!fileStat || fileStat.isDirectory()) {
      filePath = join(DIST_DIR, 'index.html')
    }

    const content = await readFile(filePath)
    const type = MIME_TYPES[extname(filePath)] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
    res.end(content)
  } catch (err) {
    res.writeHead(500)
    res.end('Erro interno do servidor')
  }
})

server.listen(PORT, () => {
  console.log(`DSM rodando em http://localhost:${PORT}`)
})
