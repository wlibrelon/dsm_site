import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { adminApi } from '@/lib/adminApi'
import { Loader2 } from 'lucide-react'

/** Protege rotas /admin: exige sessão válida (cookie httpOnly verificado via GET /admin/api/me). */
export default function AdminGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'carregando' | 'autenticado' | 'negado'>('carregando')

  useEffect(() => {
    adminApi
      .me()
      .then(() => setStatus('autenticado'))
      .catch(() => setStatus('negado'))
  }, [])

  if (status === 'carregando') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (status === 'negado') {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
