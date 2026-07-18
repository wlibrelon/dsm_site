// Ferramenta de linha de comando — só o Warlen roda, depois de confirmar um
// pagamento manualmente (fora do sistema). Gera uma chave de ativação de
// licença anual (365 dias), que o professor cola no DSM em "Já tenho uma
// licença". A chave não tem máquina nem data ainda — isso só é gravado
// quando o professor resgata (POST /api/licencas/resgatar), pra o ano
// começar a contar da ativação, não da emissão.
//
// Uso: node api/emitirLicenca.js --nome "Fulano de Tal" --email fulano@escola.com.br
import 'dotenv/config'
import crypto from 'node:crypto'
import { query, pool } from './db.js'
import { buscarOuCriarProfessor } from './rotas.js'

function lerArgumentos() {
  const args = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      const chave = argv[i].slice(2)
      const valor = argv[i + 1]
      args[chave] = valor
      i += 1
    }
  }
  return args
}

async function main() {
  const { nome, email } = lerArgumentos()
  if (!nome?.trim() || !email?.trim()) {
    console.error('Uso: node api/emitirLicenca.js --nome "Fulano de Tal" --email fulano@escola.com.br')
    process.exitCode = 1
    return
  }

  const professor = await buscarOuCriarProfessor(nome.trim(), email.trim().toLowerCase())
  const token = crypto.randomBytes(12).toString('hex')

  const [resultado] = await query(
    `INSERT INTO licencas (professor_id, tipo, token_resgate, status) VALUES (?, 'assinante', ?, 'pendente')`,
    [professor.id, token],
  )

  const chave = `${resultado.insertId}.${token}`

  console.log('\n=== Licença anual emitida ===\n')
  console.log(`Professor: ${professor.nome} <${professor.email}>`)
  console.log(`\nChave de ativação (envie para o professor colar no DSM, em "Já tenho uma licença"):\n`)
  console.log(chave)
  console.log(
    '\nO ano de validade só começa a contar quando o professor ativar essa chave no computador dele.\n',
  )
}

main()
  .catch((err) => {
    console.error('Erro ao emitir licença:', err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
