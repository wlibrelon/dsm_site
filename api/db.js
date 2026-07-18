// Conexão MySQL do servidor de licenças. Só é usada pelas rotas em api/ —
// o resto do site continua estático, sem depender de banco nenhum.
import 'dotenv/config'
import mysql from 'mysql2/promise'

// Log de diagnóstico temporário — não imprime a senha real, só o tamanho e
// os 2 primeiros caracteres de cada variável, pra confirmar que o que chegou
// no processo é exatamente o que foi configurado no painel. Remover depois
// de resolver o problema de conexão.
const mascarar = (v) => (v ? `"${v.slice(0, 2)}...${v.slice(-1)}" (len=${v.length})` : '(vazio/undefined)')
console.log('[db] DB_HOST =', mascarar(process.env.DB_HOST))
console.log('[db] DB_PORT =', mascarar(process.env.DB_PORT))
console.log('[db] DB_USER =', mascarar(process.env.DB_USER))
console.log('[db] DB_PASSWORD =', mascarar(process.env.DB_PASSWORD))
console.log('[db] DB_NAME =', mascarar(process.env.DB_NAME))

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dsm_licencas',
  waitForConnections: true,
  connectionLimit: 5,
  dateStrings: true,
})

export const query = (sql, params) => pool.query(sql, params)
