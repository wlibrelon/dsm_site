import { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ErrorBar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Droplets, Calculator, Map } from 'lucide-react'

export function UseCases() {
  // Hidrologia State
  const [flow, setFlow] = useState(50)
  const hidrologiaData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      x: i,
      y: flow * 0.1 * Math.pow(i, 1.5) + 10,
    }))
  }, [flow])

  // Estatística State
  // Simulação real de amostragem: sorteia n notas de cada turma a partir de
  // populações normais conhecidas (Turma A ~ N(50, 10), Turma B ~ N(55, 10))
  // e calcula um teste t de Welch de verdade sobre as amostras sorteadas.
  const [sampleSize, setSampleSize] = useState(30)
  const estatistica = useMemo(() => {
    const n = Math.max(2, Math.round(sampleSize))
    const trueMeanA = 50
    const trueMeanB = 55
    const populationSD = 10

    // Box-Muller: gera uma variável aleatória normal padrão
    const randNormal = () => {
      const u1 = Math.random() || 1e-9
      const u2 = Math.random()
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    }

    const sampleA = Array.from({ length: n }, () => trueMeanA + randNormal() * populationSD)
    const sampleB = Array.from({ length: n }, () => trueMeanB + randNormal() * populationSD)

    const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length
    const stdDev = (arr: number[], m: number) =>
      Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1))

    const meanA = mean(sampleA)
    const meanB = mean(sampleB)
    const sdA = stdDev(sampleA, meanA)
    const sdB = stdDev(sampleB, meanB)

    // Teste t de Welch (variâncias amostrais não assumidas iguais)
    const seA = sdA / Math.sqrt(n)
    const seB = sdB / Math.sqrt(n)
    const seDiff = Math.sqrt(seA ** 2 + seB ** 2)
    const tStat = (meanB - meanA) / seDiff

    return {
      chartData: [
        { name: 'Grupo A', value: meanA, se: seA },
        { name: 'Grupo B', value: meanB, se: seB },
      ],
      tStat,
      seDiff,
      // |t| > ~2 é a regra prática para p < 0.05 quando n não é muito pequeno
      significant: Math.abs(tStat) > 2,
    }
  }, [sampleSize])

  return (
    <section id="casos-de-uso" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            Aplicações Reais em Sala de Aula
          </h2>
          <p className="text-lg text-slate-400">
            Veja como diferentes disciplinas utilizam o DSM para explicar conceitos complexos.
          </p>
        </div>

        <Tabs defaultValue="hidrologia" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 bg-slate-800/50 p-1 rounded-xl mb-8">
            <TabsTrigger
              value="hidrologia"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
            >
              <Droplets className="w-4 h-4 mr-2" /> Hidrologia
            </TabsTrigger>
            <TabsTrigger
              value="estatistica"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
            >
              <Calculator className="w-4 h-4 mr-2" /> Estatística
            </TabsTrigger>
            <TabsTrigger
              value="geociencias"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
            >
              <Map className="w-4 h-4 mr-2" /> Geociências
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Hidrologia */}
          <TabsContent value="hidrologia" className="animate-fade-in">
            <Card className="bg-slate-800 border-slate-700 text-slate-100 overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 bg-slate-800/50">
                  <h3 className="text-xl font-bold mb-2">Carga Hidráulica vs Vazão</h3>
                  <p className="text-sm text-slate-400 mb-8">
                    Simulação da perda de carga em tubulações baseada na vazão de entrada.
                  </p>
                  <div className="space-y-4">
                    <Label htmlFor="vazao" className="text-slate-300">
                      Vazão (L/s)
                    </Label>
                    <Input
                      id="vazao"
                      type="number"
                      value={flow}
                      onChange={(e) => setFlow(Number(e.target.value) || 0)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="p-8 md:w-2/3 h-[300px]">
                  <ChartContainer
                    config={{ y: { label: 'Carga', color: 'hsl(var(--accent))' } }}
                    className="h-full w-full"
                  >
                    <LineChart data={hidrologiaData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="x" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="var(--color-y)"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Estatística */}
          <TabsContent value="estatistica" className="animate-fade-in">
            <Card className="bg-slate-800 border-slate-700 text-slate-100 overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 bg-slate-800/50">
                  <h3 className="text-xl font-bold mb-2">Teste de Hipótese (T-test)</h3>
                  <p className="text-sm text-slate-400 mb-8">
                    Notas de duas turmas (populações reais N(50,10) e N(55,10)) são sorteadas a
                    cada amostra. Veja como o tamanho da amostra afeta a confiança na diferença
                    entre as médias.
                  </p>
                  <div className="space-y-4">
                    <Label htmlFor="amostra" className="text-slate-300">
                      Tamanho da Amostra (n)
                    </Label>
                    <Input
                      id="amostra"
                      type="number"
                      value={sampleSize}
                      min={2}
                      max={1000}
                      onChange={(e) => setSampleSize(Number(e.target.value) || 2)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="mt-6 p-3 bg-slate-900/60 rounded-lg border border-slate-700 space-y-1">
                    <p className="text-xs text-slate-400">
                      Estatística t ={' '}
                      <span className="font-mono text-white">{estatistica.tStat.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Erro padrão da diferença ={' '}
                      <span className="font-mono text-white">{estatistica.seDiff.toFixed(2)}</span>
                    </p>
                    <p
                      className={`text-xs font-medium ${estatistica.significant ? 'text-emerald-400' : 'text-amber-400'}`}
                    >
                      {estatistica.significant
                        ? 'Diferença estatisticamente significativa (|t| > 2)'
                        : 'Amostra pequena demais para confirmar a diferença (|t| ≤ 2)'}
                    </p>
                  </div>
                </div>
                <div className="p-8 md:w-2/3 h-[300px]">
                  <ChartContainer
                    config={{ value: { label: 'Média', color: 'hsl(var(--primary))' } }}
                    className="h-full w-full"
                  >
                    <BarChart data={estatistica.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                      >
                        <ErrorBar dataKey="se" width={4} strokeWidth={2} stroke="#f97316" />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Geociências (Static Mock) */}
          <TabsContent value="geociencias" className="animate-fade-in">
            <Card className="bg-slate-800 border-slate-700 text-slate-100 p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center max-w-md">
                <Map className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                <h3 className="text-xl font-bold mb-2">Mapas Regionais Dinâmicos</h3>
                <p className="text-slate-400 text-sm">
                  Renderize shapefiles em tempo real filtrados por dados demográficos digitados
                  durante a aula.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
