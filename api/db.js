// Conexão MySQL do servidor de licenças. Só é usada pelas rotas em api/ —
// o resto do site continua estático, sem depender de banco nenhum.
import 'dotenv/config'
import mysql from 'mysql2/promise'

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
