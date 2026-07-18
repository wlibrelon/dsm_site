import {
  Code2,
  PenTool,
  BarChart3,
  FileInput,
  Download,
  FolderTree,
  FileText,
  Copy,
} from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: PenTool,
      title: 'Sem Barreira de Código',
      desc: 'Configure entradas e saídas visualmente, ou descreva o cálculo em português para a IA escrever o script. Você não precisa programar.',
    },
    {
      icon: Code2,
      title: 'Motor de Cálculo Real',
      desc: 'Por trás de cada slide roda Python de verdade — do mais simples ao mais avançado (com NumPy, SciPy e Pandas, para quem já conhece essas bibliotecas).',
    },
    {
      icon: BarChart3,
      title: 'Resultados Diversos',
      desc: 'Gere gráficos de linha, barras, dispersão, mapas e tabelas dinâmicas renderizadas instantaneamente.',
    },
    {
      icon: FileInput,
      title: 'Entrada Flexível',
      desc: 'Digite valores manualmente durante a aula ou importe bases CSV/Excel em tempo real.',
    },
    {
      icon: Download,
      title: 'Histórico e Exportação',
      desc: 'Salve o estado das simulações feitas em sala e exporte os dados para estudo posterior.',
    },
    {
      icon: FolderTree,
      title: 'Organização Institucional',
      desc: 'Estruturação clara: Instituição > Curso > Disciplina > Aula, facilitando a gestão.',
    },
    {
      icon: FileText,
      title: 'Importação de PPT/PDF',
      desc: 'Não comece do zero. Importe seus slides atuais e adicione camadas interativas por cima.',
    },
    {
      icon: Copy,
      title: 'Modelos Reutilizáveis',
      desc: 'Crie componentes matemáticos uma vez e reutilize-os em diferentes semestres e turmas.',
    },
  ]

  return (
    <section id="recursos" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-slate-900">
            Recursos Educacionais
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl">
            Ferramentas construídas especificamente para o rigor e as necessidades de professores de
            todos os níveis de ensino, em qualquer disciplina.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {features.map((feat, i) => (
            <div key={i} className="group">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <feat.icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">{feat.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
