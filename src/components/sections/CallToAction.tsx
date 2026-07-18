import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

// E-mail que recebe as solicitações de demonstração.
// O FormSubmit envia um e-mail de confirmação para este endereço na primeira submissão;
// é preciso clicar no link de confirmação para ativar o recebimento.
const LEAD_EMAIL = 'contato@dynamicslidemaker.com.br'

export function CallToAction() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('_subject', 'Nova solicitação de demonstração - DSM')
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) throw new Error('Falha no envio')

      toast({
        title: 'Solicitação enviada com sucesso!',
        description: 'Nossa equipe entrará em contato em breve.',
      })
      form.reset()
    } catch {
      toast({
        title: 'Não foi possível enviar sua solicitação',
        description: 'Tente novamente em instantes ou entre em contato por e-mail.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="solicitar-acesso"
      className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/400?q=abstract%20math&color=blue')] opacity-10 bg-cover bg-center" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
              Leve o dinamismo do DSM para sua instituição.
            </h2>
            <p className="text-slate-500 mb-6 text-lg">
              Solicite uma demonstração gratuita e veja como podemos transformar a experiência em
              sala de aula.
            </p>
          </div>

          <div className="w-full md:w-[400px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="Nome"
                  required
                  placeholder="Prof. João Silva"
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-slate-700">
                  Instituição de Ensino
                </Label>
                <Input
                  id="institution"
                  name="Instituição"
                  required
                  placeholder="Universidade XYZ"
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  E-mail Institucional
                </Label>
                <Input
                  id="email"
                  name="E-mail"
                  type="email"
                  required
                  placeholder="joao@instituicao.edu.br"
                  className="bg-slate-50"
                />
              </div>
              <Button type="submit" className="w-full mt-4 h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Solicitar Demonstração'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
