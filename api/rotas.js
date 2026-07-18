import express from 'express'
import { query } from './db.js'
import { assinarCertificado } from './licenca.js'

export const rotasLicenca = express.Router()

const DIAS_TRIAL = 30
const DIAS_ASSINATURA = 365

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function somarDias(dataISO, dias) {
  const d = new Date(`${dataISO}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

export async function buscarOuCriarProfessor(nome, email) {
  const [existentes] = await query('SELECT id, nome, email FROM professores WHERE email = ?', [email])
  if (existentes[0]) {
    if (existentes[0].nome !== nome) {
      await query('UPDATE professores SET nome = ? WHERE id = ?', [nome, existentes[0].id])
    }
    return { id: existentes[0].id, nome, email }
  }
  const [resultado] = await query('INSERT INTO professores (nome, email) VALUES (?, ?)', [nome, email])
  return { id: resultado.insertId, nome, email }
}

rotasLicenca.post('/ativar-trial', express.json(), async (req, res) => {
  const { nome, email, machine_id: machineId } = req.body || {}
  if (!nome?.trim() || !email?.trim() || !machineId?.trim()) {
    return res.status(400).json({ erro: 'Informe nome, e-mail e identificador da máquina.' })
  }
  if (!REGEX_EMAIL.test(email.trim())) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  try {
    const professor = await buscarOuCriarProfessor(nome.trim(), email.trim().toLowerCase())

    const [usados] = await query(
      `SELECT id FROM licencas WHERE tipo = 'trial' AND (professor_id = ? OR machine_id = ?) LIMIT 1`,
      [professor.id, machineId.trim()],
    )
    if (usados[0]) {
      return res.status(409).json({
        erro: 'Este e-mail ou esta máquina já usou o período de teste gratuito.',
      })
    }

    const dataInicio = hojeISO()
    const dataExpiracao = somarDias(dataInicio, DIAS_TRIAL)

    const [resultado] = await query(
      `INSERT INTO licencas (professor_id, tipo, machine_id, data_inicio, data_expiracao, status)
       VALUES (?, 'trial', ?, ?, ?, 'ativa')`,
      [professor.id, machineId.trim(), dataInicio, dataExpiracao],
    )

    const { certificado, assinatura } = assinarCertificado({
      tipo: 'trial',
      licenca_id: resultado.insertId,
      professor_nome: professor.nome,
      professor_email: professor.email,
      machine_id: machineId.trim(),
      data_inicio: dataInicio,
      data_expiracao: dataExpiracao,
    })

    res.status(201).json({ certificado, assinatura })
  } catch (err) {
    console.error('[ativar-trial]', err)
    res.status(500).json({ erro: 'Erro interno ao ativar o teste gratuito.' })
  }
})

rotasLicenca.post('/checkin', express.json(), async (req, res) => {
  const { licenca_id: licencaId, machine_id: machineId } = req.body || {}
  if (!licencaId || !machineId?.trim()) {
    return res.status(400).json({ erro: 'Informe licenca_id e machine_id.' })
  }

  try {
    const [linhas] = await query(
      `SELECT l.id, l.tipo, l.machine_id, l.data_inicio, l.data_expiracao, l.status,
              p.nome AS professor_nome, p.email AS professor_email
       FROM licencas l JOIN professores p ON p.id = l.professor_id
       WHERE l.id = ?`,
      [licencaId],
    )
    const licenca = linhas[0]
    if (!licenca) return res.status(404).json({ valida: false, motivo: 'nao_encontrada' })

    if (licenca.machine_id !== machineId.trim()) {
      return res.json({ valida: false, motivo: 'maquina_diferente' })
    }
    if (licenca.status === 'revogada') {
      return res.json({ valida: false, motivo: 'revogada' })
    }

    await query('UPDATE licencas SET ultimo_checkin = NOW() WHERE id = ?', [licenca.id])

    const { certificado, assinatura } = assinarCertificado({
      tipo: licenca.tipo,
      licenca_id: licenca.id,
      professor_nome: licenca.professor_nome,
      professor_email: licenca.professor_email,
      machine_id: licenca.machine_id,
      data_inicio: licenca.data_inicio,
      data_expiracao: licenca.data_expiracao,
    })

    res.json({ valida: true, certificado, assinatura })
  } catch (err) {
    console.error('[checkin]', err)
    res.status(500).json({ erro: 'Erro interno no check-in.' })
  }
})

// Resgate de uma licença paga: a chave (emitida por api/emitirLicenca.js)
// não tem máquina nem datas ainda — o ano de validade só começa a contar
// aqui, na primeira vez que o professor ativa no próprio computador. Uma
// chave só pode ser resgatada uma vez (trava por machine_id já preenchido).
rotasLicenca.post('/resgatar', express.json(), async (req, res) => {
  const { chave, machine_id: machineId } = req.body || {}
  if (!chave?.trim() || !machineId?.trim()) {
    return res.status(400).json({ erro: 'Informe a chave de ativação e o identificador da máquina.' })
  }
  const [licencaIdStr, token] = chave.trim().split('.')
  const licencaId = Number(licencaIdStr)
  if (!licencaId || !token) {
    return res.status(400).json({ erro: 'Chave de ativação inválida.' })
  }

  try {
    const [linhas] = await query(
      `SELECT l.id, l.tipo, l.token_resgate, l.machine_id, l.status,
              p.nome AS professor_nome, p.email AS professor_email
       FROM licencas l JOIN professores p ON p.id = l.professor_id
       WHERE l.id = ?`,
      [licencaId],
    )
    const licenca = linhas[0]
    if (!licenca || licenca.token_resgate !== token) {
      return res.status(404).json({ erro: 'Chave de ativação não encontrada ou inválida.' })
    }
    if (licenca.status === 'revogada') {
      return res.status(403).json({ erro: 'Esta licença foi revogada.' })
    }
    if (licenca.machine_id) {
      return res.status(409).json({ erro: 'Esta chave já foi ativada em outra instalação.' })
    }

    const dataInicio = hojeISO()
    const dataExpiracao = somarDias(dataInicio, DIAS_ASSINATURA)

    await query(
      `UPDATE licencas SET machine_id = ?, data_inicio = ?, data_expiracao = ?, status = 'ativa', ultimo_checkin = NOW()
       WHERE id = ?`,
      [machineId.trim(), dataInicio, dataExpiracao, licenca.id],
    )

    const { certificado, assinatura } = assinarCertificado({
      tipo: licenca.tipo,
      licenca_id: licenca.id,
      professor_nome: licenca.professor_nome,
      professor_email: licenca.professor_email,
      machine_id: machineId.trim(),
      data_inicio: dataInicio,
      data_expiracao: dataExpiracao,
    })

    res.json({ certificado, assinatura })
  } catch (err) {
    console.error('[resgatar]', err)
    res.status(500).json({ erro: 'Erro interno ao resgatar a chave.' })
  }
})
