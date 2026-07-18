import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo_dsm.png'

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'O que é', href: '#o-que-e' },
    { name: 'Como funciona', href: '#como-funciona' },
    { name: 'Recursos', href: '#recursos' },
    { name: 'Casos de Uso', href: '#casos-de-uso' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-border shadow-sm py-2'
            : 'bg-transparent py-3',
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Dynamic Slide Maker"
              className="w-[243px] md:w-[292px] h-auto object-contain rounded-md"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white rounded-md shadow-subtle"
            >
              <a href="#solicitar-acesso">Solicitar Acesso</a>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base font-medium py-2 text-foreground border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button asChild className="w-full mt-2">
              <a href="#solicitar-acesso" onClick={() => setIsMobileMenuOpen(false)}>
                Solicitar Acesso
              </a>
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 pt-[150px] md:pt-[180px]">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center mb-4">
                <img
                  src={logoImg}
                  alt="Dynamic Slide Maker"
                  className="w-[195px] md:w-[243px] h-auto object-contain rounded-md"
                />
              </Link>
              <p className="text-slate-400 max-w-sm">
                Slides Dinâmicos com Simulação Matemática. Uma plataforma voltada a professores de
                todos os níveis de ensino.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#o-que-e" className="hover:text-white transition-colors">
                    O que é
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-white transition-colors">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-white transition-colors">
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#solicitar-acesso" className="hover:text-white transition-colors">
                    Solicitar Acesso
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contato@dynamicslidemaker.com.br"
                    className="hover:text-white transition-colors"
                  >
                    Suporte Institucional
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Dynamic Slide Maker. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                Termos
              </a>
              <a href="#" className="hover:text-white">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
