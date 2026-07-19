import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

// E-mail que recebe as mensagens de suporte.
// O FormSubmit envia um e-mail de confirmação para este endereço na primeira submissão;
// é preciso clicar no link de confirmação para ativar o recebimento.
const SUPORTE_EMAIL = 'contato@dynamicslidemaker.com.br'

export function CallToAction() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('_subject', 'Nova mensagem de suporte - DSM')
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${SUPORTE_EMAIL}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) throw new Error('Falha no envio')

      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Vamos responder no e-mail informado em breve.',
      })
      form.reset()
    } catch {
      toast({
        title: 'Não foi possível enviar sua mensagem',
        description: 'Tente novamente em instantes ou escreva direto para ' + SUPORTE_EMAIL + '.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="suporte"
      className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
              Precisa de ajuda ou tem uma dúvida?
            </h2>
            <p className="text-slate-500 mb-6 text-lg">
              Fale com a gente — dúvidas sobre instalação, uso do DSM em sala de aula ou qualquer
              outro assunto.
            </p>
          </div>

          <div className="w-full md:w-[400px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Nome
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
                <Label htmlFor="email" className="text-slate-700">
                  E-mail
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
              <div className="space-y-2">
                <Label htmlFor="mensagem" className="text-slate-700">
                  Mensagem
                </Label>
                <Textarea
                  id="mensagem"
                  name="Mensagem"
                  required
                  placeholder="Conte como podemos ajudar..."
                  className="bg-slate-50 min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full mt-4 h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
