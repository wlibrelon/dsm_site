// Runner de migrações do servidor de licenças (MySQL) — mesmo espírito do
// backend/src/migrate.js do DSM: arquivos numerados em api/migrations/,
// aplicados uma vez, registrados em schema_version.
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = path.join(__dirname, 'migrations')

export async function runMigrations() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dsm_licencas',
    multipleStatements: true,
  })

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schema_version (
        versao      INT PRIMARY KEY,
        aplicado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

    const [rows] = await conn.query('SELECT versao FROM schema_version')
    const aplicadas = new Set(rows.map((r) => r.versao))

    const arquivos = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => /^\d+_.*\.sql$/.test(f))
      .sort((a, b) => parseInt(a) - parseInt(b))

    for (const arquivo of arquivos) {
      const versao = parseInt(arquivo)
      if (aplicadas.has(versao)) continue

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, arquivo), 'utf-8')
      await conn.query('START TRANSACTION')
      try {
        await conn.query(sql)
        await conn.query('INSERT INTO schema_version (versao) VALUES (?)', [versao])
        await conn.query('COMMIT')
        console.log(`[migracao] V${versao} aplicada (${arquivo})`)
      } catch (err) {
        await conn.query('ROLLBACK')
        console.error(`[migracao] ERRO na V${versao} (${arquivo}):`, err.message)
        throw err
      }
    }
  } finally {
    await conn.end()
  }
}

// Permite rodar direto: node api/migrate.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('[migracao] banco atualizado.')
      process.exit(0)
    })
    .catch(() => process.exit(1))
}
