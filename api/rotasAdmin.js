// Painel administrativo: login + monitoramento das licenças emitidas.
// Tudo sob /admin/api, protegido por exigirAdmin (exceto /login).
import crypto from 'node:crypto'
import express from 'express'
import { query } from './db.js'
import { autenticar, gerarToken, definirCookieSessao, limparCookieSessao, exigirAdmin, trocarSenha } from './adminAuth.js'
import { buscarOuCriarProfessor } from './rotas.js'

export const rotasAdmin = express.Router()

rotasAdmin.post('/login', express.json(), async (req, res) => {
  const { email, senha } = req.body || {}
  if (!email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' })
  }
  try {
    const usuario = await autenticar(email, senha)
    if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    const token = gerarToken(usuario)
    definirCookieSessao(res, token)
    res.json({ email: usuario.email })
  } catch (err) {
    console.error('[admin/login]', err)
    res.status(500).json({ erro: 'Erro interno ao entrar.' })
  }
})

rotasAdmin.post('/logout', (_req, res) => {
  limparCookieSessao(res)
  res.status(204).end()
})

rotasAdmin.get('/me', exigirAdmin, (req, res) => {
  res.json({ email: req.admin.email })
})

rotasAdmin.put('/senha', express.json(), exigirAdmin, async (req, res) => {
  const { senha_atual: senhaAtual, senha_nova: senhaNova } = req.body || {}
  if (!senhaAtual || !senhaNova) {
    return res.status(400).json({ erro: 'Informe a senha atual e a nova senha.' })
  }
  try {
    await trocarSenha(req.admin.id, senhaAtual, senhaNova)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ erro: err.message || 'Não foi possível trocar a senha.' })
  }
})

// Lista todas as licenças com os dados do professor e um status calculado
// (o mesmo cálculo do DSM: comparação de datas — aqui é só leitura/relatório,
// não valida certificado nenhum).
rotasAdmin.get('/licencas', exigirAdmin, async (_req, res) => {
  try {
    const [linhas] = await query(
      `SELECT l.id, l.tipo, l.machine_id, l.data_inicio, l.data_expiracao, l.status,
              l.criado_em, l.ultimo_checkin,
              p.nome AS professor_nome, p.email AS professor_email
       FROM licencas l
       JOIN professores p ON p.id = l.professor_id
       ORDER BY l.criado_em DESC`,
    )
    const hoje = new Date().toISOString().slice(0, 10)
    const comEstado = linhas.map((l) => {
      let estado = l.status
      if (l.status === 'ativa' && l.data_expiracao && l.data_expiracao < hoje) {
        estado = 'expirada'
      } else if (l.status === 'pendente') {
        estado = 'pendente'
      }
      return { ...l, estado }
    })
    res.json(comEstado)
  } catch (err) {
    console.error('[admin/licencas]', err)
    res.status(500).json({ erro: 'Erro interno ao listar licenças.' })
  }
})

// Emissão manual de uma licença anual paga — equivalente ao script de linha
// de comando api/emitirLicenca.js, só que rodando aqui dentro (mesmo banco
// que o servidor de produção já usa, sem precisar de acesso via SSH/terminal
// separado). A chave não tem máquina nem data ainda; isso só é gravado
// quando o professor resgata (POST /api/licencas/resgatar).
rotasAdmin.post('/licencas/emitir', express.json(), exigirAdmin, async (req, res) => {
  const { nome, email } = req.body || {}
  if (!nome?.trim() || !email?.trim()) {
    return res.status(400).json({ erro: 'Informe nome e e-mail do professor.' })
  }
  try {
    const professor = await buscarOuCriarProfessor(nome.trim(), email.trim().toLowerCase())
    const token = crypto.randomBytes(12).toString('hex')

    const [resultado] = await query(
      `INSERT INTO licencas (professor_id, tipo, token_resgate, status) VALUES (?, 'assinante', ?, 'pendente')`,
      [professor.id, token],
    )

    const chave = `${resultado.insertId}.${token}`
    res.status(201).json({ chave, professor_nome: professor.nome, professor_email: professor.email })
  } catch (err) {
    console.error('[admin/emitir]', err)
    res.status(500).json({ erro: 'Erro interno ao emitir a chave.' })
  }
})

rotasAdmin.post('/licencas/:id/revogar', exigirAdmin, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ erro: 'ID inválido.' })
  try {
    await query(`UPDATE licencas SET status = 'revogada' WHERE id = ?`, [id])
    res.status(204).end()
  } catch (err) {
    console.error('[admin/revogar]', err)
    res.status(500).json({ erro: 'Erro interno ao revogar a licença.' })
  }
})

// Resumo rápido pro topo do dashboard.
rotasAdmin.get('/resumo', exigirAdmin, async (_req, res) => {
  try {
    const [[{ total_professores }]] = await query('SELECT COUNT(*) AS total_professores FROM professores')
    const [[{ trials_ativos }]] = await query(
      `SELECT COUNT(*) AS trials_ativos FROM licencas WHERE tipo = 'trial' AND status = 'ativa' AND data_expiracao >= CURDATE()`,
    )
    const [[{ assinantes_ativos }]] = await query(
      `SELECT COUNT(*) AS assinantes_ativos FROM licencas WHERE tipo = 'assinante' AND status = 'ativa' AND data_expiracao >= CURDATE()`,
    )
    const [[{ pendentes }]] = await query(`SELECT COUNT(*) AS pendentes FROM licencas WHERE status = 'pendente'`)
    res.json({ total_professores, trials_ativos, assinantes_ativos, pendentes })
  } catch (err) {
    console.error('[admin/resumo]', err)
    res.status(500).json({ erro: 'Erro interno ao carregar o resumo.' })
  }
})
