import { GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const DISCIPLINAS = [
  'Matemática',
  'Física',
  'Estatística',
  'Economia',
  'Engenharia',
  'Geografia',
  'Biologia',
  'Administração',
]

export function Audience() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="border-none shadow-elevation overflow-hidden max-w-3xl mx-auto">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-8 md:p-10">
            <GraduationCap className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">
              Para professores de todos os níveis, em qualquer disciplina
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Altamente eficaz para áreas quantitativas e científicas, mas benéfico para qualquer
              docente que utilize fórmulas, dados ou gráficos em aula — do ensino médio à
              pós-graduação. O DSM roda direto no seu computador, sem depender de servidor da
              escola.
            </p>
            <ul className="space-y-4 text-muted-foreground mb-8">
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
            <div className="flex flex-wrap gap-2">
              {DISCIPLINAS.map((d) => (
                <span
                  key={d}
                  className="text-xs font-medium text-primary bg-primary/5 border border-primary/10 rounded-full px-3 py-1"
                >
                  {d}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
