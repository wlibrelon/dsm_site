import { Layout as LayoutIcon, Settings, Bot, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Process() {
  const steps = [
    {
      icon: LayoutIcon,
      title: '1. Montagem Visual',
      description: 'Crie slides usando um editor familiar com textos, imagens e formas.',
    },
    {
      icon: Settings,
      title: '2. Configuração',
      description: 'Defina quais campos numéricos serão interativos (inputs) no slide.',
    },
    {
      icon: Bot,
      title: '3. Assistente de IA',
      description: 'Descreva a lógica em português e a IA gera o código Python por trás.',
    },
    {
      icon: Play,
      title: '4. Execução ao Vivo',
      description: 'Apresente, digite novos dados e veja os resultados atualizarem na hora.',
    },
  ]

  return (
    <section id="como-funciona" className="py-20 bg-slate-50 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simples para quem cria, poderoso para quem assiste
          </h2>
          <p className="text-lg text-muted-foreground">
            O fluxo de trabalho do DSM foi desenhado para não exigir conhecimentos avançados de
            programação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0" />

          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative z-10 border-none shadow-elevation bg-white/80 backdrop-blur"
            >
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2 font-serif">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
