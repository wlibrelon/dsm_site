import { ImageOff, Zap } from 'lucide-react'

export function Problem() {
  return (
    <section id="o-que-e" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Fim das Aulas Estáticas</h2>
          <p className="text-lg text-muted-foreground">
            Apresentações tradicionais mostram resultados fixos, limitando a curiosidade dos alunos.
            O DSM transforma sua aula em um laboratório vivo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Static Slide */}
          <div className="rounded-2xl border bg-slate-50 p-8 flex flex-col h-full opacity-80 grayscale-[20%] transition-all hover:grayscale-0">
            <div className="flex items-center gap-3 mb-6 text-slate-500">
              <ImageOff className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Slide Comum (Estático)</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-white p-8">
              <img
                src="https://img.usecurling.com/p/400/200?q=math%20formula"
                alt="Fórmula estática"
                className="rounded shadow-sm mb-4"
              />
              <p className="text-sm text-slate-400 text-center font-mono">
                "Professor, e se a vazão fosse 150 em vez de 100?"
                <br />— "Ah, eu teria que recalcular em casa."
              </p>
            </div>
          </div>

          {/* Dynamic Slide */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col h-full shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-6 text-primary relative z-10">
              <Zap className="h-6 w-6" fill="currentColor" />
              <h3 className="text-xl font-semibold">Slide DSM (Dinâmico)</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-primary/20 rounded-lg bg-white p-8 relative z-10 shadow-sm">
              <div className="w-full max-w-[200px] mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Alterar Vazão
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 flex-1 bg-slate-100 rounded border border-slate-200 flex items-center px-3 font-mono text-sm text-slate-700">
                    150.00
                  </div>
                  <div className="h-8 w-8 bg-accent rounded flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-primary font-medium text-center">
                O gráfico, a tabela e a conclusão se atualizam imediatamente para a turma inteira.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
