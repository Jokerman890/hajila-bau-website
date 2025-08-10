import { Building2, Hammer, Users, Trophy } from 'lucide-react'

function Stats() {
  return (
    <div className="w-full py-20 lg:py-40 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6">
        {/* Titel-Sektion */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Unsere Erfolge in Zahlen</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Über Jahre hinweg haben wir uns als vertrauensvoller Partner im Baugewerbe etabliert
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid text-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[var(--gold)]/25 via-[var(--blue-end)]/20 to-transparent">
            <div className="relative flex flex-col items-center justify-between gap-0 rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-md p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-full bg-[var(--blue-end)]/10 mb-6">
                <Building2 className="w-8 h-8 text-[var(--blue-end)]" />
              </div>
              <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold mb-2 brand-gradient-text">150+</h3>
              <p className="text-lg font-medium text-muted-foreground">Erfolgreich abgeschlossene Projekte</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Seit Firmengründung</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[var(--gold)]/25 via-[var(--blue-end)]/20 to-transparent">
            <div className="relative flex flex-col items-center justify-between gap-0 rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-md p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-full bg-[var(--gold)]/10 mb-6">
                <Users className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold mb-2 brand-gradient-text">500+</h3>
              <p className="text-lg font-medium text-muted-foreground">Zufriedene Kunden</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Privatpersonen & Unternehmen</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[var(--gold)]/25 via-[var(--blue-end)]/20 to-transparent">
            <div className="relative flex flex-col items-center justify-between gap-0 rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-md p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-full bg-[var(--blue-end)]/10 mb-6">
                <Hammer className="w-8 h-8 text-[var(--blue-end)]" />
              </div>
              <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold mb-2 brand-gradient-text">15+</h3>
              <p className="text-lg font-medium text-muted-foreground">Jahre Erfahrung</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Im Baugewerbe</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[var(--gold)]/25 via-[var(--blue-end)]/20 to-transparent">
            <div className="relative flex flex-col items-center justify-between gap-0 rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-md p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-full bg-[var(--gold)]/10 mb-6">
                <Trophy className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold mb-2 brand-gradient-text">100%</h3>
              <p className="text-lg font-medium text-muted-foreground">Qualitätsgarantie</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Auf alle unsere Arbeiten</p>
            </div>
          </div>
        </div>

        {/* Zusätzliche Informationen */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[var(--blue-end)]/5 border border-[var(--blue-end)]/20">
            <span className="text-sm font-medium text-[var(--blue-end)]">✓ Zertifizierte Handwerker</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-[var(--blue-end)]">✓ Termingerechte Umsetzung</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-[var(--blue-end)]">✓ Faire Preise</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Stats }
