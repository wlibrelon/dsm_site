// Roda uma única vez pra gerar o par de chaves Ed25519 do servidor de
// licenças. Uso: node api/gerarChaves.js
//
// A saída "CHAVE PRIVADA" vai pro .env do servidor (LICENCA_CHAVE_PRIVADA_B64)
// — nunca versionar, nunca sair daqui. A "CHAVE PÚBLICA" vai embutida no
// código do DSM (backend/src/licenca.js), pra ele conseguir conferir a
// assinatura sem nunca ter acesso à privada.
import crypto from 'node:crypto'

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const privadaB64 = Buffer.from(privateKey, 'utf-8').toString('base64')
const publicaB64 = Buffer.from(publicKey, 'utf-8').toString('base64')

console.log('\n=== Par de chaves gerado ===\n')
console.log('1) Cole isso no .env do servidor de licenças (NUNCA versionar, NUNCA compartilhar):\n')
console.log(`LICENCA_CHAVE_PRIVADA_B64=${privadaB64}\n`)
console.log('2) Cole isso no DSM (backend/src/licenca.js), na constante CHAVE_PUBLICA_B64:\n')
console.log(`${publicaB64}\n`)
console.log('=== Fim ===\n')
