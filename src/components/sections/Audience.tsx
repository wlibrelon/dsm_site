import { GraduationCap, Building } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Audience() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-none shadow-elevation overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardContent className="p-8">
              <GraduationCap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-bold font-serif mb-4">
                Para Professores de Todos os Níveis
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Altamente eficaz para áreas quantitativas e científicas, mas benéfico para qualquer
                docente que utilize fórmulas, dados ou gráficos em aula.
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  Engajamento garantido com alunos testando hipóteses na hora.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  Rigor científico mantido com o uso real de bibliotecas Python.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  Fim do retrabalho criando simulações isoladas em outras ferramentas.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-elevation overflow-hidden">
            <div className="h-2 bg-accent w-full" />
            <CardContent className="p-8">
              <Building className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-bold font-serif mb-4">Para Coordenadores</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  Padronização da qualidade do material didático entre turmas.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  Métricas de uso e repositório centralizado de aulas dinâmicas.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  Diferencial tecnológico para atrair e reter alunos na instituição.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
