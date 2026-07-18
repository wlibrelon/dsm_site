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
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Droplets, Calculator, Map, Building2 } from 'lucide-react'

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
  const [sampleSize, setSampleSize] = useState(30)
  const estatisticaData = useMemo(() => {
    const variance = 100 / Math.sqrt(sampleSize)
    return [
      { name: 'Grupo A', value: 50 + Math.random() * variance },
      { name: 'Grupo B', value: 55 - Math.random() * variance },
    ]
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-slate-800/50 p-1 rounded-xl mb-8">
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
            <TabsTrigger
              value="gestao"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
            >
              <Building2 className="w-4 h-4 mr-2" /> Gestão
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
                    Demonstrando o efeito do tamanho da amostra na variância entre grupos.
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
                </div>
                <div className="p-8 md:w-2/3 h-[300px]">
                  <ChartContainer
                    config={{ value: { label: 'Média', color: 'hsl(var(--primary))' } }}
                    className="h-full w-full"
                  >
                    <BarChart data={estatisticaData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                      />
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

          {/* Tab 4: Gestão (Static Mock) */}
          <TabsContent value="gestao" className="animate-fade-in">
            <Card className="bg-slate-800 border-slate-700 text-slate-100 p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center max-w-md">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                <h3 className="text-xl font-bold mb-2">Dashboards Institucionais</h3>
                <p className="text-slate-400 text-sm">
                  Coordenadores podem usar o DSM para apresentar KPIs do curso, filtrando anos e
                  disciplinas ao vivo.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
