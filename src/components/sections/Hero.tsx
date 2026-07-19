import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PlayCircle, Activity } from 'lucide-react'

export function Hero() {
  const [multiplier, setMultiplier] = useState(2.5)
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsUpdating(true)
    const timer = setTimeout(() => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.5) * multiplier + i * 0.2,
      }))
      setChartData(data)
      setIsUpdating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [multiplier])

  const chartConfig = {
    y: { label: 'Resultado', color: 'hsl(var(--accent))' },
  }

  return (
    <section id="inicio" className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Activity className="mr-2 h-4 w-4" />
              Uma categoria nova de aula, não mais um app de slides
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Slides que respondem em <span className="text-primary">tempo real</span> ao que você
              digita.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Por fora, uma apresentação normal. Por dentro, um cálculo de verdade rodando em cada
              slide — sem você precisar programar. Mude um número na hora da aula e o gráfico
              muda com ele, para a turma toda ver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg">
                <a href="#suporte">Fale conosco</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                <a href="#como-funciona">
                  <PlayCircle className="mr-2 h-5 w-5" /> Ver como funciona
                </a>
              </Button>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-lg lg:max-w-none animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {/* Interactive Mockup */}
            <div className="rounded-xl border border-border bg-white shadow-2xl overflow-hidden flex flex-col h-[400px]">
              <div className="bg-slate-100 border-b px-4 py-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" /> Live Python
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="font-serif font-bold text-xl mb-4 text-slate-800">
                  Crescimento Populacional
                </h3>
                <div className="grid grid-cols-3 gap-6 h-full">
                  <div className="col-span-1 flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="taxa"
                        className="text-xs text-slate-500 uppercase tracking-wider"
                      >
                        Taxa de Crescimento
                      </Label>
                      <Input
                        id="taxa"
                        type="number"
                        step="0.5"
                        value={multiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="font-mono text-lg border-primary/30 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">População Final Prevista</p>
                      <p
                        className={`text-xl font-bold font-mono text-primary transition-opacity ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                      >
                        {((chartData[chartData.length - 1]?.y || 0) * 1000).toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`col-span-2 relative transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="x" hide />
                        <YAxis hide domain={['dataMin', 'dataMax']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke="var(--color-y)"
                          strokeWidth={3}
                          dot={false}
                          animationDuration={300}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
