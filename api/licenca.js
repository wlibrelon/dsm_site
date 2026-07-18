// Assinatura/verificação do certificado de licença (Ed25519). A chave
// privada só existe aqui — o DSM (cliente) recebe só a pública, embutida no
// código dele, e nunca consegue forjar um certificado válido.
//
// IMPORTANTE: a ordem dos campos abaixo (CAMPOS_CERTIFICADO) precisa ser
// idêntica à usada no DSM (backend/src/licenca.js) para verificar a
// assinatura — a canonicalização é simplesmente "monta um objeto nessa
// ordem exata e faz JSON.stringify".
import crypto from 'node:crypto'

export const CAMPOS_CERTIFICADO = [
  'versao',
  'tipo',
  'licenca_id',
  'professor_nome',
  'professor_email',
  'machine_id',
  'data_inicio',
  'data_expiracao',
  'emitido_em',
]

export function canonicalizarCertificado(dados) {
  const ordenado = {}
  for (const campo of CAMPOS_CERTIFICADO) ordenado[campo] = dados[campo] ?? null
  return JSON.stringify(ordenado)
}

function chavePrivadaDoEnv() {
  const b64 = process.env.LICENCA_CHAVE_PRIVADA_B64
  if (!b64) throw new Error('LICENCA_CHAVE_PRIVADA_B64 não configurada no .env do servidor.')
  const pem = Buffer.from(b64, 'base64').toString('utf-8')
  return crypto.createPrivateKey(pem)
}

/**
 * Monta e assina um certificado. `dados` deve conter tipo, licenca_id,
 * professor_nome, professor_email, machine_id, data_inicio, data_expiracao
 * (datas no formato 'YYYY-MM-DD'). `versao` e `emitido_em` são preenchidos
 * aqui.
 */
export function assinarCertificado(dados) {
  const certificado = {
    versao: 1,
    emitido_em: new Date().toISOString(),
    ...dados,
  }
  const texto = canonicalizarCertificado(certificado)
  const assinatura = crypto.sign(null, Buffer.from(texto, 'utf-8'), chavePrivadaDoEnv()).toString('base64')
  return { certificado, assinatura }
}

/** Empacota {certificado, assinatura} numa única string base64 — é a "chave" que o professor cola no DSM. */
export function empacotarChave(certificado, assinatura) {
  const json = JSON.stringify({ certificado, assinatura })
  return Buffer.from(json, 'utf-8').toString('base64')
}
