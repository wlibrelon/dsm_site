// Servidor do site institucional + API do servidor de licenças, pro plano
// Node.js/VPS da Hostinger. Serve o build estático (dist/) igual antes, e
// agora também monta /api/licencas/* (Express) pro DSM consultar.
// Uso: 1) npm run build   2) npm run migrate   3) node server.js
// A Hostinger injeta a porta em process.env.PORT.
import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rotasLicenca } from './api/rotas.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

const app = express()

app.use('/api/licencas', rotasLicenca)

app.use(express.static(DIST_DIR))

// Qualquer rota que não seja /api/* e não bata em arquivo estático cai no
// index.html (roteamento do React Router).
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`DSM (site + licenças) rodando em http://localhost:${PORT}`)
})
