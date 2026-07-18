export interface Licenca {
  id: number
  tipo: 'trial' | 'assinante'
  machine_id: string | null
  data_inicio: string | null
  data_expiracao: string | null
  status: 'pendente' | 'ativa' | 'revogada'
  estado: 'pendente' | 'ativa' | 'revogada' | 'expirada'
  criado_em: string
  ultimo_checkin: string | null
  professor_nome: string
  professor_email: string
}

export interface Resumo {
  total_professores: number
  trials_ativos: number
  assinantes_ativos: number
  pendentes: number
}

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  })
  if (!res.ok) {
    let msg = `Erro ${res.status}`
    try {
      const body = await res.json()
      if (body?.erro) msg = body.erro
    } catch {
      /* resposta sem corpo json */
    }
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const adminApi = {
  login: (email: string, senha: string) =>
    http<{ email: string }>('/admin/api/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  logout: () => http<void>('/admin/api/logout', { method: 'POST' }),
  me: () => http<{ email: string }>('/admin/api/me'),
  trocarSenha: (senhaAtual: string, senhaNova: string) =>
    http<void>('/admin/api/senha', {
      method: 'PUT',
      body: JSON.stringify({ senha_atual: senhaAtual, senha_nova: senhaNova }),
    }),
  getLicencas: () => http<Licenca[]>('/admin/api/licencas'),
  getResumo: () => http<Resumo>('/admin/api/resumo'),
  revogarLicenca: (id: number) => http<void>(`/admin/api/licencas/${id}/revogar`, { method: 'POST' }),
}
