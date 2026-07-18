// Servidor do site institucional + API do servidor de licenças, pro plano
// Node.js/VPS da Hostinger. Serve o build estático (dist/) igual antes, e
// também monta /api/licencas/* (pro DSM consultar) e /admin/api/* (painel
// de monitoramento de licenças, acesso restrito).
// Uso: 1) npm run build   2) npm run migrate   3) node server.js
// A Hostinger injeta a porta em process.env.PORT.
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rotasLicenca } from './api/rotas.js'
import { rotasAdmin } from './api/rotasAdmin.js'
import { runMigrations } from './api/migrate.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

const app = express()

app.use(cookieParser())
app.use('/api/licencas', rotasLicenca)
app.use('/admin/api', rotasAdmin)

app.use(express.static(DIST_DIR))

// Qualquer rota que não seja /api/* nem /admin/api/* e não bata em arquivo
// estático cai no index.html (roteamento do React Router — cobre tanto o
// site quanto as telas do painel /admin).
app.get(/^(?!\/api\/)(?!\/admin\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

runMigrations()
  .catch((err) => console.error('[migracao] falhou:', err.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`DSM (site + licenças) rodando em http://localhost:${PORT}`)
    })
  })
