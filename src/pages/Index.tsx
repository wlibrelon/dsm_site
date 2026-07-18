import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Process } from '@/components/sections/Process'
import { Features } from '@/components/sections/Features'
import { UseCases } from '@/components/sections/UseCases'
import { Audience } from '@/components/sections/Audience'
import { CallToAction } from '@/components/sections/CallToAction'

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Problem />
      <Process />
      <Features />
      <UseCases />
      <Audience />
      <CallToAction />
    </div>
  )
}

export default Index
