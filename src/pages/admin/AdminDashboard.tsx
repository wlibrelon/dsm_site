import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, type Licenca, type Resumo } from '@/lib/adminApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, LogOut, KeyRound, X } from 'lucide-react'

const ESTADO_LABEL: Record<Licenca['estado'], { texto: string; variante: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ativa: { texto: 'Ativa', variante: 'default' },
  expirada: { texto: 'Expirada', variante: 'secondary' },
  revogada: { texto: 'Revogada', variante: 'destructive' },
  pendente: { texto: 'Pendente (não resgatada)', variante: 'outline' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [licencas, setLicencas] = useState<Licenca[] | null>(null)
  const [email, setEmail] = useState('')

  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativa' | 'inativa'>('todos')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | Licenca['tipo']>('todos')
  const [expiraDe, setExpiraDe] = useState('')
  const [expiraAte, setExpiraAte] = useState('')

  const filtrosAtivos =
    filtroStatus !== 'todos' || filtroTipo !== 'todos' || !!expiraDe || !!expiraAte

  const limparFiltros = () => {
    setFiltroStatus('todos')
    setFiltroTipo('todos')
    setExpiraDe('')
    setExpiraAte('')
  }

  const licencasFiltradas = useMemo(() => {
    if (!licencas) return null
    return licencas.filter((l) => {
      if (filtroStatus === 'ativa' && l.estado !== 'ativa') return false
      if (filtroStatus === 'inativa' && l.estado === 'ativa') return false
      if (filtroTipo !== 'todos' && l.tipo !== filtroTipo) return false
      if (expiraDe && (!l.data_expiracao || l.data_expiracao < expiraDe)) return false
      if (expiraAte && (!l.data_expiracao || l.data_expiracao > expiraAte)) return false
      return true
    })
  }, [licencas, filtroStatus, filtroTipo, expiraDe, expiraAte])

  const carregar = () => {
    adminApi.getResumo().then(setResumo)
    adminApi.getLicencas().then(setLicencas)
    adminApi.me().then((r) => setEmail(r.email))
  }

  useEffect(() => {
    carregar()
  }, [])

  const sair = async () => {
    await adminApi.logout()
    navigate('/admin/login', { replace: true })
  }

  const revogar = async (id: number) => {
    try {
      await adminApi.revogarLicenca(id)
      toast({ title: 'Licença revogada.' })
      carregar()
    } catch (err: any) {
      toast({ title: 'Erro ao revogar', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Licenças — Dynamic Slide Maker</h1>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <TrocarSenhaDialog />
            <Button variant="outline" size="sm" onClick={sair}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {resumo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CardResumo titulo="Professores cadastrados" valor={resumo.total_professores} />
            <CardResumo titulo="Trials ativos" valor={resumo.trials_ativos} />
            <CardResumo titulo="Assinantes ativos" valor={resumo.assinantes_ativos} />
            <CardResumo titulo="Chaves pendentes" valor={resumo.pendentes} />
          </div>
        )}

        <Card>
          <CardContent className="pt-6 flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Status</Label>
              <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as typeof filtroStatus)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativa">Ativos</SelectItem>
                  <SelectItem value="inativa">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Tipo</Label>
              <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as typeof filtroTipo)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="assinante">Assinante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Expira de</Label>
              <Input
                type="date"
                value={expiraDe}
                onChange={(e) => setExpiraDe(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Expira até</Label>
              <Input
                type="date"
                value={expiraAte}
                onChange={(e) => setExpiraAte(e.target.value)}
                className="w-40"
              />
            </div>

            {filtrosAtivos && (
              <Button variant="ghost" size="sm" onClick={limparFiltros} className="text-slate-500">
                <X className="w-4 h-4 mr-1" />
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Licenças emitidas
              {licencasFiltradas && licencas && licencasFiltradas.length !== licencas.length && (
                <span className="text-sm font-normal text-slate-500">
                  {' '}
                  ({licencasFiltradas.length} de {licencas.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!licencasFiltradas ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : licencasFiltradas.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">
                {licencas?.length ? 'Nenhuma licença corresponde a esses filtros.' : 'Nenhuma licença emitida ainda.'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead>Último check-in</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licencasFiltradas.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="font-medium">{l.professor_nome}</div>
                        <div className="text-xs text-slate-500">{l.professor_email}</div>
                      </TableCell>
                      <TableCell className="capitalize">{l.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={ESTADO_LABEL[l.estado].variante}>{ESTADO_LABEL[l.estado].texto}</Badge>
                      </TableCell>
                      <TableCell>{l.data_inicio || '—'}</TableCell>
                      <TableCell>{l.data_expiracao || '—'}</TableCell>
                      <TableCell>{l.ultimo_checkin ? new Date(l.ultimo_checkin).toLocaleString('pt-BR') : '—'}</TableCell>
                      <TableCell className="text-right">
                        {l.estado !== 'revogada' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Revogar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revogar esta licença?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {l.professor_nome} perde o acesso no próximo check-in (ou imediatamente, se
                                  ele estiver online). Essa ação não tem volta automática.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => revogar(l.id)}>Revogar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CardResumo({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold text-slate-800">{valor}</div>
        <div className="text-xs text-slate-500">{titulo}</div>
      </CardContent>
    </Card>
  )
}

function TrocarSenhaDialog() {
  const { toast } = useToast()
  const [aberto, setAberto] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await adminApi.trocarSenha(senhaAtual, senhaNova)
      toast({ title: 'Senha alterada com sucesso.' })
      setSenhaAtual('')
      setSenhaNova('')
      setAberto(false)
    } catch (err: any) {
      toast({ title: 'Não foi possível trocar a senha', description: err.message, variant: 'destructive' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound className="w-4 h-4 mr-2" />
          Trocar senha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar senha</DialogTitle>
        </DialogHeader>
        <form onSubmit={enviar} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="senha-atual">Senha atual</Label>
            <Input
              id="senha-atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="senha-nova">Senha nova (mínimo 8 caracteres)</Label>
            <Input
              id="senha-nova"
              type="password"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={enviando}>
            {enviando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar nova senha
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
