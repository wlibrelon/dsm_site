// Autenticação do painel administrativo (monitoramento de licenças).
// Simples de propósito: bcrypt pra senha, um JWT assinado guardado num
// cookie httpOnly como sessão. Sem OAuth, sem 2FA, sem dependências pesadas
// — dá pra evoluir depois se precisar.
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './db.js'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET
const COOKIE_NOME = 'dsm_admin_sessao'
const SESSAO_DIAS = 7

function segredoOuFalha() {
  if (!JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET não configurada no .env do servidor.')
  }
  return JWT_SECRET
}

export async function autenticar(email, senha) {
  const [linhas] = await query('SELECT id, email, senha_hash FROM usuarios_admin WHERE email = ?', [
    email.trim().toLowerCase(),
  ])
  const usuario = linhas[0]
  // Mesma mensagem de erro exista ou não o e-mail — não dá pista de quais
  // e-mails têm cadastro.
  if (!usuario) return null
  const ok = await bcrypt.compare(senha, usuario.senha_hash)
  if (!ok) return null
  return { id: usuario.id, email: usuario.email }
}

export function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.id, email: usuario.email }, segredoOuFalha(), {
    expiresIn: `${SESSAO_DIAS}d`,
  })
}

export function definirCookieSessao(res, token) {
  res.cookie(COOKIE_NOME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SESSAO_DIAS * 24 * 60 * 60 * 1000,
    path: '/admin/api',
  })
}

export function limparCookieSessao(res) {
  res.clearCookie(COOKIE_NOME, { path: '/admin/api' })
}

/** Middleware: exige sessão válida (cookie com JWT assinado). */
export function exigirAdmin(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NOME]
    if (!token) return res.status(401).json({ erro: 'Não autenticado.' })
    const dados = jwt.verify(token, segredoOuFalha())
    req.admin = { id: dados.sub, email: dados.email }
    next()
  } catch {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada.' })
  }
}

export async function trocarSenha(usuarioId, senhaAtual, senhaNova) {
  const [linhas] = await query('SELECT senha_hash FROM usuarios_admin WHERE id = ?', [usuarioId])
  const usuario = linhas[0]
  if (!usuario) throw new Error('Usuário não encontrado.')
  const ok = await bcrypt.compare(senhaAtual, usuario.senha_hash)
  if (!ok) throw new Error('Senha atual incorreta.')
  if (!senhaNova || senhaNova.length < 8) {
    throw new Error('A nova senha precisa ter pelo menos 8 caracteres.')
  }
  const novoHash = await bcrypt.hash(senhaNova, 10)
  await query('UPDATE usuarios_admin SET senha_hash = ? WHERE id = ?', [novoHash, usuarioId])
}
